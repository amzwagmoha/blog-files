document.addEventListener('DOMContentLoaded', function () {
  const containers = document.querySelectorAll('[data-label]');

  containers.forEach(container => {
    const label = container.dataset.label;
    const icon = container.dataset.icon || '';
    const totalCount = document.getElementById('count-' + label);

    fetch('https://amzwag-music.blogspot.com/feeds/posts/default/-/' + label + '?alt=json')
      .then(response => response.json())
      .then(data => {
        const entries = data.feed.entry || [];

        if (entries.length === 0) {
          container.innerHTML = '<p>No article found.</p>';
          return;
        }

        if (totalCount) {
          totalCount.textContent = entries.length;
        }

        let html = '<div class="card-grid">';

        entries.forEach(entry => {
          const title = entry.title.$t;
          const link = entry.link.find(l => l.rel === 'alternate').href;

          // Extraire le poète
          let poet = 'unknown';
          if (entry.content && entry.content.$t) {
            const match = entry.content.$t.match(/<h4[^>]*>(.*?)<\/h4>/i);
            if (match && match[1]) {
              poet = match[1].trim();
            }
          }

          // Extraire tous les labels (y compris le principal)
          const labels = entry.category ? entry.category.map(c => c.term) : [];

          html += `
            <a class="card-link article-card" href="${link}" rel="noopener">
              <div class="card-title"><i class="${icon}"></i>${title}</div>
              <div class="card-meta">
                <span class="poet-name article-poet-name"><i class="bi bi-person-fill"></i> ${poet}</span>
                ${labels.length ? `<span class="category"><i class="bi bi-tag-fill"></i> ${labels.join(' > ')}</span>` : ''}
              </div>
            </a>
          `;
        });

        html += '</div>';
        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = '<p>Failed to load articles.</p>';
      });
  });
});
