import buildMcContentsAlt from '../builders/onboarded/mcContentsAlt.js';
import buildMcExecutiveSummaryKeyValue from '../builders/onboarded/mcExecutiveSummaryKeyValue.js';
import buildMcExecutiveSummaryValueProps from '../builders/onboarded/mcExecutiveSummaryValueProps.js';
import buildMcFiveBulletSlide from '../builders/onboarded/mcFiveBulletSlide.js';
import buildMcFourBulletSlide from '../builders/onboarded/mcFourBulletSlide.js';
import buildMcGuidingPrinciples from '../builders/onboarded/mcGuidingPrinciples.js';
import buildMcInsightBulletColumnsSlide from '../builders/onboarded/mcInsightBulletColumnsSlide.js';
import buildMcNumberedBulletColumnsSlide from '../builders/onboarded/mcNumberedBulletColumnsSlide.js';
import buildMcProjectOverviewMetrics from '../builders/onboarded/mcProjectOverviewMetrics.js';
import buildMcScopeStatement from '../builders/onboarded/mcScopeStatement.js';
import buildMcStageBulletGridSlide from '../builders/onboarded/mcStageBulletGridSlide.js';
import buildMcThreeBulletSlide from '../builders/onboarded/mcThreeBulletSlide.js';
import buildMcThreeQuestions from '../builders/onboarded/mcThreeQuestions.js';
import buildMcTwoBulletSlide from '../builders/onboarded/mcTwoBulletSlide.js';
import buildMcVisionStrategyFramework from '../builders/onboarded/mcVisionStrategyFramework.js';

export const ONBOARDED_REGISTRY_ENTRIES = Object.freeze({
  mcContentsAlt: Object.freeze({
  "builderId": "mcContentsAlt",
  "builder": buildMcContentsAlt,
  "master": "KPMG_SECTION_DARK",
  "requiredGeometry": [
    "titleBox",
    "topRowBox",
    "bottomRowBox"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": true
}),
  mcExecutiveSummaryKeyValue: Object.freeze({
  "builderId": "mcExecutiveSummaryKeyValue",
  "builder": buildMcExecutiveSummaryKeyValue,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcExecutiveSummaryValueProps: Object.freeze({
  "builderId": "mcExecutiveSummaryValueProps",
  "builder": buildMcExecutiveSummaryValueProps,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcFiveBulletSlide: Object.freeze({
  "builderId": "mcFiveBulletSlide",
  "builder": buildMcFiveBulletSlide,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcFourBulletSlide: Object.freeze({
  "builderId": "mcFourBulletSlide",
  "builder": buildMcFourBulletSlide,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcGuidingPrinciples: Object.freeze({
  "builderId": "mcGuidingPrinciples",
  "builder": buildMcGuidingPrinciples,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "typography"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": true
}),
  mcInsightBulletColumnsSlide: Object.freeze({
  "builderId": "mcInsightBulletColumnsSlide",
  "builder": buildMcInsightBulletColumnsSlide,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcNumberedBulletColumnsSlide: Object.freeze({
  "builderId": "mcNumberedBulletColumnsSlide",
  "builder": buildMcNumberedBulletColumnsSlide,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcProjectOverviewMetrics: Object.freeze({
  "builderId": "mcProjectOverviewMetrics",
  "builder": buildMcProjectOverviewMetrics,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "typography"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": true
}),
  mcScopeStatement: Object.freeze({
  "builderId": "mcScopeStatement",
  "builder": buildMcScopeStatement,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "typography"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": true
}),
  mcStageBulletGridSlide: Object.freeze({
  "builderId": "mcStageBulletGridSlide",
  "builder": buildMcStageBulletGridSlide,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcThreeBulletSlide: Object.freeze({
  "builderId": "mcThreeBulletSlide",
  "builder": buildMcThreeBulletSlide,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcThreeQuestions: Object.freeze({
  "builderId": "mcThreeQuestions",
  "builder": buildMcThreeQuestions,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "leftHeadingBox",
    "typography"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": true
}),
  mcTwoBulletSlide: Object.freeze({
  "builderId": "mcTwoBulletSlide",
  "builder": buildMcTwoBulletSlide,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "straplineBox",
    "columnBoxes"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": false
}),
  mcVisionStrategyFramework: Object.freeze({
  "builderId": "mcVisionStrategyFramework",
  "builder": buildMcVisionStrategyFramework,
  "master": "KPMG_WHITE",
  "requiredGeometry": [
    "titleBox",
    "typography"
  ],
  "optionalGeometry": [],
  "optionalDefaults": {},
  "paginationPolicyKey": "none.v1",
  "validationHooks": [],
  "excludeFromLogicalPaging": true
}),
});
