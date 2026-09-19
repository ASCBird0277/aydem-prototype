(() => {
  const root = document.documentElement;
  const shell = document.getElementById('appShell');
  const toast = document.getElementById('toast');
  const state = JSON.parse(localStorage.getItem('aydem-state') || '{}');
  const detectedDevice = /Windows/i.test(navigator.userAgent) ? 'Windows PC' : 'Phone & tablet';
  const storedDevice = state.device === 'Phone & tablet' && detectedDevice === 'Windows PC' ? detectedDevice : state.device;
  const saved = { text: state.text || 'normal', theme: state.theme || 'standard', device: storedDevice || detectedDevice, progress: state.progress || 1 };
  let selectedText = false;
  let copiedText = '';

  const save = () => localStorage.setItem('aydem-state', JSON.stringify(saved));
  const notify = (message) => { toast.textContent = message; toast.classList.add('show'); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2600); };
  const speak = (text) => { if (!('speechSynthesis' in window)) return notify('Read aloud is not available in this browser.'); window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.rate = .92; window.speechSynthesis.speak(utterance); };
  const setText = (value) => { saved.text = value; root.classList.remove('text-large', 'text-xl'); if (value === 'large') root.classList.add('text-large'); if (value === 'xl') root.classList.add('text-xl'); document.querySelectorAll('[data-text]').forEach((b) => b.classList.toggle('selected', b.dataset.text === value)); save(); };
  const setTheme = (value) => { saved.theme = value; root.classList.remove('theme-contrast', 'theme-glare'); if (value === 'contrast') root.classList.add('theme-contrast'); if (value === 'glare') root.classList.add('theme-glare'); document.querySelectorAll('[data-theme]').forEach((b) => b.classList.toggle('selected', b.dataset.theme === value)); save(); };
  const updateProgress = () => { const totalLessons = 13; document.getElementById('progressLabel').textContent = `${saved.progress} of ${totalLessons} lessons`; document.getElementById('progressBar').style.width = `${Math.min(100, (saved.progress / totalLessons) * 100)}%`; };
  const updateDevice = () => { const deviceLabel = document.getElementById('deviceLabel'); const pathText = document.getElementById('pathText'); const displayMenuLabel = document.getElementById('displayMenuLabel'); if (deviceLabel) deviceLabel.textContent = saved.device; if (pathText) pathText.textContent = saved.device; if (displayMenuLabel) displayMenuLabel.textContent = saved.device; const displayLabel = pathText?.parentElement?.firstChild; if (displayLabel) displayLabel.textContent = 'Display'; document.querySelectorAll('.module-device-label').forEach((label) => { label.textContent = saved.device.toUpperCase(); }); };
  const mainContent = document.getElementById('mainContent');
  let routeTransitionTimer;
  let hasRenderedRoute = false;
  const jumpToTop = () => { root.classList.add('route-changing'); window.scrollTo(0, 0); document.body.scrollTop = 0; window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.classList.remove('route-changing'))); };
  const renderRoute = (target) => {
    shell.classList.toggle('screen-tour-focus', /^(?:learn|lesson[2-5](?:-\d+)?)$/.test(target));
    document.querySelectorAll('.page-section').forEach((section) => section.classList.toggle('hidden', section.dataset.page !== target));
    document.querySelectorAll('.nav-link, .module-menu .module-link').forEach((link) => link.classList.toggle('active', link.dataset.route === target || (target === 'practice' && link.dataset.route === 'practice') || (/^lesson[2-5](?:-\d+)?$/.test(target) && ((link.dataset.route === 'learn' && (link.closest('.main-nav') || ['learn', 'lesson2', 'lesson3', 'lesson4'].includes(target))) || link.dataset.route === target))));
    document.querySelectorAll('.module-menu').forEach((menu) => { menu.open = false; });
    if (location.hash !== `#${target}`) history.pushState({}, '', `#${target}`);
    jumpToTop();
    mainContent.focus({ preventScroll: true });
    mainContent.classList.remove('route-fade-out', 'route-fade-in');
    void mainContent.offsetWidth;
    mainContent.classList.add('route-fade-in');
    window.clearTimeout(routeTransitionTimer);
    routeTransitionTimer = window.setTimeout(() => mainContent.classList.remove('route-fade-in'), 280);
    hasRenderedRoute = true;
  };
  const go = (route) => {
    const target = route || location.hash.slice(1) || 'home';
    const current = document.querySelector('.page-section:not(.hidden)')?.dataset.page;
    if (!hasRenderedRoute || current === target) { renderRoute(target); return; }
    window.clearTimeout(routeTransitionTimer);
    mainContent.classList.remove('route-fade-in');
    mainContent.classList.add('route-fade-out');
    routeTransitionTimer = window.setTimeout(() => { mainContent.classList.remove('route-fade-out'); renderRoute(target); }, 140);
  };
  const askDevice = () => { const chooser = document.getElementById('deviceModal'); chooser?.classList.remove('hidden'); chooser?.setAttribute('aria-hidden', 'false'); };

  setText(saved.text); setTheme(saved.theme); updateDevice(); updateProgress();
  const firstOpenOverlay = document.getElementById('firstOpenOverlay');
  const finishFirstOpen = () => { localStorage.setItem('aydem-intro-seen', 'true'); firstOpenOverlay?.classList.add('is-closing'); firstOpenOverlay?.setAttribute('aria-hidden', 'true'); window.setTimeout(() => { firstOpenOverlay?.classList.add('hidden'); document.getElementById('homeWelcomeTitle')?.focus({ preventScroll: true }); }, 360); };
  const firstOpenSeen = localStorage.getItem('aydem-intro-seen') === 'true';
  if (firstOpenOverlay && !firstOpenSeen) { if (location.hash !== '#home') history.replaceState({}, '', '#home'); firstOpenOverlay.classList.remove('hidden'); firstOpenOverlay.setAttribute('aria-hidden', 'false'); document.getElementById('startAydem')?.focus(); }
  document.getElementById('startAydem')?.addEventListener('click', finishFirstOpen);
  document.getElementById('skipAydem')?.addEventListener('click', finishFirstOpen);
  window.addEventListener('hashchange', () => go());
  const syncModule3Link = () => { const active = /^lesson5(?:-\d+)?$/.test(location.hash.slice(1)); document.querySelectorAll('.module-link[data-route="lesson5"]').forEach((link) => link.classList.toggle('active', active)); };
  window.addEventListener('hashchange', syncModule3Link);
  document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => go(button.dataset.go)));
  document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); go(link.dataset.route); }));
  document.getElementById('changeDevice').addEventListener('click', askDevice);
  document.getElementById('whereAmI').addEventListener('click', () => { const visible = document.querySelector('.page-section:not(.hidden)'); const names = { home: 'Home. You are viewing your learning path and next lesson.', learn: 'Learn. You are in Module 1, recognizing the real ChatGPT.', lesson2: 'Lesson 2. You are checking the official Windows result before opening it.', lesson3: 'Lesson 3. You are reviewing the real ChatGPT sign-in screen.', lesson4: 'Lesson 4. You are reviewing the official Windows download path.', practice: 'Practice room. You are practicing select, copy, and paste safely.', glossary: 'Glossary. You are looking up plain-language technology terms.' }; notify(names[visible.dataset.page]); });
  document.getElementById('helpButton').addEventListener('click', () => notify('Use Display to choose your device. The small circle toggles a calmer view.'));
  document.getElementById('aydemView').addEventListener('click', (event) => { shell.classList.toggle('aydem-view'); const on = shell.classList.contains('aydem-view'); event.currentTarget.setAttribute('aria-pressed', on); notify(on ? 'AYDEM View is on.' : 'AYDEM View is off.'); });
  document.getElementById('accessibilityToggle').addEventListener('click', (event) => { const drawer = document.getElementById('accessibilityDrawer'); const open = drawer.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', open); });
  document.getElementById('whereAmI').addEventListener('click', () => { const route = location.hash.slice(1); const module3Names = { lesson5: 'Module 3, Lesson 1. You are touring the ChatGPT screen.', 'lesson5-2': 'Module 3, Lesson 2. You are locating the message field.', 'lesson5-3': 'Module 3, Lesson 3. You are choosing Add photos and files.', 'lesson5-4': 'Module 3, Lesson 4. You are checking a screenshot for private information.', 'lesson5-5': 'Module 3, Lesson 5. You are reviewing before sending.' }; if (module3Names[route]) window.setTimeout(() => notify(module3Names[route]), 0); });
  document.querySelectorAll('[data-text]').forEach((button) => button.addEventListener('click', () => setText(button.dataset.text)));
  document.querySelectorAll('[data-theme]').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.theme)));
  document.getElementById('readHero')?.addEventListener('click', () => speak('AYDEM starts with four fundamentals: copying and pasting, screenshots, recognizing and downloading ChatGPT, and understanding the ChatGPT screen.'));
  document.getElementById('readLesson').addEventListener('click', () => speak('Before you download or sign in, learn the small clues that help you find the official ChatGPT. Look for the name ChatGPT, the publisher OpenAI, and the official app store or OpenAI website.'));
  document.getElementById('printLesson').addEventListener('click', () => window.print());

  const sentence = document.getElementById('selectableSentence'); const pasteCard = document.getElementById('pasteCard');
  const practiceTitle = document.querySelector('#practicePage .lesson-header h1');
  const practiceLede = document.querySelector('#practicePage .lesson-header .lede');
  if (practiceTitle) practiceTitle.textContent = 'Copy information to and from ChatGPT';
  if (practiceLede) practiceLede.textContent = 'Learn the same simple pattern in both directions: bring useful information into ChatGPT, then take a helpful response back out.';
  document.getElementById('hintButton').addEventListener('click', () => notify('Hint: highlight the words first. Then use your device’s real Copy action—Ctrl+C on Windows, Command+C on Mac, or Copy from the touch menu.'));
  document.getElementById('glossarySearch').addEventListener('input', (event) => { const term = event.target.value.toLowerCase(); document.querySelectorAll('.term-card').forEach((card) => card.classList.toggle('hidden', !card.textContent.toLowerCase().includes(term))); });
  // Interaction correction: selection must come from a real browser text selection,
  // not from clicking a sentence. This capture-layer keeps the prototype honest
  // while preserving the rest of the original demo state logic.
  const selectionSentence = document.getElementById('selectableSentence');
  const selectionPasteCard = document.getElementById('pasteCard');
  const selectionPasteField = document.getElementById('pasteField');
  const selectionReset = document.getElementById('resetPractice');
  const selectionFeedback = document.getElementById('practiceFeedback');
  const selectionPasteFeedback = document.getElementById('pasteFeedback');
  const selectionCompletion = document.getElementById('completionCard');
  const practiceCard = document.querySelector('#practicePage .practice-card');
  const selectionInstructions = document.getElementById('selectionInstructions');
  const practiceContextFrame = document.querySelector('#practicePage .context-frame');
  if (selectionInstructions && practiceContextFrame) {
    selectionInstructions.classList.add('selection-instructions-top');
    practiceContextFrame.insertAdjacentElement('beforebegin', selectionInstructions);
    selectionInstructions.innerHTML = '<strong>Computer:</strong> click and drag from the first word to the last. <strong>Phone or tablet:</strong> touch and hold a word, then adjust the highlighted words until the sentence is covered. <strong>Keyboard:</strong> focus this sentence and hold Shift while using the arrow keys.';
  }
  practiceCard?.insertAdjacentHTML('beforebegin', `<section class="copy-direction-guide" aria-label="Copy information in both directions">
    <div class="copy-direction-heading"><span class="eyebrow teal">TWO DIRECTIONS</span><h2>Copy moves information. It does not send it.</h2><p>Use Copy to place words on your clipboard. Use Paste to place those words somewhere else. You decide when anything is sent.</p></div>
    <div class="copy-direction-grid">
      <article class="copy-direction-card copy-direction-in"><span class="copy-direction-label">INTO CHATGPT</span><h3>Bring information into a ChatGPT message</h3><p>Highlight the useful words in a message, webpage, or document. Choose <strong>Copy</strong>. Click inside the ChatGPT message field and choose <strong>Paste</strong>. Read it once before you send anything.</p><div class="copy-direction-path"><span>Highlight</span><b>→</b><span>Copy</span><b>→</b><span>ChatGPT message field</span><b>→</b><span>Paste</span></div></article>
      <article class="copy-direction-card copy-direction-out"><span class="copy-direction-label">FROM CHATGPT</span><h3>Take a helpful response out of ChatGPT</h3><p>Highlight the part of ChatGPT’s response you want to keep. Choose <strong>Copy</strong>. Open your email, document, notes, or message and choose <strong>Paste</strong>. Check the text before you share it.</p><div class="copy-direction-path"><span>ChatGPT response</span><b>→</b><span>Highlight</span><b>→</b><span>Copy</span><b>→</b><span>Paste elsewhere</span></div></article>
    </div>
    <p class="copy-direction-safety"><strong>Remember:</strong> Copy and Paste move text. Neither one sends a ChatGPT message by itself.</p>
  </section>`);
  practiceCard?.insertAdjacentHTML('afterend', `<section class="practice-visual-guide" aria-label="Selection, copy, and paste examples">
    <div class="practice-guide-heading"><span class="eyebrow teal">SEE THE WHOLE PATTERN</span><h2>What each step looks like</h2><p>These are visual examples only. Nothing in these examples sends a message or uploads a file.</p></div>
    <div class="selection-method-grid">
      <article><span class="method-icon">🖱</span><div><strong>Computer</strong><p>Click at the beginning of the sentence, drag to the end, then release. The words become highlighted.</p></div></article>
      <article><span class="method-icon">✋</span><div><strong>Phone or tablet</strong><p>Touch and hold a word, then adjust the highlighted words until the sentence is covered.</p></div></article>
      <article><span class="method-icon">⇧</span><div><strong>Keyboard</strong><p>Focus the sentence, hold <kbd>Shift</kbd>, and use the arrow keys to extend the highlight.</p></div></article>
    </div>
    <p class="copy-guidance"><strong>After the sentence is highlighted:</strong> right-click over the highlighted words and choose <strong>Copy</strong>. On a phone, touch and hold the highlighted words, then choose Copy.</p>
    <div class="practice-stage-gallery">
      <figure><img src="assets/practice-phone-selected.png" alt="Phone message with the words to copy highlighted" /><figcaption><strong>1 · Select:</strong> highlight the words you want to copy.</figcaption></figure>
      <figure><img src="assets/practice-phone-copy-menu.png" alt="Phone copy menu opened over the highlighted message text" /><figcaption><strong>2 · Open the menu:</strong> right-click over the highlighted words, or touch and hold on a phone.</figcaption></figure>
      <figure><img src="assets/practice-phone-copy-menu.png" alt="Phone menu with Copy available for the highlighted message text" /><figcaption><strong>3 · Choose Copy:</strong> select <strong>Copy</strong> from the menu.</figcaption></figure>
      <figure><img src="assets/practice-windows-paste-empty.png" alt="Windows ChatGPT message field ready for pasted text" /><figcaption><strong>4 · Paste:</strong> click inside the ChatGPT message field.</figcaption></figure>
      <figure><img src="assets/practice-windows-paste-menu.png" alt="Windows right-click menu showing Paste in the ChatGPT field" /><figcaption><strong>5 · Choose Paste:</strong> right-click inside the field and select <strong>Paste</strong>.</figcaption></figure>
      <figure><img src="assets/practice-windows-pasted.png" alt="Windows ChatGPT message field showing pasted text" /><figcaption><strong>6 · Confirm:</strong> the text appears. Nothing has been sent.</figcaption></figure>
    </div>
  </section>`);
  let actualSelection = '';
  let actualClipboard = '';
  const selectionText = () => {
    const current = window.getSelection();
    if (!current || current.isCollapsed || !current.toString().trim()) return '';
    const inside = selectionSentence.contains(current.anchorNode) && selectionSentence.contains(current.focusNode);
    return inside ? current.toString().replace(/\s+/g, ' ').trim() : '';
  };
  const setFeedback = (state, message, nextMessage = '') => { selectionFeedback.className = `practice-feedback ${state}`; selectionFeedback.replaceChildren(); const primary = document.createElement('span'); primary.className = 'feedback-primary'; primary.textContent = message; selectionFeedback.append(primary); if (nextMessage) { const next = document.createElement('span'); next.className = 'feedback-next'; next.textContent = nextMessage; selectionFeedback.append(next); } };
  const syncActualSelection = () => {
    const highlighted = selectionText();
    const fullSentence = sentence.textContent.replace(/\s+/g, ' ').trim();
    if (highlighted) {
      actualSelection = highlighted;
      if (highlighted === fullSentence) setFeedback('is-ready', `Highlighted: “${highlighted}”.`, /Windows|Mac/i.test(saved.device) ? `Right-click the highlighted text and choose Copy, or ${copyActionText()}.` : 'Touch and hold the highlighted text, then choose Copy.');
      else setFeedback('is-partial', `Highlighted: “${highlighted}”.`, 'Keep going until the whole sentence is highlighted.');
    } else if (!actualClipboard) {
      actualSelection = '';
      setFeedback('is-idle', 'Nothing is highlighted yet.', 'Drag across a sentence or touch and hold a word.');
    }
  };
  document.addEventListener('selectionchange', syncActualSelection);
  document.addEventListener('copy', () => {
    const highlighted = selectionText();
    if (!highlighted) return;
    actualSelection = highlighted;
    actualClipboard = highlighted;
    selectionPasteCard.classList.remove('hidden');
    document.getElementById('practiceStep').textContent = '2';
    document.getElementById('practiceStatus').textContent = 'Paste it into ChatGPT';
    document.getElementById('practiceBar').style.width = '66%';
    setFeedback('is-copied', `Copied “${actualClipboard}” with your device’s real Copy action.`, 'Now use the real Paste action in the message field.');
  });
  selectionPasteField.addEventListener('paste', () => {
    window.setTimeout(() => {
      if (!selectionPasteField.value.trim()) return;
      selectionPasteFeedback.className = 'practice-feedback good';
      selectionPasteFeedback.textContent = 'Pasted. Nothing has been sent.';
      selectionCompletion.classList.remove('hidden');
      document.getElementById('practiceStep').textContent = '3';
      document.getElementById('practiceStatus').textContent = 'Complete';
      document.getElementById('practiceBar').style.width = '100%';
      saved.progress = Math.max(saved.progress, 3);
      updateProgress();
      save();
    }, 0);
  });
  selectionReset.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    actualSelection = '';
    actualClipboard = '';
    window.getSelection()?.removeAllRanges();
    selectionPasteCard.classList.add('hidden');
    selectionCompletion.classList.add('hidden');
    selectionPasteField.value = '';
    document.getElementById('practiceStep').textContent = '1';
    document.getElementById('practiceStatus').textContent = 'Select the sentence';
    document.getElementById('practiceBar').style.width = '33%';
    setFeedback('is-idle', 'Nothing is highlighted yet.', 'Drag across a sentence or touch and hold a word.');
    selectionPasteFeedback.textContent = '';
  }, true);
  const deviceModal = document.getElementById('deviceModal');
  const changeDeviceButton = document.getElementById('changeDevice');
  const closeDeviceModal = document.getElementById('closeDeviceModal');
  const refreshDeviceInstructions = () => {
    const device = saved.device;
    const mode = /Windows|PC/i.test(device) ? 'windows' : /Mac/i.test(device) ? 'mac' : 'phone';
    selectionPasteCard.classList.remove('paste-device-windows', 'paste-device-mac', 'paste-device-phone');
    selectionPasteCard.classList.add(`paste-device-${mode}`);
    document.querySelectorAll('[data-paste-device]').forEach((instruction) => instruction.classList.toggle('active', instruction.dataset.pasteDevice === mode));
  };
  const copyActionText = () => /Windows|PC/i.test(saved.device) ? 'press Ctrl+C' : /Mac/i.test(saved.device) ? 'press Command+C' : 'touch and hold, then choose Copy';
  const openDeviceModal = (event) => { event.preventDefault(); event.stopImmediatePropagation(); deviceModal.classList.remove('hidden'); deviceModal.setAttribute('aria-hidden', 'false'); deviceModal.querySelector('[data-device]')?.focus(); };
  const closeDeviceChooser = () => { deviceModal.classList.add('hidden'); deviceModal.setAttribute('aria-hidden', 'true'); };
  changeDeviceButton.addEventListener('click', openDeviceModal, true);
  closeDeviceModal.addEventListener('click', closeDeviceChooser);
  deviceModal.addEventListener('click', (event) => { if (event.target === deviceModal) closeDeviceChooser(); });
  document.querySelectorAll('[data-device]').forEach((choice) => choice.addEventListener('click', () => { saved.device = choice.dataset.device; updateDevice(); refreshDeviceInstructions(); save(); closeDeviceChooser(); choice.closest('.display-menu')?.removeAttribute('open'); notify(`Display set to ${saved.device}.`); }));
  refreshDeviceInstructions();
  syncActualSelection();
  const publisherSurface = document.getElementById('publisherSurface');
  const publisherSurfaceLabel = document.getElementById('publisherSurfaceLabel');
  const sourceName = document.getElementById('sourceName');
  const sourcePublisher = document.getElementById('sourcePublisher');
  const sourceUrl = document.getElementById('sourceUrl');
  const publisherData = {
    ios: { label: 'iPhone / iPad · App Store', name: 'ChatGPT', publisher: 'OpenAI OpCo, LLC', source: 'apps.apple.com/us/app/chatgpt/id6448311069', href: 'https://apps.apple.com/us/app/chatgpt/id6448311069', surface: '<div class="source-device-frame ios-frame"><div class="mobile-status"><span>9:41</span><span>▮▮▮ ◔ ▰</span></div><div class="store-topbar"><strong>App Store</strong><span>Search</span></div><div class="store-search">openai chatgpt <span>⌕</span></div><div class="store-listing"><span class="official-app-icon">✦</span><div class="listing-copy"><strong data-field="name">ChatGPT</strong><small>Your everyday AI assistant</small><strong class="publisher-field" data-field="publisher">OpenAI OpCo, LLC</strong><small class="source-field" data-field="source">apps.apple.com/us/app/chatgpt/id6448311069</small></div><span class="store-action">GET</span></div><div class="surface-caption">Official Apple App Store listing</div></div>' },
    android: { label: 'Android phone / tablet · Google Play', name: 'ChatGPT', publisher: 'OpenAI', source: 'play.google.com/store/apps/details?id=com.openai.chatgpt', href: 'https://play.google.com/store/apps/details?id=com.openai.chatgpt', surface: '<div class="source-device-frame android-frame"><div class="android-status"><span>9:41</span><span>▮▮▮ ◔ ▰</span></div><div class="play-topbar"><strong>Google Play</strong><span>⌕</span><span>⋮</span></div><div class="store-search play-search">openai chatgpt <span>⌕</span></div><div class="store-listing"><span class="official-app-icon">✦</span><div class="listing-copy"><strong data-field="name">ChatGPT</strong><small>Your everyday AI assistant</small><strong class="publisher-field" data-field="publisher">OpenAI</strong><small class="source-field" data-field="source">play.google.com/store/apps/details?id=com.openai.chatgpt</small></div><span class="store-action install-action">Install</span></div><div class="surface-caption">Official Google Play listing</div></div>' },
    windows: { label: 'Windows PC · Chrome web search', name: 'ChatGPT', publisher: 'OpenAI', source: 'https://www.chatgpt.com', href: 'https://chatgpt.com', surface: '<div class="source-device-frame publisher-screenshot-frame"><div class="publisher-screenshot-surface"><img class="publisher-screenshot-image" src="assets/google-chatgpt-search-result.png" alt="Google search result showing ChatGPT, the chatgpt.com source, and Official ChatGPT from OpenAI" /><button type="button" class="publisher-screenshot-target" data-field="name" data-focus-target="name" aria-label="Name: ChatGPT"></button><button type="button" class="publisher-screenshot-target" data-field="source" data-focus-target="source" aria-label="Source: https://www.chatgpt.com"></button><button type="button" class="publisher-screenshot-target" data-field="publisher" data-focus-target="publisher" aria-label="Publisher: OpenAI"></button></div><div class="surface-caption">Your supplied Google result. Read the top name and source, then confirm OpenAI in the result below.</div></div>' },
    mac: { label: 'Mac computer · Safari web search', name: 'ChatGPT', publisher: 'OpenAI', source: 'https://www.chatgpt.com', href: 'https://chatgpt.com', surface: '<div class="source-device-frame desktop-frame mac-frame"><div class="safari-toolbar"><span class="traffic-lights">● ● ●</span><span class="safari-address">chatgpt.com</span><span>⌁</span></div><div class="safari-search-result"><div class="result-source"><span class="web-globe">●</span><span>ChatGPT</span><small>https://www.chatgpt.com</small></div><h4>Official <span data-field="name">ChatGPT</span> from <span data-field="publisher">OpenAI</span></h4><div class="result-url" data-field="source">https://www.chatgpt.com</div><p>ChatGPT: AI made simple — Get answers and simplify your daily tasks with ChatGPT.</p></div></div>' }
  };
  const publisherKey = () => /iPhone|iPad/i.test(saved.device) ? 'ios' : /Android/i.test(saved.device) ? 'android' : /Mac/i.test(saved.device) ? 'mac' : 'windows';
  const renderPublisherSurface = () => { const item = publisherData[publisherKey()]; publisherSurfaceLabel.textContent = item.label; sourceName.textContent = item.name; sourcePublisher.textContent = item.publisher; sourceUrl.textContent = item.source; publisherSurface.innerHTML = `${item.surface}<a class="source-link" href="${item.href}" target="_blank" rel="noreferrer">Open the official source page ↗</a>`; publisherSurface.setAttribute('aria-label', `${item.label}. Name ${item.name}. Publisher ${item.publisher}. Source ${item.source}.`); document.querySelectorAll('[data-focus-clue]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-field]').forEach((field) => field.classList.remove('target-focus')); const target = publisherSurface.querySelector(`[data-field="${button.dataset.focusClue}"]`); if (target) target.classList.add('target-focus'); const feedback = document.getElementById('appFeedback'); feedback.className = 'feedback good'; feedback.textContent = button.dataset.focusClue === 'publisher' && /browser/i.test(item.label) ? 'This is an important difference: the publisher is not a separate search-result field. Confirm OpenAI from the official site.' : `Look here for the ${button.dataset.focusClue}.`; })); };
  const updatePublisherNextStep = () => { const next = document.getElementById('publisherNextStep'); if (!next) return; next.innerHTML = /browser/i.test(publisherData[publisherKey()].label) ? '<strong>On this Windows example:</strong> find ChatGPT, OpenAI, and https://www.chatgpt.com in the result before you open it. Downloading and creating an account are separate lessons.' : '<strong>On an app store:</strong> you should see ChatGPT and the publisher OpenAI or OpenAI OpCo, LLC before you choose Install or Get.'; };
  document.querySelectorAll('[data-device]').forEach((choice) => choice.addEventListener('click', renderPublisherSurface));
  document.querySelectorAll('[data-device]').forEach((choice) => choice.addEventListener('click', updatePublisherNextStep));
  renderPublisherSurface();
  const normalizePublisherTargetFields = () => {
    if (!/browser/i.test(publisherSurfaceLabel.textContent)) return;
    if (publisherSurface.querySelector('.publisher-screenshot-surface')) return;
    const sourceName = publisherSurface.querySelector('.result-source > span:not(.web-globe)');
    const titleName = publisherSurface.querySelector('.desktop-result h4 [data-field="name"]');
    const sourceSnippet = publisherSurface.querySelector('.result-source small');
    const resultSource = publisherSurface.querySelector('.result-url[data-field="source"]');
    titleName?.removeAttribute('data-field');
    sourceName?.setAttribute('data-field', 'name');
    sourceSnippet?.removeAttribute('data-field');
    resultSource?.setAttribute('data-field', 'source');
  };
  normalizePublisherTargetFields();
  const syncPublisherSourceContext = () => {
    const sourceSnippet = publisherSurface.querySelector('.result-source small');
    const resultSource = publisherSurface.querySelector('.result-url[data-field="source"]');
    if (sourceSnippet && resultSource) sourceSnippet.classList.toggle('target-context', resultSource.classList.contains('target-focus'));
  };
  new MutationObserver(syncPublisherSourceContext).observe(publisherSurface, { subtree: true, attributes: true, attributeFilter: ['class'] });
  const exactPublisherTargets = (clue) => {
    const desktop = /browser/i.test(publisherSurfaceLabel.textContent);
    if (desktop && publisherSurface.querySelector('.publisher-screenshot-surface')) return [{ element: publisherSurface.querySelector(`[data-focus-target="${clue}"]`), kind: 'focus' }];
    if (desktop && clue === 'name') return [{ element: publisherSurface.querySelector('.result-source > span:not(.web-globe)'), kind: 'context' }];
    if (desktop && clue === 'publisher') return [{ element: publisherSurface.querySelector('.desktop-result h4 [data-field="publisher"]'), kind: 'context' }];
    if (desktop && clue === 'source') return [
      { element: publisherSurface.querySelector('.result-source small'), kind: 'context' },
      { element: publisherSurface.querySelector('.result-url[data-field="source"]'), kind: 'focus' }
    ];
    return [{ element: publisherSurface.querySelector(`[data-field="${clue}"]`), kind: 'focus' }];
  };
  document.querySelectorAll('[data-focus-clue]').forEach((button) => button.addEventListener('click', () => {
    publisherSurface.querySelectorAll('.target-focus, .target-context').forEach((field) => field.classList.remove('target-focus', 'target-context'));
    exactPublisherTargets(button.dataset.focusClue).forEach(({ element, kind }) => element?.classList.add(kind === 'context' ? 'target-context' : 'target-focus'));
  }));
  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('[data-focus-clue]');
    if (!button) return;
    event.stopImmediatePropagation();
    publisherSurface.querySelectorAll('.target-focus, .target-context').forEach((field) => field.classList.remove('target-focus', 'target-context'));
    exactPublisherTargets(button.dataset.focusClue).forEach(({ element, kind }) => element?.classList.add(kind === 'context' ? 'target-context' : 'target-focus'));
    const feedback = document.getElementById('appFeedback');
    feedback.className = 'feedback good';
    feedback.textContent = `Look here for the ${button.dataset.focusClue}.`;
  }, true);
  updatePublisherNextStep();
  const renderPublisherArrows = () => {
    document.querySelectorAll('.annotation-arrows').forEach((svg) => svg.remove());
    if (publisherSurface?.querySelector('.publisher-screenshot-surface')) return;
    const workbench = publisherSurface?.parentElement;
    if (!workbench) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('annotation-arrows');
    svg.setAttribute('viewBox', '0 0 1000 300');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<defs><marker id="small-red-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#df3028"></path></marker></defs><path d="M164 72 L236 72" marker-end="url(#small-red-arrow)"></path><path d="M836 128 L760 128" marker-end="url(#small-red-arrow)"></path><path d="M164 222 L236 222" marker-end="url(#small-red-arrow)"></path>';
    workbench.appendChild(svg);
  };
  renderPublisherArrows();
  document.querySelectorAll('[data-device]').forEach((choice) => choice.addEventListener('click', renderPublisherArrows));
  document.querySelectorAll('[data-device]').forEach((choice) => choice.addEventListener('click', normalizePublisherTargetFields));
  const glossaryIcons = {
    Attachment: '<svg viewBox="0 0 32 32"><path d="M11 16.5 19.5 8a5 5 0 0 1 7 7l-10 10a7 7 0 0 1-10-10l9-9"/><path d="m13 19 8-8"/></svg>',
    Clipboard: '<svg viewBox="0 0 32 32"><rect x="8" y="7" width="16" height="21" rx="2"/><path d="M12 7V5h8v2M12 13h8M12 18h8M12 23h5"/></svg>',
    Publisher: '<svg viewBox="0 0 32 32"><path d="M5 27h22M8 27V12l8-5 8 5v15M12 16h2M18 16h2M12 21h2M18 21h2"/></svg>',
    Screenshot: '<svg viewBox="0 0 32 32"><path d="M11 5H6v5M21 5h5v5M11 27H6v-5M21 27h5v-5M10 16h12"/></svg>',
    Upload: '<svg viewBox="0 0 32 32"><path d="M7 22v4h18v-4M16 22V7M11 12l5-5 5 5"/></svg>',
    Browser: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11"/><path d="M5 13h22M8 8l16 16M16 5c3 3 4 7 4 11s-1 8-4 11"/></svg>',
    Source: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11"/><path d="M5 16h22M16 5c3 3 4 7 4 11s-1 8-4 11M16 5c-3 3-4 7-4 11s1 8 4 11"/></svg>',
    'Highlighted text': '<svg viewBox="0 0 32 32"><path d="M6 12V8h4M22 8h4v4M6 20v4h4M22 24h4v-4"/><path d="M8 16h16"/><path d="M10 13v6M22 13v6"/></svg>',
    App: '<svg viewBox="0 0 32 32"><rect x="6" y="6" width="8" height="8" rx="2"/><rect x="18" y="6" width="8" height="8" rx="2"/><rect x="6" y="18" width="8" height="8" rx="2"/><rect x="18" y="18" width="8" height="8" rx="2"/></svg>'
  };
  document.querySelectorAll('.chat-icon').forEach((icon) => { icon.innerHTML = '<svg class="chat-logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4.5a5.8 5.8 0 0 1 5.8 5.8v1.2h1.2a5.8 5.8 0 0 1 2.9 10.8 5.8 5.8 0 0 1-10 4.2l-.9-.9-.9.9a5.8 5.8 0 0 1-10-4.2 5.8 5.8 0 0 1 2.9-10.8H8V10.3A5.8 5.8 0 0 1 16 4.5Z"/><path d="M8 11.5 19.5 18M24 20.5 12.5 14M16 4.5v13M16 27.5v-6M8 20.5l8-4.6M24 11.5l-8 4.6"/></svg>'; });
   const storeSearchUrl = 'https://apps.microsoft.com/search?query=chat+gpt&hl=en-US&gl=US';
   const currentChatgptStoreUrl = 'https://apps.microsoft.com/detail/9plm9xgg6vks';
   document.querySelectorAll('a[href*="apps.microsoft.com/detail/9nt1r1c2hh7j"]').forEach((link) => { link.href = currentChatgptStoreUrl; });
  const storeStep = document.querySelector('#lesson4Page .download-step:nth-child(3)');
  if (storeStep) {
    const heading = storeStep.querySelector('h3');
    const copy = storeStep.querySelector('.download-step-copy p');
    if (heading) heading.textContent = 'ChatGPT and ChatGPT Classic';
    if (copy) copy.innerHTML = 'On the Microsoft Store search page, choose the newer top-middle result named <strong>ChatGPT</strong>. Confirm the publisher is <strong>OpenAI</strong> before you install.';
    const placeholder = storeStep.querySelector('.evidence-needed');
    if (placeholder) placeholder.outerHTML = '<div class="store-choice-warning"><strong>ChatGPT Classic vs ChatGPT:</strong> ChatGPT Classic is an older official OpenAI listing being folded into the current ChatGPT experience. For this lesson, use the current listing labeled <strong>ChatGPT</strong>. Always confirm the publisher is <strong>OpenAI</strong> before installing. <a class="source-link" href="https://apps.microsoft.com/detail/9plm9xgg6vks" target="_blank" rel="noreferrer">Open the current ChatGPT Microsoft Store listing ↗</a></div><figure class="reference-figure store-search-reference"><img src="assets/microsoft-store-chatgpt-listing.png" alt="Microsoft Store listing for ChatGPT from OpenAI with an Open button" /><figcaption><strong>This is the destination:</strong> the listing is named <strong>ChatGPT</strong>, the publisher is <strong>OpenAI</strong>, and this is where the Windows app opens.</figcaption></figure>';
  }
  const installerStep = document.querySelector('#lesson4Page .download-step:nth-child(4)');
  const installerPlaceholder = installerStep?.querySelector('.evidence-needed');
  if (installerPlaceholder) installerPlaceholder.outerHTML = '<figure class="reference-figure dark-reference installer-reference"><img src="assets/aydem-windows-chatgpt-installer-list.png" alt="Windows Downloads list showing ChatGPT Installer files" /><figcaption>Your private-file-safe Windows Downloads crop. Open the ChatGPT Installer file from your own Downloads folder.</figcaption></figure>';
  const practicePage = document.getElementById('practicePage');
  if (practicePage && !document.getElementById('lesson5Page')) {
    practicePage.insertAdjacentHTML('beforebegin', `<section class="page-section hidden" id="lesson5Page" data-page="lesson5">
      <div class="lesson-breadcrumb"><button class="back-link" data-go="home" type="button">← Learning path</button><span>/</span><span>Module 3</span></div>
      <div class="lesson-header"><div><p class="eyebrow teal">MODULE 3 · LESSON 1 OF 5 · <span class="module-device-label">WINDOWS PC</span></p><h1>Understanding the ChatGPT screen</h1><p class="lede">Learn where the important controls live before you add a screenshot or file to a conversation.</p></div><div class="lesson-actions"><button class="secondary-button" id="readScreenLesson" type="button">🔊 Read aloud</button></div></div>
      <div class="lesson-layout"><article class="lesson-card">
        <div class="lesson-intro"><span class="lesson-step-badge">1</span><div><h2>Start with the message area</h2><p>When you are ready to add a screenshot, look at the bottom of the ChatGPT conversation for the <strong>plus button</strong>. It opens the file and photo choices.</p></div></div>
        <div class="screen-zones" aria-label="ChatGPT screen areas to notice"><div class="screen-zone"><span class="screen-zone-number">1</span><div><strong>Conversation area</strong><p>Read the answer and keep track of which conversation you are in.</p></div></div><div class="screen-zone"><span class="screen-zone-number">2</span><div><strong>Message field</strong><p>This is where you type what you want ChatGPT to do.</p></div></div><div class="screen-zone screen-zone-focus"><span class="screen-zone-number">3</span><div><strong>Plus button</strong><p>Use this to choose <strong>Add photos &amp; files</strong> when you need to attach a screenshot.</p></div></div></div>
        <div class="lesson-section"><div class="section-title-row"><div><h3>Practice finding the upload control</h3><p>This is a local rehearsal. Choosing a file here does not send it anywhere.</p></div><span class="safe-badge">NOT SENT</span></div><div class="upload-rehearsal"><div class="upload-rehearsal-bar"><span class="chatgpt-mini-mark">✳</span><strong>ChatGPT message field</strong><span class="upload-rehearsal-spacer"></span><button class="upload-plus-button" id="uploadPracticeButton" type="button" aria-label="Practice the plus button">+</button></div><p id="uploadPracticeStatus">Choose a harmless practice screenshot only if you want to rehearse the file-picker step.</p><input id="uploadPracticeInput" type="file" accept="image/*" hidden /><button class="primary-button" id="choosePracticeFile" type="button">Try the plus button <span>＋</span></button></div></div>
        <div class="lesson-section"><h3>Three questions before you add a screenshot</h3><div class="check-list"><div><span>1</span><p><strong>What is visible?</strong> Check for names, messages, account details, or other private information.</p></div><div><span>2</span><p><strong>What part matters?</strong> Crop to the control or message you want help with.</p></div><div><span>3</span><p><strong>Where will it go?</strong> Add it only to the intended ChatGPT conversation.</p></div></div></div>
        <div class="lesson-section next-step"><span class="lesson-step-badge small-badge">2</span><div><h2>Next: practice with a real screenshot</h2><p>When the current ChatGPT screen capture is ready, we will use it here to identify the actual plus button and the upload menu one step at a time.</p><button class="primary-button" data-go="practice" type="button">Go to safe practice <span>→</span></button><button class="text-link follow-up-link" data-go="lesson4" type="button">Review the Windows download path</button></div></div>
      </article><aside class="lesson-aside"><div class="aside-card"><span class="eyebrow">PRIVACY PAUSE</span><h3>Show only what helps.</h3><p>Before adding a screenshot, look around the edges. Crop out personal files, names, addresses, notifications, and unrelated browser tabs.</p></div><div class="aside-card glossary-card"><span class="eyebrow">NEW WORD</span><h3>Upload</h3><p>To choose a saved file or picture and add it to an app or website.</p><button class="text-link" data-go="glossary" type="button">See glossary →</button></div></aside></div>
    </section>`);
    const screenPage = document.getElementById('lesson5Page');
    screenPage.insertAdjacentHTML('afterend', `<section class="page-section hidden module3-followup" id="lesson5-2Page" data-page="lesson5-2">
      <div class="lesson-breadcrumb"><button class="back-link" data-go="lesson5" type="button">← Screen tour</button><span>/</span><span>Module 3 · Lesson 2 of 5</span></div>
      <div class="lesson-header"><div><p class="eyebrow teal">MODULE 3 · LESSON 2 OF 5 · <span class="module-device-label">WINDOWS PC</span></p><h1>Locate the message field</h1><p class="lede">The message field is where you type. The plus button belongs to that field and opens the choices for adding a screenshot or file.</p></div></div>
      <div class="lesson-layout"><article class="lesson-card"><div class="lesson-intro"><span class="lesson-step-badge">2</span><div><h2>Find it before you need it</h2><p>Return to the screen tour, choose your device, and use marker 4 to locate the message field. Then choose the plus button inside that field.</p></div></div><div class="lesson-section"><h3>Practice the location</h3><div class="check-list"><div><span>1</span><p>Choose the device tab that matches the screen in front of you.</p></div><div><span>2</span><p>Find the message field at the bottom of the conversation.</p></div><div><span>3</span><p>Find the plus button inside the field. It is not the same as ChatGPT Plus, the paid plan.</p></div></div><button class="primary-button" data-go="lesson5" type="button">Return to the screen tour <span>→</span></button></div><div class="lesson-section next-step"><span class="lesson-step-badge small-badge">3</span><div><h2>Next: choose what to add</h2><p>After you can locate the control, learn what the add-file choices mean.</p><button class="primary-button" data-go="lesson5-3" type="button">Next: Add photos &amp; files <span>→</span></button><button class="text-link follow-up-link" data-go="practice" type="button">Open Safe Practice: select, copy, paste</button></div></div></article><aside class="lesson-aside"><div class="aside-card"><span class="eyebrow">REVISIT ANY TIME</span><h3>You can come back here.</h3><p>This lesson is a reference, not a test. Use it again when you cannot find the message field.</p></div></aside></div>
    </section><section class="page-section hidden module3-followup" id="lesson5-3Page" data-page="lesson5-3">
      <div class="lesson-breadcrumb"><button class="back-link" data-go="lesson5-2" type="button">← Locate the message field</button><span>/</span><span>Module 3 · Lesson 3 of 5</span></div>
      <div class="lesson-header"><div><p class="eyebrow teal">MODULE 3 · LESSON 3 OF 5 · <span class="module-device-label">WINDOWS PC</span></p><h1>Choose Add photos &amp; files</h1><p class="lede">The plus menu gives you choices. For a screenshot saved on your device, choose Add photos &amp; files.</p></div></div>
      <div class="lesson-layout"><article class="lesson-card"><div class="lesson-intro"><span class="lesson-step-badge">3</span><div><h2>Use the choice that matches your task</h2><p>Open the plus menu in the screen tour, then identify the choice before you select a file.</p></div></div><div class="lesson-section"><h3>Before you choose a file</h3><div class="check-list"><div><span>1</span><p><strong>Photos &amp; files:</strong> use this for a screenshot or saved document on your device.</p></div><div><span>2</span><p><strong>Connect apps:</strong> use this only when you intentionally want to connect an available app.</p></div><div><span>3</span><p><strong>Nothing is sent by AYDEM:</strong> the practice controls explain the choice but do not upload a real file.</p></div></div></div><div class="lesson-section next-step"><span class="lesson-step-badge small-badge">4</span><div><h2>Next: protect private information</h2><p>Before you add a screenshot to any conversation, check what is visible around the part you need.</p><button class="primary-button" data-go="lesson5-4" type="button">Next: privacy check <span>→</span></button></div></div></article><aside class="lesson-aside"><div class="aside-card"><span class="eyebrow">DEVICE-REAL ACTION</span><h3>Use your device’s real file choice.</h3><p>AYDEM teaches where the control is. Your device shows the actual picker and file list.</p></div></aside></div>
    </section><section class="page-section hidden module3-followup" id="lesson5-4Page" data-page="lesson5-4">
      <div class="lesson-breadcrumb"><button class="back-link" data-go="lesson5-3" type="button">← Add photos &amp; files</button><span>/</span><span>Module 3 · Lesson 4 of 5</span></div>
      <div class="lesson-header"><div><p class="eyebrow teal">MODULE 3 · LESSON 4 OF 5 · <span class="module-device-label">WINDOWS PC</span></p><h1>Check the screenshot before sharing</h1><p class="lede">A useful screenshot shows the part you need and leaves out private information that does not belong in the conversation.</p></div></div>
      <div class="lesson-layout"><article class="lesson-card"><div class="lesson-intro"><span class="lesson-step-badge">4</span><div><h2>Pause before you add it</h2><p>Look around the edges of the image. Crop or close anything that is private or unrelated.</p></div></div><div class="lesson-section"><h3>Three privacy questions</h3><div class="check-list"><div><span>1</span><p><strong>What is visible?</strong> Names, messages, email addresses, account details, and file names can identify someone.</p></div><div><span>2</span><p><strong>What part matters?</strong> Keep the control or message you want help with; crop the rest.</p></div><div><span>3</span><p><strong>Where will it go?</strong> Add it only to the intended ChatGPT conversation.</p></div></div></div><div class="lesson-section next-step"><span class="lesson-step-badge small-badge">5</span><div><h2>Next: review before sending</h2><p>One last check helps you avoid sending a screenshot before you are ready.</p><button class="primary-button" data-go="lesson5-5" type="button">Next: final review <span>→</span></button></div></div></article><aside class="lesson-aside"><div class="aside-card"><span class="eyebrow">PRIVACY PAUSE</span><h3>Show only what helps.</h3><p>When in doubt, stop and crop. AYDEM never needs your private files to teach the action.</p></div></aside></div>
    </section><section class="page-section hidden module3-followup" id="lesson5-5Page" data-page="lesson5-5">
      <div class="lesson-breadcrumb"><button class="back-link" data-go="lesson5-4" type="button">← Privacy check</button><span>/</span><span>Module 3 · Lesson 5 of 5</span></div>
      <div class="lesson-header"><div><p class="eyebrow teal">MODULE 3 · LESSON 5 OF 5 · <span class="module-device-label">WINDOWS PC</span></p><h1>Review before you send</h1><p class="lede">The final decision is yours. Confirm the file, the conversation, and the information it contains before you send anything.</p></div></div>
      <div class="lesson-layout"><article class="lesson-card"><div class="lesson-intro"><span class="lesson-step-badge">5</span><div><h2>Use the whole pattern</h2><p>Locate the field, open the plus menu, choose the right file action, check the image, and only then decide whether to send.</p></div></div><div class="lesson-section"><h3>Before you send</h3><div class="check-list"><div><span>1</span><p>The file or screenshot is the one you intended.</p></div><div><span>2</span><p>The conversation is the one you intended.</p></div><div><span>3</span><p>No private or unrelated information is visible.</p></div><div><span>4</span><p>You are ready to send; choosing a file is not the same as sending a message.</p></div></div></div><div class="lesson-section next-step"><span class="lesson-step-badge small-badge">↺</span><div><h2>Keep this as a reference</h2><p>You can return to any Module 3 lesson from the module links, or practice the separate select/copy/paste skill.</p><button class="primary-button" data-go="lesson5" type="button">Return to Module 3 screen tour <span>→</span></button><button class="text-link follow-up-link" data-go="practice" type="button">Open Safe Practice: select, copy, paste</button></div></div></article><aside class="lesson-aside"><div class="aside-card"><span class="eyebrow">MODULE COMPLETE</span><h3>Learn it, use it, revisit it.</h3><p>Finishing once does not mean you have to remember it forever. Come back whenever you need the steps.</p></div></aside></div>
    </section>`);
    const module3LessonNav = '<nav class="module3-lesson-nav" aria-label="Module 3 lessons"><span>Module 3</span><button type="button" data-go="lesson5">1 · Screen tour</button><button type="button" data-go="lesson5-2">2 · Message field</button><button type="button" data-go="lesson5-3">3 · Add files</button><button type="button" data-go="lesson5-4">4 · Privacy check</button><button type="button" data-go="lesson5-5">5 · Final review</button></nav>';
    document.querySelectorAll('#lesson5Page, .module3-followup').forEach((page) => page.querySelector('.lesson-header')?.insertAdjacentHTML('afterend', module3LessonNav));
    const screenNextButton = screenPage.querySelector('.next-step .primary-button');
    if (screenNextButton) { screenNextButton.dataset.go = 'lesson5-2'; screenNextButton.innerHTML = 'Next: locate the message field <span>→</span>'; }
    const screenPracticeLink = screenPage.querySelector('.next-step .follow-up-link');
    if (screenPracticeLink) screenPracticeLink.textContent = 'Open Safe Practice: select, copy, paste';
    screenPage.querySelector('.lesson-intro').insertAdjacentHTML('afterend', `<div class="screen-tour" aria-label="Interactive ChatGPT screen tour"><div class="screen-tour-header"><div><span class="eyebrow teal">UNDERSTAND THE CHATGPT SCREEN</span><h2 id="screenTourTitle">Windows PC · ChatGPT web</h2><p id="screenTourSource">Observed on chatgpt.com. The screen can change with account, browser, plan, and date.</p></div><span class="safe-badge" id="screenTourStatus">LIVE REFERENCE</span></div><div class="device-tabs" role="tablist" aria-label="Choose a device view"><button class="device-tab selected" type="button" role="tab" aria-selected="true" data-screen-device="windows">Windows PC</button><button class="device-tab" type="button" role="tab" aria-selected="false" data-screen-device="iphone">iPhone / iPad</button><button class="device-tab" type="button" role="tab" aria-selected="false" data-screen-device="android">Android phone / tablet</button><button class="device-tab" type="button" role="tab" aria-selected="false" data-screen-device="mac">Mac computer</button></div><div class="screen-tour-stage"><div class="screen-reference" data-screen-mode="windows"><div class="screen-browser-bar"><span class="screen-dots">● ● ●</span><span class="screen-address">chatgpt.com</span></div><div class="screen-reference-body"><aside class="screen-sidebar"><span class="screen-sidebar-icon">◧</span><span>New chat</span><span>⌕</span><span>Search chats</span><span>◌</span><span>Images</span><span>⚙</span><span>Settings</span></aside><div class="screen-workspace"><div class="screen-topline"><strong>ChatGPT</strong><span>Log in</span><span>Sign up for free</span></div><div class="screen-welcome">Where should we begin?</div><div class="screen-composer"><button class="screen-hotspot screen-hotspot-plus" type="button" data-screen-hotspot="plus" aria-label="Show what the plus button does">+</button><span>Ask ChatGPT</span><span class="screen-mic">◉</span><div class="screen-add-menu" hidden><strong>Add to this chat</strong><button type="button" data-menu-choice="photos">Add photos &amp; files</button><button type="button" data-menu-choice="apps">Connect apps</button></div></div><button class="screen-hotspot hotspot-sidebar" type="button" data-screen-hotspot="sidebar" aria-label="Explain the sidebar">1</button><button class="screen-hotspot hotspot-header" type="button" data-screen-hotspot="header" aria-label="Explain the ChatGPT header">2</button><button class="screen-hotspot hotspot-conversation" type="button" data-screen-hotspot="conversation" aria-label="Explain the conversation area">3</button><button class="screen-hotspot hotspot-composer" type="button" data-screen-hotspot="composer" aria-label="Explain the message field">4</button></div></div></div><div class="screen-explanation" id="screenExplanation" role="status" aria-live="polite"><span class="screen-explanation-number">4</span><div><strong id="screenExplanationTitle">Message field</strong><p id="screenExplanationBody">This is where you type your request. Hover over a numbered marker for a quick explanation, or click it to keep the explanation open.</p></div></div></div></div>`);
    const screenTour = screenPage.querySelector('.screen-tour');
    const screenReference = screenTour.querySelector('.screen-reference');
    screenReference.insertAdjacentHTML('afterend', `<div class="windows-screen-tour hidden" aria-label="Windows ChatGPT supplied screen states"><div class="windows-screen-visual"><figure class="windows-source-figure"><img id="windowsScreenImage" src="assets/windows-chatgpt-work-home.png" alt="Windows ChatGPT Work home screen with Work selected" /><figcaption id="windowsScreenCaption">Your supplied Windows reference: ChatGPT Work is selected.</figcaption></figure></div><div class="windows-state-controls"><p class="windows-state-instruction">Click a step to see the supplied Windows screen that appears next.</p><div class="windows-state-list" role="list"><button type="button" data-windows-state="home" aria-pressed="true"><span>1</span><strong>ChatGPT Work home</strong><small>Work is selected</small></button><button type="button" data-windows-state="plus" aria-pressed="false"><span>2</span><strong>Plus menu</strong><small>Add photos, files, apps, and tools</small></button><button type="button" data-windows-state="select-model" aria-pressed="false"><span>3</span><strong>Open Select model</strong><small>Choose the model control</small></button><button type="button" data-windows-state="models" aria-pressed="false"><span>4</span><strong>Choose a model</strong><small>Review the available models</small></button><button type="button" data-windows-state="search" aria-pressed="false"><span>5</span><strong>Search old chats</strong><small>Use the sidebar search icon</small></button></div></div></div>`);
    const windowsGallery = screenTour.querySelector('.windows-screen-tour');
    const windowsImage = screenTour.querySelector('#windowsScreenImage');
    const windowsCaption = screenTour.querySelector('#windowsScreenCaption');
    screenReference.insertAdjacentHTML('afterend', `<div class="android-screen-tour hidden" aria-label="Android ChatGPT screen states"><div class="android-screen-visual"><figure class="android-source-figure"><img id="androidScreenImage" src="assets/android-chatgpt-home.png" alt="Android ChatGPT home screen with suggestions above the message field" /><figcaption id="androidScreenCaption">Your supplied Android reference: the ChatGPT home screen.</figcaption></figure></div><div class="android-state-controls"><p class="android-state-instruction">Touch a step to see the exact screen that appears next.</p><div class="android-state-list" role="list"><button type="button" data-android-state="home" aria-pressed="true"><span>1</span><strong>Home screen</strong><small>Suggestions and the message field</small></button><button type="button" data-android-state="menu" aria-pressed="false"><span>2</span><strong>Two-line menu</strong><small>Open the side navigation</small></button><button type="button" data-android-state="plus" aria-pressed="false"><span>3</span><strong>Plus menu</strong><small>Camera, Photos, Files, Plugins</small></button><button type="button" data-android-state="input" aria-pressed="false"><span>4</span><strong>Type a message</strong><small>Tap the chat field and keyboard</small></button><button type="button" data-android-state="models" aria-pressed="false"><span>5</span><strong>Choose a model</strong><small>Tap 5.6 Sol Light</small></button><button type="button" data-android-state="effort" aria-pressed="false"><span>6</span><strong>Choose effort</strong><small>Light through Ultra</small></button><button type="button" data-android-state="speed" aria-pressed="false"><span>7</span><strong>Review configuration</strong><small>Effort, speed, and Done</small></button></div></div></div>`);
    const androidGallery = screenTour.querySelector('.android-screen-tour');
    const androidImage = screenTour.querySelector('#androidScreenImage');
    const androidCaption = screenTour.querySelector('#androidScreenCaption');
    const androidFigure = screenTour.querySelector('.android-source-figure');
    const androidHotspots = document.createElement('div');
    androidHotspots.className = 'android-hotspots';
    androidHotspots.setAttribute('aria-label', 'Numbered Android controls');
    androidFigure?.append(androidHotspots);
    screenTour.querySelector('.device-tabs').insertAdjacentHTML('afterend', '<p class="screen-tour-instruction">Hover over a numbered marker—or tap it on a phone—to update the explanation panel.</p>');
    const screenExplanation = screenTour.querySelector('#screenExplanation');
    const screenAside = screenPage.querySelector('.lesson-aside');
    if (screenExplanation && screenAside) {
      screenAside.append(screenExplanation);
      screenAside.classList.add('screen-tour-side-panel');
    }
    const module3ScreenVisual = (pageId, caption, openMenu = false) => { const page = document.getElementById(pageId); const intro = page?.querySelector('.lesson-intro'); if (!intro) return; const preview = screenReference.cloneNode(true); preview.removeAttribute('data-screen-mode'); preview.setAttribute('aria-hidden', 'true'); preview.querySelectorAll('button').forEach((button) => { button.disabled = true; button.removeAttribute('data-screen-hotspot'); button.removeAttribute('data-menu-choice'); }); if (openMenu) { const menu = preview.querySelector('.screen-add-menu'); if (menu) { menu.removeAttribute('hidden'); menu.style.display = 'grid'; } } const figure = document.createElement('figure'); figure.className = 'reference-figure module3-screen-visual'; figure.dataset.windowsReference = openMenu ? 'plus' : 'home'; figure.append(preview); const sourceFigure = document.createElement('div'); sourceFigure.className = 'module3-source-image'; sourceFigure.hidden = true; sourceFigure.innerHTML = `<img src="assets/${openMenu ? 'windows-chatgpt-plus-menu.png' : 'windows-chatgpt-work-home.png'}" alt="${openMenu ? 'Supplied Windows ChatGPT Work plus menu' : 'Supplied Windows ChatGPT Work home screen'}" /><span>${openMenu ? 'Supplied Windows reference: plus menu open.' : 'Supplied Windows reference: Work selected.'}</span>`; figure.append(sourceFigure); const figcaption = document.createElement('figcaption'); figcaption.textContent = caption; figure.append(figcaption); intro.insertAdjacentElement('afterend', figure); };
    module3ScreenVisual('lesson5-2Page', 'Windows reference: the message field is at the bottom of the ChatGPT conversation. Use the device tabs in Lesson 1 for the selected platform.');
    module3ScreenVisual('lesson5-3Page', 'Windows reference: the plus button opens the choices for adding photos and files. The real menu may look different on another device.', true);
    const addFilesPageForSequence = document.getElementById('lesson5-3Page');
    const addFilesIntroForSequence = addFilesPageForSequence?.querySelector('.lesson-intro');
    if (addFilesIntroForSequence && !addFilesPageForSequence.querySelector('.windows-upload-sequence')) addFilesIntroForSequence.insertAdjacentHTML('afterend', `<section class="windows-upload-sequence" aria-labelledby="windowsUploadSequenceTitle"><div class="windows-upload-sequence-heading"><span class="eyebrow teal">WINDOWS PC EXAMPLE</span><h3 id="windowsUploadSequenceTitle">Add a screenshot without sending it yet</h3><p>After you click the plus button, choose <strong>Add photos &amp; files</strong>. Then open your Screenshots folder, select the screenshot, and click <strong>Open</strong>. The last screen shows the attached image and prompt; review it before you decide whether to send.</p></div><div class="windows-upload-steps"><figure class="windows-upload-step"><div class="windows-upload-step-label"><span>1</span><strong>Open Add photos &amp; files</strong></div><img src="assets/windows-upload-plus-menu.png" alt="Windows ChatGPT Work plus menu with Add photos and files at the top" /><figcaption>Click the plus button, then choose <strong>Add photos &amp; files</strong>.</figcaption></figure><figure class="windows-upload-step"><div class="windows-upload-step-label"><span>2</span><strong>Select a screenshot and click Open</strong></div><img src="assets/windows-upload-file-picker.png" alt="Windows file picker showing screenshot files in the Gallery folder with one screenshot selected and the Open button" /><figcaption>Go to your Screenshots or Gallery folder, select the screenshot you want, and click <strong>Open</strong>.</figcaption></figure><figure class="windows-upload-step"><div class="windows-upload-step-label"><span>3</span><strong>Review the image and prompt</strong></div><img src="assets/windows-upload-attached-prompt.png" alt="ChatGPT Work prompt with an attached screenshot thumbnail and a written request" /><figcaption>The screenshot is now attached to the prompt. Check what is visible and what you wrote before sending.</figcaption></figure></div><p class="windows-upload-safety"><strong>Remember:</strong> clicking <strong>Open</strong> attaches the image; it does not send the message. Sending is a separate action.</p></section>`);
    const addFilesPage = document.getElementById('lesson5-3Page');
    const addFilesArticle = addFilesPage?.querySelector('.lesson-card');
    const addFilesAside = addFilesPage?.querySelector('.lesson-aside');
    const addFilesGuidance = addFilesArticle?.querySelector('.lesson-section');
    const addFilesNext = addFilesArticle?.querySelector('.next-step');
    if (addFilesAside && addFilesGuidance && addFilesNext) {
      addFilesAside.append(addFilesGuidance, addFilesNext);
      addFilesAside.classList.add('lesson-aside-stacked-guidance');
    }
    const screenTitle = screenTour.querySelector('#screenTourTitle');
    const screenSource = screenTour.querySelector('#screenTourSource');
    screenSource.insertAdjacentHTML('afterend', '<a class="source-link screen-source-link" href="https://chatgpt.com/" target="_blank" rel="noreferrer">Open the live ChatGPT screen ↗</a>');
    const screenStatus = screenTour.querySelector('#screenTourStatus');
    const screenExplanationNumber = screenExplanation?.querySelector('.screen-explanation-number');
    const screenExplanationTitle = screenExplanation?.querySelector('#screenExplanationTitle');
    const screenExplanationBody = screenExplanation?.querySelector('#screenExplanationBody');
    const screenAddMenu = screenTour.querySelector('.screen-add-menu');
    const screenDevices = {
      windows: { title: 'Windows PC · ChatGPT Work', source: 'Supplied Windows PC screenshots for the ChatGPT Work view and its controls.', status: 'SUPPLIED REFERENCE', mode: 'desktop-mode' },
      iphone: { title: 'iPhone / iPad · ChatGPT app', source: 'Touch-first app view. The exact labels can move with the ChatGPT app version, but the conversation and message field stay in this phone layout.', status: 'DEVICE REFERENCE', mode: 'phone-mode' },
      android: { title: 'Android phone / tablet · ChatGPT app', source: 'Exact Android reference screenshots supplied for this lesson. Touch a step to see each state.', status: 'SUPPLIED REFERENCE', mode: 'phone-mode' },
      mac: { title: 'Mac computer · ChatGPT web', source: 'Desktop view: use the ChatGPT web or Mac app controls shown on your screen. The browser chrome may differ from Windows.', status: 'DEVICE VIEW', mode: 'desktop-mode' }
    };
    const mobileTopline = (key) => key === 'android' ? '<span class="screen-mobile-back" aria-hidden="true">‹</span><strong>ChatGPT</strong><span class="screen-mobile-new" aria-hidden="true">⋮</span>' : '<span class="screen-mobile-back" aria-hidden="true">‹</span><strong>ChatGPT</strong><span class="screen-mobile-new" aria-hidden="true">＋</span>';
    const screenDetails = {
      sidebar: ['Sidebar', 'Use this area to start a new chat, search chats, open Images, or reach Settings. On a smaller screen it may be collapsed behind a menu button.'],
      header: ['ChatGPT header', 'This identifies the ChatGPT surface. Account actions such as Log in or Sign up appear near the top on the signed-out web view.'],
      conversation: ['Conversation area', 'This is where the conversation and ChatGPT responses appear. Read the surrounding context before adding a screenshot.'],
      composer: ['Message field', 'This is where you type your request. The plus button belongs to the message field and opens the add-file choices.'],
      plus: ['Plus button', 'Clicking the plus button opens a menu. Choose Add photos & files when you intend to add a screenshot; nothing in this AYDEM tour is sent.']
    };
    const windowsStates = {
      home: { image: 'assets/windows-chatgpt-work-home.png', alt: 'Windows ChatGPT Work home screen with Work selected', caption: 'Your supplied Windows reference: Work is selected in the ChatGPT switcher.', title: 'ChatGPT Work home', body: 'This is the Windows Work view. Work is selected at the top, and the main field says Work on anything. The left side contains the navigation and the search icon.' },
      plus: { image: 'assets/windows-chatgpt-plus-menu.png', alt: 'Windows ChatGPT Work plus menu with Add photos and files and tool choices', caption: 'Your supplied Windows reference: the plus menu is open.', title: 'Plus menu', body: 'Click the plus button inside the message field. This opens the choices for Add photos & files, Add from library, Create image, Web search, Deep research, Sketch, and connected tools.' },
      'select-model': { image: 'assets/windows-chatgpt-select-model.png', alt: 'Windows ChatGPT Work screen with Select model control and effort slider open', caption: 'Your supplied Windows reference: select the model control first.', title: 'Open Select model', body: 'Click Select model in the message field. The model control opens so you can continue to choose the model and review the effort setting.' },
      models: { image: 'assets/windows-chatgpt-model-list.png', alt: 'Windows ChatGPT Work model list showing GPT-6 Astra, GPT-5.6 Sol, Terra, Luna, and GPT-5.5', caption: 'Your supplied Windows reference: the model list is open.', title: 'Choose a model', body: 'Choose from the available models. They are all capable; some are better suited to more complex work and may cost more. For this course, GPT-5.5 or a GPT-5.6 model is suitable.' },
      search: { image: 'assets/windows-chatgpt-search.png', alt: 'Windows ChatGPT Work sidebar with the Search icon highlighted and Search Ctrl+K label', caption: 'Your supplied Windows reference: the sidebar Search control is highlighted.', title: 'Search old chats', body: 'Click the magnifying-glass Search icon in the left sidebar. Use it to find older chats instead of scrolling through the recent list. The shortcut shown here is Ctrl + K.' }
    };
    const showWindowsState = (key) => { const state = windowsStates[key] || windowsStates.home; windowsImage.src = state.image; windowsImage.alt = state.alt; windowsCaption.textContent = state.caption; windowsGallery.querySelectorAll('[data-windows-state]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.windowsState === key))); screenExplanationNumber.textContent = key === 'home' ? '1' : key === 'plus' ? '2' : key === 'select-model' ? '3' : key === 'models' ? '4' : '5'; screenExplanationTitle.textContent = state.title; screenExplanationBody.textContent = state.body; screenTour.querySelectorAll('.screen-hotspot').forEach((hotspot) => hotspot.classList.remove('active')); };
    const androidStates = {
      home: { image: 'assets/android-chatgpt-home.png', alt: 'Android ChatGPT home screen with suggestions above the message field', caption: 'Your supplied Android reference: the home screen before a control is opened.', title: 'Android home screen', body: 'This is the starting screen. The two-line button in the upper-left opens the side menu. The plus button inside the Ask ChatGPT box opens Camera, Photos, Files, and Plugins.' },
      menu: { image: 'assets/android-chatgpt-side-menu.png', alt: 'Android ChatGPT side menu open', caption: 'Your supplied Android reference: the two-line button opens this side menu.', title: 'Two-line menu', body: 'Touch the two-line button in the upper-left. This opens the navigation panel with Images, Library, Projects, Remote, Scheduled, More, Pinned, and Recents.' },
      plus: { image: 'assets/android-chatgpt-plus-menu.png', alt: 'Android ChatGPT plus menu with Camera Photos Files and Plugins', caption: 'Your supplied Android reference: the plus menu stays open over the conversation.', title: 'Plus menu', body: 'Touch the plus button inside the chat box. Choose Camera to take a picture, Photos to choose from your gallery, Files to browse your device, or Plugins for a later advanced lesson.' },
      input: { image: 'assets/android-chatgpt-model-input.png', alt: 'Android ChatGPT message field active with keyboard visible', caption: 'Your supplied Android reference: the message field is active and the keyboard is open.', title: 'Type a message', body: 'Touch inside the Ask ChatGPT field to type. This is also where the current model label, 5.6 Sol Light, appears. Touch that model label to open the configuration choices.' },
      models: { image: 'assets/android-chatgpt-config-models.png', alt: 'Android ChatGPT Configure screen showing model choices', caption: 'Your supplied Android reference: the model choices are open.', title: 'Choose a model', body: 'Touch 5.6 Sol Light to open Configure. Each model is strong, but some are better for more complex work and may cost more to use. For this course, 5.5 or any 5.6 model is suitable.' },
      effort: { image: 'assets/android-chatgpt-config-effort.png', alt: 'Android ChatGPT Configure screen showing effort choices', caption: 'Your supplied Android reference: the Effort choices are open.', title: 'Choose effort', body: 'Effort controls how much work the model applies: Light, Medium, High, Extra High, Max, or Ultra. Higher effort can help with more complex tasks but may take longer or use more.' },
      speed: { image: 'assets/android-chatgpt-config-speed.png', alt: 'Android ChatGPT Configure screen showing effort Light and speed Standard', caption: 'Your supplied Android reference: the configuration screen after choosing Light effort.', title: 'Review configuration', body: 'Review the selected model, Effort, and Speed. For the work in this course, 5.5 or any 5.6 model with Light effort and Standard speed is a practical choice. Touch Done when ready.' }
    };
    const androidHotspotSets = {
      home: [['1', 'menu', 'Open the two-line menu', 'menu'], ['3', 'plus', 'Open the plus menu', 'plus']],
      menu: [['2', 'menu', 'Two-line menu is open', 'menu']],
      plus: [['3', 'plus', 'Plus menu', 'plus']],
      input: [['4', 'input', 'Message field', 'input'], ['5', 'model', 'Current model', 'models']],
      models: [['5', 'model', 'Model choices', 'models'], ['6', 'effort', 'Choose effort', 'effort']],
      effort: [['6', 'effort', 'Effort choices', 'effort']],
      speed: [['7', 'speed', 'Review and finish', 'speed']]
    };
    const renderAndroidHotspots = (key) => {
      if (!androidHotspots) return;
      androidHotspots.innerHTML = (androidHotspotSets[key] || androidHotspotSets.home).map(([number, position, label, next]) => `<button type="button" class="android-hotspot android-hotspot-${position}" data-android-next="${next}" aria-label="${label}">${number}</button>`).join('');
    };
    const showAndroidState = (key) => { const state = androidStates[key] || androidStates.home; androidImage.src = state.image; androidImage.alt = state.alt; androidCaption.textContent = state.caption; androidGallery.querySelectorAll('[data-android-state]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.androidState === key))); screenExplanationNumber.textContent = key === 'home' ? '1' : key === 'menu' ? '2' : key === 'plus' ? '3' : key === 'input' ? '4' : key === 'models' ? '5' : key === 'effort' ? '6' : '7'; screenExplanationTitle.textContent = state.title; screenExplanationBody.textContent = state.body; renderAndroidHotspots(key); screenTour.querySelectorAll('.screen-hotspot').forEach((hotspot) => hotspot.classList.remove('active')); };
    androidGallery.querySelectorAll('[data-android-state]').forEach((button) => button.addEventListener('click', () => showAndroidState(button.dataset.androidState)));
    androidHotspots?.addEventListener('click', (event) => { const hotspot = event.target.closest('[data-android-next]'); if (hotspot) showAndroidState(hotspot.dataset.androidNext); });
    const showScreenExplanation = (key) => { const detail = screenDetails[key] || screenDetails.composer; screenExplanationNumber.textContent = key === 'sidebar' ? '1' : key === 'header' ? '2' : key === 'conversation' ? '3' : '4'; screenExplanationTitle.textContent = detail[0]; screenExplanationBody.textContent = detail[1]; screenTour.querySelectorAll('.screen-hotspot').forEach((hotspot) => hotspot.classList.toggle('active', hotspot.dataset.screenHotspot === key)); };
    screenTour.querySelectorAll('[data-screen-device]').forEach((button) => button.addEventListener('click', () => { const view = screenDevices[button.dataset.screenDevice]; const mobile = view.mode === 'phone-mode'; const android = button.dataset.screenDevice === 'android'; screenReference.classList.toggle('hidden', android); androidGallery.classList.toggle('hidden', !android); screenReference.classList.toggle('phone-mode', mobile); screenReference.classList.toggle('android-mode', android); screenReference.classList.toggle('desktop-mode', !mobile); screenReference.classList.toggle('mac-mode', button.dataset.screenDevice === 'mac'); const topLine = screenReference.querySelector('.screen-topline'); if (topLine) topLine.innerHTML = mobile ? mobileTopline(button.dataset.screenDevice) : '<strong>ChatGPT</strong><span>Log in</span><span>Sign up for free</span>'; screenTitle.textContent = view.title; screenSource.textContent = view.source; screenStatus.textContent = view.status; const tourInstruction = screenTour.querySelector('.screen-tour-instruction'); if (tourInstruction) tourInstruction.textContent = android ? 'Touch a numbered Android step to open the exact screenshot and explanation.' : 'Hover over a numbered marker—or tap it on a phone—to update the explanation panel.'; screenTour.querySelectorAll('[data-screen-device]').forEach((tab) => { const selected = tab === button; tab.classList.toggle('selected', selected); tab.setAttribute('aria-selected', String(selected)); }); if (android) showAndroidState('home'); else showScreenExplanation('composer'); }));
    screenTour.querySelectorAll('[data-screen-hotspot]').forEach((hotspot) => { hotspot.addEventListener('mouseenter', () => showScreenExplanation(hotspot.dataset.screenHotspot)); hotspot.addEventListener('focus', () => showScreenExplanation(hotspot.dataset.screenHotspot)); hotspot.addEventListener('click', () => { showScreenExplanation(hotspot.dataset.screenHotspot); if (hotspot.dataset.screenHotspot === 'plus') screenAddMenu.hidden = !screenAddMenu.hidden; }); });
    screenTour.querySelectorAll('[data-menu-choice]').forEach((choice) => choice.addEventListener('click', () => { screenAddMenu.hidden = true; screenAddMenu.style.display = 'none'; screenExplanationTitle.textContent = choice.dataset.menuChoice === 'photos' ? 'Add photos & files' : 'Connect apps'; screenExplanationBody.textContent = choice.dataset.menuChoice === 'photos' ? 'This is the file and image choice. In the real ChatGPT app, the next step is choosing the intended screenshot from your device.' : 'This opens connected-app choices. Availability depends on the account, plan, workspace, and device.'; }));
    screenTour.querySelector('.screen-hotspot-plus').addEventListener('click', () => { screenAddMenu.removeAttribute('hidden'); screenAddMenu.style.display = 'grid'; showScreenExplanation('plus'); });
    const module3PreviewRefs = [...document.querySelectorAll('.module3-screen-visual .screen-reference')];
    const syncModule3Previews = (key) => { const view = screenDevices[key]; if (!view) return; const mobile = view.mode === 'phone-mode'; const android = key === 'android'; module3PreviewRefs.forEach((preview, index) => { preview.classList.toggle('phone-mode', mobile); preview.classList.toggle('android-mode', android); preview.classList.toggle('desktop-mode', !mobile); preview.classList.toggle('mac-mode', key === 'mac'); const sourceFigure = preview.closest('figure')?.querySelector('.module3-source-image'); if (sourceFigure) sourceFigure.hidden = key !== 'windows'; preview.hidden = key === 'windows'; const topLine = preview.querySelector('.screen-topline'); if (topLine) topLine.innerHTML = mobile ? mobileTopline(key) : '<strong>ChatGPT</strong><span>Log in</span><span>Sign up for free</span>'; const caption = preview.closest('figure')?.querySelector('figcaption'); if (caption) caption.textContent = key === 'windows' ? (index === 1 ? 'Windows reference: the supplied plus menu opens the choices for adding photos and files.' : 'Windows reference: Work is selected and the message field is ready.') : (mobile ? `${view.title}: the message field is at the bottom of the conversation${index === 1 ? ', and the plus menu opens the file choices' : ''}.` : `${view.title}: the message field is at the bottom of the conversation${index === 1 ? ', and the plus menu opens the file choices' : ''}.`); }); };
    screenTour.querySelectorAll('[data-screen-device]').forEach((button) => button.addEventListener('click', () => syncModule3Previews(button.dataset.screenDevice)));
    const initialScreenDevice = /iPhone|iPad/i.test(saved.device) ? 'iphone' : /Android/i.test(saved.device) ? 'android' : /Mac/i.test(saved.device) ? 'mac' : 'windows';
    const initialScreenButton = screenTour.querySelector(`[data-screen-device="${initialScreenDevice}"]`);
    if (initialScreenButton) initialScreenButton.click();
    const activateWindowsGallery = () => { screenReference.classList.add('hidden'); windowsGallery.classList.remove('hidden'); androidGallery.classList.add('hidden'); screenReference.classList.remove('phone-mode', 'android-mode'); screenReference.classList.add('desktop-mode'); screenTitle.textContent = screenDevices.windows.title; screenSource.textContent = 'Supplied Windows PC screenshots for the ChatGPT Work view and its controls.'; screenStatus.textContent = 'SUPPLIED REFERENCE'; const tourInstruction = screenTour.querySelector('.screen-tour-instruction'); if (tourInstruction) tourInstruction.textContent = 'Click a Windows step to open the exact supplied screenshot and explanation.'; showWindowsState('home'); };
    windowsGallery.querySelectorAll('[data-windows-state]').forEach((button) => button.addEventListener('click', () => showWindowsState(button.dataset.windowsState)));
    if (initialScreenDevice === 'windows') activateWindowsGallery();
    document.addEventListener('click', (event) => { const button = event.target.closest('[data-screen-device]'); if (!button || !screenTour.contains(button)) return; if (button.dataset.screenDevice === 'windows') activateWindowsGallery(); else windowsGallery.classList.add('hidden'); });
    document.querySelectorAll('[data-device]').forEach((choice) => choice.addEventListener('click', () => { const key = /iPhone|iPad/i.test(choice.dataset.device) ? 'iphone' : /Android/i.test(choice.dataset.device) ? 'android' : /Mac/i.test(choice.dataset.device) ? 'mac' : 'windows'; screenTour.querySelector(`[data-screen-device="${key}"]`)?.click(); }));
    screenPage.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => go(button.dataset.go)));
    document.querySelectorAll('.module3-followup [data-go]').forEach((button) => button.addEventListener('click', () => go(button.dataset.go)));
    const choosePracticeFile = screenPage.querySelector('#choosePracticeFile');
    const uploadPracticeButton = screenPage.querySelector('#uploadPracticeButton');
    const uploadPracticeInput = screenPage.querySelector('#uploadPracticeInput');
    const uploadPracticeStatus = screenPage.querySelector('#uploadPracticeStatus');
    const openFilePicker = () => uploadPracticeInput.click();
    choosePracticeFile.addEventListener('click', openFilePicker);
    uploadPracticeButton.addEventListener('click', openFilePicker);
    uploadPracticeInput.addEventListener('change', () => { const file = uploadPracticeInput.files?.[0]; if (file) uploadPracticeStatus.textContent = `Selected locally: ${file.name}. Nothing was uploaded or sent.`; });
    screenPage.querySelector('#readScreenLesson').addEventListener('click', () => speak('Understanding the ChatGPT screen. Find the message area, then look for the plus button to add photos and files. Check your screenshot for private information before you choose it.'));
    updateDevice();
  }
  const homeCards = document.querySelectorAll('#homePage .module-card');
  const homeRoutes = ['learn', 'lesson4', 'lesson5'];
  const homeStatuses = ['IN PROGRESS', 'NEXT UP', 'AVAILABLE'];
  homeCards.forEach((card, index) => {
    const route = homeRoutes[index];
    if (!route) return;
    card.dataset.go = route;
    card.classList.remove('locked');
    card.querySelector('.lock')?.remove();
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    const status = card.querySelector('.status-pill');
    if (status) status.textContent = homeStatuses[index];
    card.addEventListener('click', () => go(route));
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(route); } });
  });
  document.querySelectorAll('.term-card').forEach((card) => { const label = card.querySelector('strong')?.textContent.trim(); if (glossaryIcons[label]) { const icon = document.createElement('span'); icon.className = 'term-icon'; icon.setAttribute('aria-hidden', 'true'); icon.innerHTML = glossaryIcons[label]; card.insertBefore(icon, card.firstChild); } });
  const module2Page = document.getElementById('lesson4Page');
  if (module2Page) {
    const eyebrow = module2Page.querySelector('.lesson-header .eyebrow');
    const crumb = module2Page.querySelector('.lesson-breadcrumb span:last-child');
    const back = module2Page.querySelector('.lesson-breadcrumb .back-link');
    if (eyebrow) eyebrow.textContent = 'RECOGNIZE & DOWNLOAD CHATGPT';
    const module2Title = module2Page.querySelector('.lesson-header h1');
    const module2Lede = module2Page.querySelector('.lesson-header .lede');
    if (module2Title) module2Title.textContent = 'Recognize and download ChatGPT';
    if (module2Lede) module2Lede.textContent = 'First confirm the name, publisher, and source. Then follow the official path to download the ChatGPT on Windows app.';
    if (crumb) crumb.textContent = 'Module 2 · Lesson 1 of 4';
    if (back) { back.dataset.go = 'home'; back.textContent = '← Learning path'; }
    const module2Intro = module2Page.querySelector('.lesson-intro p');
    const module2IntroHeading = module2Page.querySelector('.lesson-intro h2');
    if (module2IntroHeading) module2IntroHeading.textContent = 'Recognize it before you download it';
    if (module2Intro) module2Intro.innerHTML = 'Before you choose Download for Windows, check the three clues that separate the official ChatGPT from a look-alike.';
    const downloadSteps = module2Page.querySelector('.download-steps');
    if (downloadSteps && !module2Page.querySelector('.recognition-check')) downloadSteps.insertAdjacentHTML('beforebegin', '<div class="lesson-section recognition-check" id="module2RecognitionCheck"><div class="section-title-row"><div><h3>Check these three clues</h3><p>Use the name, publisher, and source together. If one does not match, pause before installing.</p></div><span class="safe-badge">START HERE</span></div><div class="module2-clue-grid" aria-label="Choose a clue to highlight"><button type="button" class="module2-clue" data-module2-clue="name"><strong>Name</strong><small>It says ChatGPT clearly.</small></button><button type="button" class="module2-clue" data-module2-clue="publisher"><strong>Publisher</strong><small>It says OpenAI.</small></button><button type="button" class="module2-clue" data-module2-clue="source"><strong>Source</strong><small>Use https://www.chatgpt.com.</small></button></div><figure class="module2-recognition-reference"><div class="module2-recognition-image"><img src="assets/google-chatgpt-official-result.png" alt="Supplied Google result showing ChatGPT, the https://www.chatgpt.com address, and Official ChatGPT from OpenAI" /><span class="module2-recognition-target" data-module2-target="name" aria-hidden="true"></span><span class="module2-recognition-target" data-module2-target="source" aria-hidden="true"></span><span class="module2-recognition-target" data-module2-target="publisher" aria-hidden="true"></span></div><figcaption>Hover over a clue above. The matching part of the real result will glow.</figcaption></figure><div class="module2-clue-feedback" id="module2ClueFeedback" role="status" aria-live="polite">Choose a clue to highlight the matching words.</div></div>');
    const module2ClueButtons = [...module2Page.querySelectorAll('[data-module2-clue]')];
    const setModule2Clue = (clue) => {
      module2Page.querySelectorAll('[data-module2-target]').forEach((target) => target.classList.toggle('active', target.dataset.module2Target === clue));
      module2ClueButtons.forEach((button) => button.classList.toggle('active', button.dataset.module2Clue === clue));
      const feedback = module2Page.querySelector('#module2ClueFeedback');
      if (feedback) feedback.textContent = `The ${clue} is highlighted in the supplied Google result.`;
    };
    module2ClueButtons.forEach((button) => {
      button.addEventListener('mouseenter', () => setModule2Clue(button.dataset.module2Clue));
      button.addEventListener('focus', () => setModule2Clue(button.dataset.module2Clue));
      button.addEventListener('click', () => setModule2Clue(button.dataset.module2Clue));
    });
    const downloadReference = module2Page.querySelector('.download-step:first-child .reference-figure');
    if (downloadReference && !module2Page.querySelector('.chrome-extension-note')) downloadReference.insertAdjacentHTML('afterend', '<div class="chrome-extension-note"><span class="chrome-note-arrow" aria-hidden="true">↗</span><p><strong>Download Chrome extension:</strong> this adds a ChatGPT shortcut to Chrome so you can open ChatGPT from the browser. It is not the Windows app.</p></div>');
    const duplicateReference = module2Page.querySelector('.download-step:nth-child(2) .reference-figure');
    if (duplicateReference) duplicateReference.outerHTML = '<div class="download-step-note"><strong>Choose Download for Windows</strong><span>This button sends you to the Microsoft Store. Continue to the listing check below.</span></div>';
    const module2Next = module2Page.querySelector('.next-step .primary-button');
    if (module2Next) { module2Next.dataset.go = 'lesson5'; module2Next.innerHTML = 'Next: understanding the ChatGPT screen <span>→</span>'; module2Next.insertAdjacentHTML('afterend', '<button class="text-link follow-up-link" data-go="practice" type="button">Open Safe Practice: select, copy, paste</button>'); }
    module2Page.querySelectorAll('.follow-up-link').forEach((button) => button.addEventListener('click', () => go(button.dataset.go)));
  }
  const screenshotViewSelect = document.getElementById('screenshotView');
  const screenshotViewPanels = [...document.querySelectorAll('[data-screenshot-view]')];
  const windowsSnippingReference = document.querySelector('#screenshotsPage .windows-snipping-reference');
  if (windowsSnippingReference) windowsSnippingReference.outerHTML = '<div class="windows-snipping-reference-pair"><figure class="official-screenshot"><img src="https://support.microsoft.com/en-au/windows/media/snipping-tool-opened-png.png" alt="Microsoft Snipping Tool open on Windows" /><figcaption>Snipping Tool is open after the keyboard shortcut.</figcaption></figure><figure class="official-screenshot"><img src="https://support.microsoft.com/en-au/windows/media/snipping-tool-mode-png.png" alt="Microsoft Snipping Tool mode menu showing Rectangle, Window, Full screen, and Freeform" /><figcaption>Open the capture-mode menu to choose Rectangle, Window, Full screen, or Freeform.</figcaption></figure></div>';
  const setScreenshotView = (value) => { screenshotViewPanels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.screenshotView !== value)); if (screenshotViewSelect && screenshotViewSelect.value !== value) screenshotViewSelect.value = value; };
  if (screenshotViewSelect) {
    const initialScreenshotView = /iPhone|iPad/i.test(saved.device) ? 'iphone' : /Android/i.test(saved.device) ? 'android' : /Mac/i.test(saved.device) ? 'mac' : 'windows';
    setScreenshotView(initialScreenshotView);
    screenshotViewSelect.addEventListener('change', () => setScreenshotView(screenshotViewSelect.value));
  }
  go(location.hash.slice(1) || 'home');
  syncModule3Link();
})();
