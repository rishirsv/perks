---
name: issue
description: Capture one actionable bug/issue as a file-based issue doc.
---

# 🧷 <title>

## 🧾 Summary
Describe the issue or bug in 1-3 sentences.

## 📍 Where
- Route/area:
- Component/module:
- File(s) (if known):

## 🔁 Steps to reproduce
1. ...
2. ...

## 🎯 Expected
- ...

## 💥 Actual
- ...

## 🚨 Impact
<Who/what breaks, how often, how bad.>

## 📸 Evidence
- Screenshot/video:
- Logs/stack traces/failing tests:

## 🗒️ Notes
- Environment (browser/runtime/version):
- Viewport (if UI):
- Data (fixtures vs real):
- Frequency (optional):
- Workaround (optional):
- Suspected cause (optional):

---

# 🧷 Batch format (multiple issues)

If you are capturing multiple related issues in a single document, use this structure instead:

```markdown
# 🧷 Issues: <group title>

Context (optional):
- App/URL:
- Routes/areas:
- Browser/runtime:
- Viewport (if UI):
- Branch/commit:

## 🧾 Index
- [ ] 🧷 <Issue title 1>
- [ ] 🧷 <Issue title 2>

---

## 🧷 <Issue title 1>

## 🧾 Summary
Describe the issue or bug in 1-3 sentences.

## 📍 Where
- Route/area:
- Component/module:
- File(s) (if known):

## 🔁 Steps to reproduce
1. ...
2. ...

## 🎯 Expected
- ...

## 💥 Actual
- ...

## 🚨 Impact
<Who/what breaks, how often, how bad.>

## 📸 Evidence
- Screenshot/video:
- Logs/stack traces/failing tests:

## 🗒️ Notes
- Environment (browser/runtime/version):
- Viewport (if UI):
- Data (fixtures vs real):
- Frequency (optional):
- Workaround (optional):
- Suspected cause (optional):

---

## 🧷 <Issue title 2>

<Repeat the same sections as above.>
```
