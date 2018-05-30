const axios = require('axios');

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `
  }).join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = document.querySelector('input[name="search"]');
  const searchResults = document.querySelector('.search__results');

  searchInput.on('input', function () {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        searchResults.innerHTML = searchResultsHTML(res.data);
      });
  });

  searchInput.on('keyup', (e) => {
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13) {
      window.location = current.href;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);

  });
}

export default typeAhead;