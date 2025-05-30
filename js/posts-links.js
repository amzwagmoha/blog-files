document.addEventListener('DOMContentLoaded', function () {
  const containers = document.querySelectorAll('[data-label]');
  const labelsWithPoetLine = ['paroles', 'comptines', 'ahwach', 'rways', 'tagrouppit', 'taznzart'];

  containers.forEach(container => {
    const label = container.dataset.label;
    const icon = container.dataset.icon || '';
    fetch('https://amzwagblog.blogspot.com/feeds/posts/default/-/' + label + '?alt=json')
      .then(response => response.json())
      .then(data => {
        const entries = data.feed.entry || [];
        if (entries.length === 0) {
          container.innerHTML = '<p>Aucun article trouvé.</p>';
          return;
        }

        entries.sort((a, b) => {
          const titleA = a.title.$t.toLowerCase();
          const titleB = b.title.$t.toLowerCase();
          return titleA.localeCompare(titleB);
        });

        const html = entries.map(entry => {
          const title = entry.title.$t;
          const link = entry.link.find(l => l.rel === 'alternate').href;

          let poetSpan = '';
          if (labelsWithPoetLine.includes(label) && entry.content && entry.content.$t) {
            const content = entry.content.$t;
            const match = content.match(/<h4[^>]*>(.*?)<\/h4>/i);
            if (match && match[1]) {
              const poet = match[1].trim();
              poetSpan = `<span class="poet-line">${poet}</span>`;
            }
          }

          return `
            <a class="card-link" href="${link}" rel="noopener">
              <i class="${icon}"></i>
              <div class="card-title">${title}${poetSpan}</div>
            </a>
          `;
        }).join('');

        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = '<p>Impossible de charger les articles.</p>';
      });
  });
});
