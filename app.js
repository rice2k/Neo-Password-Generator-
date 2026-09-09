const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/|~'
};

const AMBIGUOUS = new Set('0Oo1Il|');
const state = { passwords: [] };

const els = {
  lengthRange: document.getElementById('lengthRange'),
  lengthNumber: document.getElementById('lengthNumber'),
  lowercase: document.getElementById('lowercase'),
  uppercase: document.getElementById('uppercase'),
  numbers: document.getElementById('numbers'),
  symbols: document.getElementById('symbols'),
  excludeAmbiguous: document.getElementById('excludeAmbiguous'),
  noRepeats: document.getElementById('noRepeats'),
  startWithLetter: document.getElementById('startWithLetter'),
  excludedChars: document.getElementById('excludedChars'),
  quantity: document.getElementById('quantity'),
  generateButton: document.getElementById('generateButton'),
  copyAllButton: document.getElementById('copyAllButton'),
  resetButton: document.getElementById('resetButton'),
  results: document.getElementById('results'),
  resultCount: document.getElementById('resultCount'),
  errorMessage: document.getElementById('errorMessage'),
  strengthLabel: document.getElementById('strengthLabel'),
  entropyValue: document.getElementById('entropyValue'),
  strengthMeter: document.getElementById('strengthMeter'),
  strengthDetail: document.getElementById('strengthDetail'),
  themeToggle: document.getElementById('themeToggle'),
  toast: document.getElementById('toast')
};

function cryptoRandomInt(max) {
  if (!Number.isSafeInteger(max) || max <= 0) throw new Error('Invalid random range.');
  const maxUint = 0x100000000;
  const limit = maxUint - (maxUint % max);
  const buffer = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % max;
}

function pick(str, used = null) {
  if (!str.length) throw new Error('A selected character set became empty after exclusions.');
  if (!used) return str[cryptoRandomInt(str.length)];
  const available = [...str].filter(ch => !used.has(ch));
  if (!available.length) throw new Error('Not enough unique characters for the selected options.');
  const ch = available[cryptoRandomInt(available.length)];
  used.add(ch);
  return ch;
}

function secureShuffle(chars) {
  for (let i = chars.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars;
}

function sanitizeLength(value) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return 20;
  return Math.min(128, Math.max(4, n));
}

function getConfig() {
  const length = sanitizeLength(els.lengthNumber.value);
  const excluded = new Set(els.excludedChars.value.split(''));
  if (els.excludeAmbiguous.checked) AMBIGUOUS.forEach(ch => excluded.add(ch));

  const selected = [];
  for (const key of ['lowercase', 'uppercase', 'numbers', 'symbols']) {
    if (!els[key].checked) continue;
    const filtered = [...CHARSETS[key]].filter(ch => !excluded.has(ch)).join('');
    if (!filtered) throw new Error(`${key[0].toUpperCase() + key.slice(1)} has no characters left after exclusions.`);
    selected.push({ key, chars: filtered });
  }

  if (!selected.length) throw new Error('Select at least one character set.');
  if (length < selected.length) throw new Error(`Length must be at least ${selected.length} to include every selected character set.`);

  const pool = [...new Set(selected.map(group => group.chars).join(''))].join('');
  if (els.noRepeats.checked && length > pool.length) {
    throw new Error(`No-repeat mode has only ${pool.length} available unique characters. Reduce the length or exclusions.`);
  }

  if (els.startWithLetter.checked && !selected.some(group => group.key === 'lowercase' || group.key === 'uppercase')) {
    throw new Error('Start-with-letter requires lowercase and/or uppercase letters.');
  }

  return {
    length,
    selected,
    pool,
    noRepeats: els.noRepeats.checked,
    startWithLetter: els.startWithLetter.checked
  };
}

function generateOne(config) {
  const used = config.noRepeats ? new Set() : null;
  const chars = [];

  // Guarantee at least one character from every selected character group.
  for (const group of config.selected) chars.push(pick(group.chars, used));
  while (chars.length < config.length) chars.push(pick(config.pool, used));
  secureShuffle(chars);

  if (config.startWithLetter) {
    const letters = CHARSETS.lowercase + CHARSETS.uppercase;
    const index = chars.findIndex(ch => letters.includes(ch));
    if (index > 0) [chars[0], chars[index]] = [chars[index], chars[0]];
  }

  return chars.join('');
}

function estimateEntropy(config) {
  if (config.noRepeats) {
    let bits = 0;
    for (let i = 0; i < config.length; i++) {
      bits += Math.log2(Math.max(1, config.pool.length - i));
    }
    return Math.max(0, bits);
  }
  return config.length * Math.log2(config.pool.length);
}

function strengthFromBits(bits) {
  if (bits < 40) return { label: 'Weak', percent: 22, detail: 'Increase the length or add more character groups.' };
  if (bits < 60) return { label: 'Fair', percent: 45, detail: 'Reasonable for lower-risk uses, but a longer password would be safer.' };
  if (bits < 85) return { label: 'Strong', percent: 72, detail: 'A strong random password for most account use.' };
  return { label: 'Excellent', percent: 100, detail: 'A long random password with a large search space.' };
}

