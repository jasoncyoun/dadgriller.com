(function(){
  const baseServings = document.getElementById('servings-picker').getAttribute('data-base-servings-size');

  const selectEl = document.getElementById('servings-select');
  const listItems = document.querySelectorAll('.ingredient-list li[data-base-qty][data-unit]');

  if (!selectEl || listItems.length === 0) return;

  function formatQty(num) {
    const rounded = Math.round(num * 100) / 100;
  
    // Whole number?
    if (rounded % 1 === 0) {
      return String(rounded);
    }
  
    const whole = Math.floor(rounded);
    const decimal = rounded - whole;
  
    const fractionMap = {
      0.5:  '½',
      0.25: '¼',
      0.75: '¾',
      0.33: '⅓',
      0.66: '⅔',
      0.125: '⅛',
      0.375: '⅜',
      0.625: '⅝',
      0.875: '⅞',
    };
  
    // Find closest match within a small tolerance
    let fraction = null;
    for (const [key, symbol] of Object.entries(fractionMap)) {
      if (Math.abs(decimal - parseFloat(key)) < 0.02) {
        fraction = symbol;
        break;
      }
    }
  
    // If we found a fraction
    if (fraction) {
      return whole > 0 ? `${whole} ${fraction}` : fraction;
    }
  
    // Fallback: return as a simple decimal
    return String(rounded);
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
