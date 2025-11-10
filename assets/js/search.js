console.log("Search script loaded");
(async function () {
  

  const res = await fetch('/search.json');
  const data = await res.json();

  const fuse = new Fuse(data, {
    includeScore: true,
    threshold: 0.3,
    keys: ['title', 'content', 'categories']
  });

  const input = document.getElementById('search-input');
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  if (q) {
    input.value = q;
    const results = fuse.search(q);
    renderResults(results);
  }

  const resultsContainer = document.getElementById('search-results');

  function renderResults(results) {
    if (!results.length) {
      resultsContainer.innerHTML = '<p class="no-results">No matching recipes found.</p>';
      return;
    }

    resultsContainer.innerHTML = results.map(r => `
      <article class="result">
        <h3><a href="${r.item.url}">${r.item.title}</a></h3>
        <p class="meta">${r.item.date || ''}</p>
        ${r.item.image ? `<a href="${r.item.url}"><img src="${r.item.image}" alt="${r.item.title}"></a>` : ''}
        <p>${(r.item.content || '').slice(0, 160)}…</p>
      </article>
    `).join('');
  }

  input.addEventListener('input', e => {
    const query = e.target.value.trim();
    if (!query) {
      resultsContainer.innerHTML = '';
      return;
    }
    const results = fuse.search(query);
    renderResults(results);
  });
})();
