# AYDEM project state

Updated: 2026-09-18

## Current build

- Local self-contained prototype in `index.html`, `app.js`, `styles.css`, `selection-fix.css`, and `design-refresh.css`.
- Home, Learn, Practice, Glossary, device chooser, accessibility controls, and persistent local browser state are working.
- Module 1 currently exposes the identification, result, account, and Windows route pages.
- The Windows Store step uses the supplied Microsoft Store search capture and directs to the requested search URL.
- The File Explorer teaching image uses the supplied cropped installer-only capture; the wider personal File Explorer image is not rendered.
- Safe Practice uses real browser text selection and the learner's native Copy/Paste action. It is a reusable resource, not the next lesson in Module 3.
- Module 3 now has a screen tour plus five independently addressable lesson routes: `#lesson5`, `#lesson5-2`, `#lesson5-3`, `#lesson5-4`, and `#lesson5-5`.

## Logic correction completed this pass

The Module 2 and Module 3 screen/download flows previously sent their primary next-step buttons to `#practice`, which made a learner appear to go backward into select/copy/paste. Module 2 now continues to Module 3, and Module 3 now continues to Lesson 2. Safe Practice remains an explicit secondary resource link. Each Module 3 lesson has a visible five-part lesson navigator and forward/back links.

## Known approval boundary

The Windows ChatGPT web reference was checked against the live signed-out ChatGPT screen. The iPhone/iPad, Android, and Mac tabs are clearly labeled device views until exact current captures for those surfaces are supplied and reviewed. Do not approve those views as pixel-identical device evidence yet.

## Next bounded milestone

Replace the remaining device-view illustrations with current, privacy-safe captures for each selected platform, then run the route/link/accessibility QA loop in `design-qa.md` before expanding content further.
