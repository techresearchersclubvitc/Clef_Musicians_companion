(function () {
  'use strict';

  // Small helper to get trimmed value from an input element
  function getInputValue(el) {
    if (!el) return '';
    return (el.value || '').toString().trim();
  }

  // createRow: returns a DOM node for one key-value pair row
  function createRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'Vinayak__row';

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'Vinayak__input Vinayak__key';
    keyInput.placeholder = 'Key';
    keyInput.value = key;

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'Vinayak__input Vinayak__value';
    valueInput.placeholder = 'Value';
    valueInput.value = value;

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'Vinayak__del';
    del.title = 'Delete pair';
    del.textContent = '✕';

    // Use data attribute to identify delete action in event delegation
    del.setAttribute('data-action', 'delete-row');

    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(del);

    return row;
  }

  // append a new row into the rows container
  function addRow(container, key = '', value = '') {
    const r = createRow(key, value);
    container.appendChild(r);
    // focus the key input of the new row for convenience
    const input = r.querySelector('.Vinayak__key');
    if (input) input.focus();
    return r;
  }

  // handles row deletion using event delegation
  function removeRow(evt, rowsContainer) {
    const btn = evt.target.closest('[data-action="delete-row"]');
    if (!btn) return; // not a delete event
    const row = btn.closest('.Vinayak__row');
    if (row && rowsContainer.contains(row)) {
      rowsContainer.removeChild(row);
    }
  }

  // reads all rows and returns an object (dictionary)
  // ignores empty rows (both key and value empty)
  // warns on duplicate keys (keeps last seen value)
  function collectPairs(rowsContainer) {
    const rows = Array.from(rowsContainer.querySelectorAll('.Vinayak__row'));
    const out = {};
    const duplicates = new Set();
    const seen = new Map();

    for (const row of rows) {
      const kEl = row.querySelector('.Vinayak__key');
      const vEl = row.querySelector('.Vinayak__value');
      const key = getInputValue(kEl);
      const value = getInputValue(vEl);

      // ignore completely empty rows (both key and value empty)
      if (key === '' && value === '') continue;

      // if key empty but value present, treat key as empty-string key -> include it (but warn)
      // We'll still allow empty-string key, but it's usually undesirable.
      if (seen.has(key)) {
        duplicates.add(key);
      }
      seen.set(key, value);
    }

    // build final object using last-seen semantics
    for (const [k, v] of seen.entries()) {
      // if key is empty string, keep it as '' property name — JS allows that.
      out[k] = v;
    }

    return { obj: out, duplicates: Array.from(duplicates) };
  }

  // handleConfirm: calls collectPairs(), console.log(obj), and shows a brief message
  function handleConfirm(rowsContainer, messageEl) {
    const { obj, duplicates } = collectPairs(rowsContainer);

    // Log exactly as requested
    console.log(obj);

    // Build a user-visible message
    if (Object.keys(obj).length === 0) {
      showMessage(messageEl, 'No key/value pairs to submit.', 'warn');
      return;
    }

    if (duplicates.length) {
      showMessage(messageEl, `Submitted. Warning: duplicate key(s) ignored/overwritten: ${duplicates.join(', ')}`, 'warn');
    } else {
      showMessage(messageEl, 'Submitted successfully.', 'ok');
    }
  }

  function showMessage(msgEl, text, kind) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.remove('Vinayak__message--warn', 'Vinayak__message--ok');
    if (kind === 'warn') msgEl.classList.add('Vinayak__message--warn');
    if (kind === 'ok') msgEl.classList.add('Vinayak__message--ok');
    // clear message after 4s
    setTimeout(() => {
      if (msgEl) msgEl.textContent = '';
    }, 4000);
  }

  // initialize: attach listeners and add one initial row
  function init() {
    const root = document.querySelector('.Vinayak');
    if (!root) return;
    const rowsContainer = root.querySelector('.Vinayak__rows');
    const addBtn = root.querySelector('.Vinayak__add');
    const confirmBtn = root.querySelector('.Vinayak__confirm');
    const msg = root.querySelector('.Vinayak__message');

    if (!rowsContainer || !addBtn || !confirmBtn) return;

    // event delegation for delete buttons inside rows container
    rowsContainer.addEventListener('click', function (evt) {
      removeRow(evt, rowsContainer);
    });

    addBtn.addEventListener('click', function () {
      addRow(rowsContainer);
    });

    confirmBtn.addEventListener('click', function () {
      handleConfirm(rowsContainer, msg);
    });

    // allow Enter on inputs to add a new row if both key and value are filled
    rowsContainer.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') {
        const active = document.activeElement;
        if (!active) return;
        // if focus is inside a value input, and has content, add a new row
        if (active.classList && active.classList.contains('Vinayak__value')) {
          const v = getInputValue(active);
          if (v !== '') {
            addRow(rowsContainer);
          }
        }
      }
    });

    // add one initial row on load
    addRow(rowsContainer);
  }

  // Run init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export helpers for debugging in browser console (optional)
  window.Vinayak_keypairs = {
    createRow,
    addRow,
    removeRow,
    collectPairs,
    handleConfirm,
    getInputValue,
  };
})();