﻿document.addEventListener('DOMContentLoaded', function () {
  const containers = document.querySelectorAll('[data-label]');
  const labelsWithPoetLine = ['paroles', 'ahwach', 'rways', 'tagrouppit', 'taznzart', 'comptines'];

  containers.forEach(container => {
    const label = container.dataset.label;
    const icon = container.dataset.icon || '';
    const totalCount = document.getElementById('count-' + label);

    fetch('/feeds/posts/default/-/' + label + '?alt=json') /*https://amzwagblog.blogspot.com*/
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

        let html = '';
        
        if (labelsWithPoetLine.includes(label)) {
          // Grouper par poète
          const groupedByPoet = {};

          entries.forEach(entry => {
            const title = entry.title.$t;
            const link = entry.link.find(l => l.rel === 'alternate').href;

            let poet = 'Unknown';
            if (entry.content && entry.content.$t) {
              const match = entry.content.$t.match(/<h4[^>]*>(.*?)<\/h4>/i);
              if (match && match[1]) {
                poet = match[1].trim();
              }
            }

            if (!groupedByPoet[poet]) {
              groupedByPoet[poet] = [];
            }
            groupedByPoet[poet].push({ title, link });
          });

          const sortedPoets = Object.keys(groupedByPoet).sort((a, b) => a.localeCompare(b));

          sortedPoets.forEach(poet => {
            html += `<h3 class="poet-name">${poet} <span class="poet-count">${groupedByPoet[poet].length} articles</span></h3>`;
            html += `<div class="card-grid">`;
            groupedByPoet[poet].forEach(entry => {
              html += `
                <a class="card-link" href="${entry.link}" rel="noopener">
                  <i class="${icon}"></i>
                  <div class="card-title">${entry.title}</div>
                </a>
              `;
            });
            html += `</div>`;
          });

        } else {
          // Affichage simple sans poète
          html += `<div class="card-grid">`;
          entries.forEach(entry => {
            const title = entry.title.$t;
            const link = entry.link.find(l => l.rel === 'alternate').href;

            html += `
              <a class="card-link" href="${link}" rel="noopener">
                <i class="${icon}"></i>
                <div class="card-title">${title}</div>
              </a>
            `;
          });
          html += `</div>`;
        }

        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = '<p>Failed to load articles.</p>';
      });
  });
});
