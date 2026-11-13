const search = document.querySelector('#project-search');
const filterGroup = document.querySelector('.filters');
const filters = [...filterGroup.querySelectorAll('[data-filter]')];
const rows = [...document.querySelectorAll('.repo-row')].map(row => ({
  element: row,
  category: row.dataset.category,
  text: searchText(row.textContent),
}));
const resultCount = document.querySelector('#result-count');
const noResults = document.querySelector('.no-results');
const params = new URLSearchParams(location.search);
const requestedCategory = params.get('category');
let category = filters.some(button => button.dataset.filter === requestedCategory)
  ? requestedCategory
  : 'all';

function searchText(value) {
  return value.toLowerCase().replace(/[-_]+/g, ' ');
}

function render() {
  const terms = searchText(search.value).trim().split(/\s+/).filter(Boolean);
  let count = 0;

  for (const row of rows) {
    const matches = (category === 'all' || row.category === category)
      && terms.every(term => row.text.includes(term));
    row.element.hidden = !matches;
    if (matches) count++;
  }

  for (const button of filters) {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  }

  const countLabel = `${count} 个项目`;
  if (resultCount.textContent !== countLabel) resultCount.textContent = countLabel;
  noResults.hidden = count > 0;
}

function saveFilters() {
  const url = new URL(location.href);
  const query = search.value.trim();
  if (query) url.searchParams.set('q', query);
  else url.searchParams.delete('q');
  if (category !== 'all') url.searchParams.set('category', category);
  else url.searchParams.delete('category');
  history.replaceState(null, '', url);
}

search.value = params.get('q') || '';
render();
search.parentElement.hidden = false;
filterGroup.hidden = false;

search.addEventListener('input', () => {
  render();
  saveFilters();
});
filterGroup.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  category = button.dataset.filter;
  render();
  saveFilters();
});
document.querySelector('#reset-search').addEventListener('click', () => {
  search.value = '';
  category = 'all';
  render();
  saveFilters();
  search.focus();
});
document.addEventListener('keydown', event => {
  if (event.key !== '/' || event.altKey || event.ctrlKey || event.metaKey
    || event.target.closest('input, textarea, [contenteditable]')) return;
  event.preventDefault();
  search.focus();
});