function renderStrength(config) {
  const bits = estimateEntropy(config);
  const strength = strengthFromBits(bits);
  els.entropyValue.textContent = Math.round(bits);
  els.strengthLabel.textContent = strength.label;
  els.strengthMeter.style.width = `${strength.percent}%`;
  els.strengthDetail.textContent = strength.detail;
}

function renderResults() {
  els.results.replaceChildren();

  state.passwords.forEach((password, index) => {
    const row = document.createElement('div');
    row.className = 'result-item';

    const value = document.createElement('div');
    value.className = 'password-value';
    value.textContent = password;
    value.setAttribute('aria-label', `Generated password ${index + 1}`);

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.textContent = 'Copy';
    button.addEventListener('click', () => copyText(password, `Password ${index + 1} copied`));

    row.append(value, button);
    els.results.append(row);
  });

  const count = state.passwords.length;
  els.resultCount.textContent = `${count} password${count === 1 ? '' : 's'}`;
  els.copyAllButton.disabled = count === 0;
}

function generate() {
  els.errorMessage.textContent = '';
  try {
    const config = getConfig();
    const quantity = Number.parseInt(els.quantity.value, 10) || 1;
    state.passwords = Array.from({ length: quantity }, () => generateOne(config));
    renderStrength(config);
    renderResults();
  } catch (error) {
    state.passwords = [];
    renderResults();
    els.errorMessage.textContent = error.message || 'Unable to generate a password with those settings.';
  }
}

async function copyText(text, message = 'Copied') {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  showToast(message);
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('show');
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1800);
}

const PRESETS = {
  balanced: { length: 20, lower: true, upper: true, numbers: true, symbols: true, ambiguous: true, repeats: false, firstLetter: false },
  strong: { length: 24, lower: true, upper: true, numbers: true, symbols: true, ambiguous: true, repeats: false, firstLetter: false },
  maximum: { length: 40, lower: true, upper: true, numbers: true, symbols: true, ambiguous: false, repeats: false, firstLetter: false },
  easy: { length: 18, lower: true, upper: true, numbers: true, symbols: false, ambiguous: true, repeats: false, firstLetter: true },
  pin: { length: 6, lower: false, upper: false, numbers: true, symbols: false, ambiguous: false, repeats: false, firstLetter: false }
};

function setLength(value) {
  const n = sanitizeLength(value);
  els.lengthRange.value = String(n);
  els.lengthNumber.value = String(n);
}

function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  setLength(preset.length);
  els.lowercase.checked = preset.lower;
  els.uppercase.checked = preset.upper;
  els.numbers.checked = preset.numbers;
  els.symbols.checked = preset.symbols;
  els.excludeAmbiguous.checked = preset.ambiguous;
  els.noRepeats.checked = preset.repeats;
  els.startWithLetter.checked = preset.firstLetter;
  els.excludedChars.value = '';
  document.querySelectorAll('.preset').forEach(button => {
    button.classList.toggle('active', button.dataset.preset === name);
  });
  generate();
}

function markCustom() {
  document.querySelectorAll('.preset').forEach(button => button.classList.remove('active'));
}

function reset() {
  els.quantity.value = '1';
  applyPreset('balanced');
}

function initTheme() {
  const saved = localStorage.getItem('neo-password-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('neo-password-theme', next);
}

els.lengthRange.addEventListener('input', event => {
  setLength(event.target.value);
  markCustom();
  generate();
});

els.lengthNumber.addEventListener('change', event => {
  setLength(event.target.value);
  markCustom();
  generate();
});

['lowercase', 'uppercase', 'numbers', 'symbols', 'excludeAmbiguous', 'noRepeats', 'startWithLetter'].forEach(key => {
  els[key].addEventListener('change', () => {
    markCustom();
    generate();
  });
});

els.excludedChars.addEventListener('input', () => {
  markCustom();
  generate();
});

els.quantity.addEventListener('change', generate);
els.generateButton.addEventListener('click', generate);
els.resetButton.addEventListener('click', reset);
els.copyAllButton.addEventListener('click', () => copyText(state.passwords.join('\n'), 'All passwords copied'));
els.themeToggle.addEventListener('click', toggleTheme);

document.querySelectorAll('.preset').forEach(button => {
  button.addEventListener('click', () => applyPreset(button.dataset.preset));
});

document.addEventListener('keydown', event => {
  const mod = event.ctrlKey || event.metaKey;
  if (mod && event.key === 'Enter') {
    event.preventDefault();
    generate();
  }
  if (mod && event.shiftKey && event.key.toLowerCase() === 'c' && state.passwords[0]) {
    event.preventDefault();
    copyText(state.passwords[0], 'First password copied');
  }
});

initTheme();
generate();
