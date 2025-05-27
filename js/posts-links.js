
  document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('[data-label]');
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

          // Trier les articles par titre (alphabétique, insensible à la casse)
          entries.sort((a, b) => {
            const titleA = a.title.$t.toLowerCase();
            const titleB = b.title.$t.toLowerCase();
            return titleA.localeCompare(titleB);
          });

          const html = entries.map(entry => {
            const title = entry.title.$t;
            const link = entry.link.find(l => l.rel === 'alternate').href;

            let poetLine = '';
            if (label === 'paroles' && entry.content && entry.content.$t) {
              const content = entry.content.$t;
              const match = content.match(/<h4[^>]*>(.*?)<\/h4>/i);
              if (match && match[1]) {
                const poet = match[1].trim();
                poetLine = ` <span>${poet}</span>`;
              }
            }

            return `
              <li>
                <a href="${link}" rel="noopener"><i class="${icon}"></i>${title}</a>
                <span class="poet-line">${poetLine}</span>
              </li>
            `;
          }).join('');

          container.innerHTML = `<ul class="label-list">${html}</ul>`;
        })
        .catch(() => {
          container.innerHTML = '<p>Impossible de charger les articles.</p>';
        });
    });
  });


