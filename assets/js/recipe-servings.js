(function(){
  const baseServings = document.getElementById('servings-picker').getAttribute('data-base-servings-size');

  const selectEl = document.getElementById('servings-select');
  const listItems = document.querySelectorAll('.ingredient-list li[data-base-qty][data-unit]');

  if (!selectEl || listItems.length === 0) return;

  function formatQty(num) {
    const rounded = Math.round(num * 100) / 100;
    if (rounded % 1 === 0) {
      return String(rounded);
    }
    if (rounded === 0.5) {
      return '½'
    } else if (rounded === 0.75) {
      return '¾';
    } else if (rounded === 0.25) {
      return '¼';
    } else if (rounded === 0.33) {
      return '⅓';
    } else if (rounded === 0.66) {
      return '⅔';
    } else if (rounded === 0.83) {
      return '⅝';
    } else if (rounded === 0.16) {
      return '⅛';
    } else if (rounded === 0.625) {
      return '⅝';
    } else if (rounded === 0.375) {
      return '⅜';
    } else if (rounded === 0.875) {
      return '⅞';
    }
    const str = rounded.toString();
    if (str.startsWith('0.')) {
      return str.slice(1);
    }
    return str;
  }

  function updateQuantities(newServings) {
    const factor = newServings / baseServings;
    listItems.forEach(li => {
      const baseQty = parseFloat(li.getAttribute('data-base-qty'));
      const unit = li.getAttribute('data-unit');
      const desc = li.getAttribute('data-ingredient-name') || li.textContent.trim();

      if (isNaN(baseQty)) return;

      const scaled = baseQty * factor;
      const formatted = formatQty(scaled);

      li.innerHTML = `<strong>${formatted} ${unit}</strong> ${desc}`;
    });
  }

  selectEl.addEventListener('change', () => {
    const newServ = parseInt(selectEl.value, 10);
    if (!isNaN(newServ) && newServ > 0) {
      updateQuantities(newServ);
    }
  });

  // Initialize
  updateQuantities(parseInt(selectEl.value, 10) || baseServings);
})();
