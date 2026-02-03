#!/usr/bin/env python3
"""
Data Room Verification Script for M&A Data Room Simulator.

Validates all cross-document consistency:
- Universal checks (TB balance, BS equation, payroll tie, AR/AP aging)
- Industry-specific checks (MRR, WIP, inventory, etc.)
- QoE issue detection (for Realistic/Messy modes)

Usage:
    python verify_data_room.py [--seed-file path/to/company_seed.json]
"""

import argparse
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

import pandas as pd

# Constants
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
PROFILES_DIR = PROJECT_DIR / "profiles"
OUTPUT_DIR = PROJECT_DIR / "output"


def load_seed(seed_path: Path) -> dict:
    """Load company seed from JSON file."""
    with open(seed_path) as f:
        return json.load(f)


def load_profile(industry: str) -> dict:
    """Load industry profile from JSON file."""
    profile_path = PROFILES_DIR / f"{industry}.json"
    with open(profile_path) as f:
        return json.load(f)


def load_excel(filename: str) -> pd.DataFrame:
    """Load Excel file from output directory."""
    path = OUTPUT_DIR / filename
    if not path.exists():
        return None
    return pd.read_excel(path)


class Check:
    """Represents a single verification check."""

    def __init__(self, name: str, description: str, passed: bool, details: str = ""):
        self.name = name
        self.description = description
        self.passed = passed
        self.details = details

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "passed": bool(self.passed),  # Ensure native Python bool
            "details": self.details,
        }


def run_universal_checks(seed: dict) -> List[Check]:
    """Run checks that apply to all industries."""

    checks = []

    # Load files
    tb = load_excel("trial_balance.xlsx")
    is_df = load_excel("income_statement.xlsx")
    bs = load_excel("balance_sheet.xlsx")
    ar_aging = load_excel("ar_aging.xlsx")
    ap_aging = load_excel("ap_aging.xlsx")
    employees = load_excel("employee_census.xlsx")

    # Check 1: Trial Balance Exists
    if tb is None:
        checks.append(Check(
            "trial_balance_exists",
            "Trial balance file exists",
            False,
            "trial_balance.xlsx not found"
        ))
        return checks

    checks.append(Check(
        "trial_balance_exists",
        "Trial balance file exists",
        True,
        f"{len(tb)} periods"
    ))

    # Check 2: Balance Sheet Equation (A = L + E)
    if bs is not None:
        for _, row in bs.iterrows():
            year = row["year"]
            assets = row["total_assets"]
            liabilities = row["total_liabilities"]
            equity = row["total_equity"]
            diff = abs(assets - liabilities - equity)

            if diff > 1:
                checks.append(Check(
                    f"bs_equation_{year}",
                    f"Balance sheet equation (A = L + E) for {year}",
                    False,
                    f"Assets: ${assets:,.0f}, L+E: ${liabilities + equity:,.0f}, Diff: ${diff:,.0f}"
                ))
            else:
                checks.append(Check(
                    f"bs_equation_{year}",
                    f"Balance sheet equation (A = L + E) for {year}",
                    True,
                    f"Assets = ${assets:,.0f}"
                ))

    # Check 3: Income Statement Revenue Consistency
    if is_df is not None and tb is not None:
        for _, row in is_df.iterrows():
            year = row["year"]
            is_revenue = row["revenue"]

            tb_year = tb[tb["year"] == year]
            tb_revenue = tb_year["total_revenue"].sum()

            diff_pct = abs(is_revenue - tb_revenue) / is_revenue * 100 if is_revenue > 0 else 0

            checks.append(Check(
                f"revenue_consistency_{year}",
                f"Revenue consistency between IS and TB for {year}",
                diff_pct < 0.1,
                f"IS: ${is_revenue:,.0f}, TB: ${tb_revenue:,.0f}"
            ))

    # Check 4: AR Aging Ties to Balance Sheet
    if ar_aging is not None and bs is not None:
        ar_aging_total = ar_aging[ar_aging["bucket"] == "Total"]["amount"].iloc[0]
        bs_ar = bs.iloc[-1]["accounts_receivable"]

        diff_pct = abs(ar_aging_total - bs_ar) / bs_ar * 100 if bs_ar > 0 else 0

        checks.append(Check(
            "ar_aging_tie",
            "AR aging total ties to balance sheet AR",
            diff_pct < 1,
            f"Aging: ${ar_aging_total:,.0f}, BS: ${bs_ar:,.0f}"
        ))

    # Check 5: AP Aging Ties to Balance Sheet
    if ap_aging is not None and bs is not None:
        ap_aging_total = ap_aging[ap_aging["bucket"] == "Total"]["amount"].iloc[0]
        bs_ap = bs.iloc[-1]["accounts_payable"]

        diff_pct = abs(ap_aging_total - bs_ap) / bs_ap * 100 if bs_ap > 0 else 0

        checks.append(Check(
            "ap_aging_tie",
            "AP aging total ties to balance sheet AP",
            diff_pct < 1,
            f"Aging: ${ap_aging_total:,.0f}, BS: ${bs_ap:,.0f}"
        ))

    # Check 6: Headcount Tie
    if employees is not None:
        target_headcount = seed["financials"]["headcount"]
        actual_headcount = len(employees)

        checks.append(Check(
            "headcount_tie",
            "Employee headcount matches company seed",
            abs(target_headcount - actual_headcount) <= 3,
            f"Target: {target_headcount}, Actual: {actual_headcount}"
        ))

    return checks


