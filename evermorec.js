/* category.js — tag index + filtered post ledger */

function renderCategoryPage() {
  const params = new URLSearchParams(location.search);
  const activeTag = params.get('tag');
  const categories = getCategories();
  const tagLinks = document.getElementById('tag-links');
  const ledger = document.getElementById('ledger');
  const heading = document.getElementById('category-heading');
  const sub = document.getElementById('category-sub');

  tagLinks.innerHTML = categories.map(cat => `
    <a class="tag-link${activeTag && activeTag.toLowerCase() === cat.toLowerCase() ? ' is-active' : ''}"
       href="evermorec.html?tag=${encodeURIComponent(cat)}">${escapeHtml(cat)}</a>
  `).join('');

  const posts = activeTag ? getPostsByCategory(activeTag) : getAllPosts();

  if (activeTag) {
    heading.textContent = activeTag;
    sub.textContent = posts.length + (posts.length === 1 ? ' entry filed here.' : ' entries filed here.');
    document.title = activeTag + ' — Fieldnotes';
  } else {
    heading.textContent = 'Categories';
    sub.textContent = "Every entry, grouped by what it's about.";
    document.title = 'Categories — Fieldnotes';
  }

  if (posts.length === 0) {
    ledger.innerHTML = '<li class="ledger-empty">No entries in this category yet.</li>';
    return;
  }

  ledger.innerHTML = posts.map(post => `
    <li class="ledger-item">
      <div class="ledger-date">${formatDateShort(post.date)}</div>
      <div>
        <h2 class="ledger-title"><a href="evermorep.html?id=${encodeURIComponent(post.id)}">${escapeHtml(post.title)}</a></h2>
        <p class="ledger-excerpt">${escapeHtml(post.excerpt)}</p>
        <a class="ledger-category" href="evermorec.html?tag=${encodeURIComponent(post.category)}">${escapeHtml(post.category)}</a>
      </div>
    </li>
  `).join('');
}

document.addEventListener('DOMContentLoaded', renderCategoryPage);
