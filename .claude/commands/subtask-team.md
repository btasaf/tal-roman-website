---
description: צוות: הצגת כל חברות הצוות, מתי להשתמש בכל אחת, והצעה מה כדאי עכשיו
---

Show the user the agent team (in the user's language — Hebrew for Tal), as a short table:

| פקודה | מה עושה | מתי כדאי |
|---|---|---|
| `/subtask-page-builder` | בונה/משפצת דף או סקשן בסגנון v2 | דף חדש, דף נחיתה, פריסייל, עיצוב מחדש |
| `/subtask-visual-qa` | בדיקת תצוגה בכל הגדלים (תמיד ברקע) | אחרי כל שינוי עיצובי או דף חדש |
| `/subtask-tracking-auditor` | בודקת מעקב, טפסים ו-CRM | אחרי שינוי בטפסים/כפתורים, לפני השקה |
| `/subtask-content-editor` | שינויי תוכן בסניטי בצורה בטוחה | טקסטים, מחירים, המלצות, קישורים |
| `/subtask-legal-reviewer` | פרטיות, נגישות, תנאי שימוש, הסכמות | טופס חדש, כלי מעקב חדש, שינוי בדפי משפט |
| `/subtask-copy-writer` | טקסטים בעברית בקול של טל | דף חדש, טקסט שלא "יושב", רוצים חלופות |
| `/subtask` | עוזרת כללית לכל משימה אחרת | כל משימה גדולה שאין לה תפקיד קבוע |
| `/subtask-status` | יומן הסטטוס של הצוות | "מה רץ עכשיו?" |

Then look at the current conversation and the status log (`.claude/status/agents.md`) and suggest the 1–2 most useful agents to send right now, with a one-line reason each.