def run_saas_checks(seed: dict, profile: dict) -> List[Check]:
    """Run SaaS-specific checks."""

    checks = []

    mrr = load_excel("mrr_analysis.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if mrr is None or tb is None:
        return checks

    # Check: MRR ties to revenue
    for _, mrr_row in mrr.iterrows():
        period = mrr_row["period"]
        mrr_revenue = mrr_row["total_mrr"]

        tb_row = tb[tb["period"] == period]
        if len(tb_row) > 0:
            tb_revenue = tb_row.iloc[0]["total_revenue"]
            diff_pct = abs(mrr_revenue - tb_revenue) / tb_revenue * 100 if tb_revenue > 0 else 0

            # Just check a few periods
            if period.endswith("-12"):  # December
                checks.append(Check(
                    f"mrr_revenue_tie_{period}",
                    f"MRR ties to P&L revenue for {period}",
                    diff_pct < 0.1,
                    f"MRR: ${mrr_revenue:,.0f}, P&L: ${tb_revenue:,.0f}"
                ))

    # Check: ARR calculation
    latest_mrr = mrr.iloc[-1]["total_mrr"]
    latest_arr = mrr.iloc[-1]["arr"]
    expected_arr = latest_mrr * 12

    checks.append(Check(
        "arr_calculation",
        "ARR = MRR × 12",
        abs(latest_arr - expected_arr) < 1,
        f"MRR: ${latest_mrr:,.0f}, ARR: ${latest_arr:,.0f}"
    ))

    return checks


def run_construction_checks(seed: dict, profile: dict) -> List[Check]:
    """Run construction-specific checks."""

    checks = []

    wip = load_excel("wip_schedule.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if wip is None or tb is None:
        return checks

    # Check: WIP revenue ties to P&L
    total_wip_revenue = wip["revenue_recognized"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_wip_revenue - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "wip_revenue_tie",
        "WIP revenue recognized ties to P&L",
        diff_pct < 0.1,
        f"WIP: ${total_wip_revenue:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_manufacturing_checks(seed: dict, profile: dict) -> List[Check]:
    """Run manufacturing-specific checks."""

    checks = []

    invoices = load_excel("invoice_register.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if invoices is None or tb is None:
        return checks

    # Check: Invoice totals tie to revenue
    total_invoices = invoices["amount"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_invoices - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "invoice_revenue_tie",
        "Invoice totals tie to P&L revenue",
        diff_pct < 0.1,
        f"Invoices: ${total_invoices:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_services_checks(seed: dict, profile: dict) -> List[Check]:
    """Run professional services-specific checks."""

    checks = []

    wip = load_excel("wip_schedule.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if wip is None or tb is None:
        return checks

    # Check: Billed revenue ties to P&L
    total_billed = wip["billed_revenue"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_billed - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "billed_revenue_tie",
        "Billed revenue ties to P&L",
        diff_pct < 0.1,
        f"Billed: ${total_billed:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_retail_checks(seed: dict, profile: dict) -> List[Check]:
    """Run retail-specific checks."""

    checks = []

    transactions = load_excel("sales_transactions.xlsx")
    tb = load_excel("trial_balance.xlsx")

    if transactions is None or tb is None:
        return checks

    # Check: Transaction totals tie to revenue
    total_transactions = transactions["amount"].sum()
    total_tb_revenue = tb["total_revenue"].sum()

    diff_pct = abs(total_transactions - total_tb_revenue) / total_tb_revenue * 100 if total_tb_revenue > 0 else 0

    checks.append(Check(
        "transaction_revenue_tie",
        "Sales transaction totals tie to P&L revenue",
        diff_pct < 0.1,
        f"Transactions: ${total_transactions:,.0f}, P&L: ${total_tb_revenue:,.0f}"
    ))

    return checks


def run_qoe_checks(seed: dict, profile: dict) -> List[dict]:
    """Detect QoE issues (for Realistic/Messy modes)."""

    issues = []
    realism_mode = seed["metadata"]["realism_mode"]

    if realism_mode == "clean":
        return issues

    # Check events for one-time items
    events = seed.get("events", [])
    for event in events:
        if event.get("one_time"):
            issues.append({
                "type": "one_time_event",
                "date": event["date"],
                "description": event["description"],
                "impact": event.get("financial_impact", 0),
                "category": event["type"],
            })

    # Check for customer losses
    customer_losses = [e for e in events if e.get("type") == "customer_loss"]
    if customer_losses:
        issues.append({
            "type": "customer_churn",
            "description": f"{len(customer_losses)} customer losses identified",
            "total_impact": sum(e.get("revenue_impact", 0) for e in customer_losses),
            "category": "revenue_risk",
        })

    # Industry-specific QoE flags from profile
    qoe_adjustments = profile.get("qoe_adjustments", {})

    if realism_mode in ["realistic", "messy"]:
        for adj in qoe_adjustments.get("common", []):
            issues.append({
                "type": "potential_adjustment",
                "description": adj,
                "category": "qoe_common",
            })

        for adj in qoe_adjustments.get("owner_addbacks", []):
            issues.append({
                "type": "owner_addback",
                "description": adj,
                "category": "qoe_addback",
            })

    return issues


def main():
    parser = argparse.ArgumentParser(
        description="Verify data room consistency"
    )
    parser.add_argument(
        "--seed-file",
        default=str(OUTPUT_DIR / "company_seed.json"),
        help="Path to company seed JSON file"
    )
    parser.add_argument(
        "--output",
        default=str(OUTPUT_DIR / "verification_report.json"),
        help="Output file for verification report"
    )

    args = parser.parse_args()

    # Load seed
    seed_path = Path(args.seed_file)
    if not seed_path.exists():
        print(f"Error: Seed file not found: {seed_path}")
        exit(1)

    seed = load_seed(seed_path)
    industry = seed["metadata"]["industry"]
    profile = load_profile(industry)

    print(f"Verifying data room for {seed['company']['name']}...")
    print(f"  Industry: {profile['display_name']}")
    print(f"  Realism Mode: {seed['metadata']['realism_mode']}")
    print()

    # Run checks
    all_checks = []

    print("Running universal checks...")
    all_checks.extend(run_universal_checks(seed))

    print(f"Running {industry} industry checks...")
    industry_checks = {
        "saas": run_saas_checks,
        "construction": run_construction_checks,
        "manufacturing": run_manufacturing_checks,
        "professional_services": run_services_checks,
        "retail": run_retail_checks,
    }

    if industry in industry_checks:
        all_checks.extend(industry_checks[industry](seed, profile))

    # Run QoE checks
    print("Checking for QoE issues...")
    qoe_issues = run_qoe_checks(seed, profile)

    # Build report
    passed_checks = [c for c in all_checks if c.passed]
    failed_checks = [c for c in all_checks if not c.passed]

    report = {
        "generated_at": datetime.now().isoformat(),
        "company": seed["company"]["name"],
        "industry": industry,
        "realism_mode": seed["metadata"]["realism_mode"],
        "status": "pass" if len(failed_checks) == 0 else "fail",
        "summary": {
            "total_checks": len(all_checks),
            "passed": len(passed_checks),
            "failed": len(failed_checks),
            "qoe_issues": len(qoe_issues),
        },
        "checks": [c.to_dict() for c in all_checks],
        "qoe_issues": qoe_issues,
    }

    # Save report
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(report, f, indent=2)

    # Print results
    print()
    print("=" * 60)
    print("VERIFICATION RESULTS")
    print("=" * 60)
    print()

    print(f"  Total Checks: {len(all_checks)}")
    print(f"  Passed: {len(passed_checks)}")
    print(f"  Failed: {len(failed_checks)}")
    print()

    if failed_checks:
        print("FAILED CHECKS:")
        for check in failed_checks:
            print(f"  ✗ {check.name}: {check.description}")
            print(f"    {check.details}")
        print()

    if qoe_issues:
        print(f"QoE ISSUES DETECTED ({len(qoe_issues)}):")
        for issue in qoe_issues[:10]:  # Show first 10
            print(f"  ⚠ {issue['type']}: {issue['description']}")
        if len(qoe_issues) > 10:
            print(f"  ... and {len(qoe_issues) - 10} more")
        print()

    if report["status"] == "pass":
        print("✓ All checks PASSED")
    else:
        print("✗ Some checks FAILED")

    print()
    print(f"Full report saved to: {output_path}")


if __name__ == "__main__":
    main()
