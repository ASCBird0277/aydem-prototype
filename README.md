# AYDEM Prototype

AYDEM — Technology, taught human.

This is a self-contained local prototype for the first AYDEM build increment. Open `index.html` in a browser. It does not require a server, account, API key, or paid service.

## Included

- Responsive AYDEM shell with the three-color brand pathway motif
- Home dashboard and progress saved in browser local storage
- Device-path selection
- Normal, Large, and Extra Large text modes
- Standard, High Contrast, and Low-Glare themes
- AYDEM View, Where am I?, help, and read-aloud controls
- Module 1 practice for checking the official ChatGPT publisher
- Device-aware publisher practice for iPhone/iPad, Android, Windows PC, and Mac
- Numbered Name / Publisher / Source callouts anchored to the visible source fields
- Safe select/copy/paste practice that uses real browser text selection, the device's native Copy/Paste actions, and never sends a real message
- Searchable plain-language glossary
- Icon-led glossary terms with a consistent, quiet outline icon family
- Contextual message practice that teaches the learning pattern: see it, name it, locate it, do it, and check the result
- Selection feedback states: red incomplete, green complete, slow red attention cue for the next native action, and green confirmation after Copy
- Print styling for the Module 1 companion sheet
- In-page device chooser for iPhone/iPad, Android, Windows PC, and Mac

## Important prototype boundary

The publisher lesson no longer uses invented look-alike app cards. It uses current official source records: the Apple App Store ChatGPT listing, the Google Play ChatGPT listing, and the official ChatGPT web source. Search-result layout and browser chrome can vary by browser, account, region, and date; the lesson links to the official live source and treats the user-provided desktop capture as a visual reference rather than claiming a universal static search result.

The approved AYDEM 3D seal is installed at `assets\aydem-approved-3d-seal.png` and is used in both the main hero and compact header. The practice sentence is ordinary selectable text: learners must highlight it by dragging or by touch-and-hold selection, then use the real Copy and Paste actions for the selected device. No invented Copy or Paste buttons are used.

The Windows Module 1 flow is split into four pages: identify the result, open the official result, review the real sign-in/create-account screen, and follow the Microsoft Store download path. The supplied Windows reference screenshots are preserved in `assets\windows-chatgpt-result.png`, `assets\chatgpt-signup-screen.png`, `assets\official-chatgpt-desktop-download.png`, and `assets\official-chatgpt-mobile-download.png`. The Microsoft Store search evidence is now embedded at `assets\microsoft-store-chatgpt-search.png`; Lesson 4 directs learners to the top-middle `ChatGPT` listing from OpenAI and distinguishes it from `ChatGPT Classic` and look-alike apps.
The privacy-safe File Explorer evidence shown in Lesson 4 is the supplied cropped installer-only image at `assets\aydem-windows-chatgpt-installer-list.png`; it omits the user's real folders, profile, and unrelated files. The original wider capture is not used in the lesson. The Microsoft Store source link used in the lesson is `https://apps.microsoft.com/search?query=chat+gpt&hl=en-US&gl=US`.

The home learning path now makes all three module cards keyboard- and mouse-accessible. Module 3, `Understanding the ChatGPT screen`, is available at `#lesson5` and introduces the plus button, `Add photos & files`, screenshot privacy checks, and a local file-picker rehearsal that does not upload or send anything.

Module 3 now includes an interactive screen-tour layer: device tabs for Windows, iPhone/iPad, Android, and Mac; numbered hotspots; hover/focus explanations; and a click-open plus menu with `Add photos & files` and `Connect apps`. The Windows reference was checked against the live signed-out ChatGPT web screen at `https://chatgpt.com/`. The mobile and Mac tabs are deliberately labeled as device views until exact captures for those surfaces are added; they do not claim one Windows screenshot applies to every device.

## Suggested next phase

Add real full-device illustrations for iOS, Android, Windows, and macOS; split lesson content into structured JSON; add automated accessibility checks and keyboard-flow tests; then expand Module 2 only after the first vertical slice is reviewed.
