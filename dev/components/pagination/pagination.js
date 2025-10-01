/**
 * Universal Client-Side Pagination with Smooth Animations
 * Works with any card grid and JSON data
 */

class ClientPagination {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      itemsPerPage: parseInt(container.dataset.perPage) || 12,
      cardSelector: container.dataset.cardSelector || options.cardSelector || '.card',
      gridSelector: container.dataset.gridSelector || options.gridSelector || '.archive__grid',
      animationDuration: options.animationDuration || 400,
      staggerDelay: options.staggerDelay || 30,
      scrollOffset: parseInt(container.dataset.scrollOffset) || options.scrollOffset || 164, // 100 + 64
      onPageChange: options.onPageChange || null,
      ...options
    };

    // Elements
    this.grid = document.querySelector(this.options.gridSelector);
    this.infoElement = container.querySelector('[data-pagination-info]');
    this.pagesContainer = container.querySelector('[data-pagination-pages]');
    this.prevButton = container.querySelector('[data-pagination-prev]');
    this.nextButton = container.querySelector('[data-pagination-next]');
    this.perPageSelect = container.querySelector('[data-pagination-per-page]');

    // State
    this.currentPage = 1;
    this.allItems = [];
    this.filteredItems = [];
    this.isAnimating = false;

    this.init();
  }

  init() {
    if (!this.grid) {
      console.warn('Pagination: grid not found');
      return;
    }

    // Add CSS for smooth transitions
    this.injectAnimationStyles();

    // Setup per-page options from data attribute
    if (this.container.dataset.perPageOptions) {
      this.setupPerPageOptions(this.container.dataset.perPageOptions);
    }

    // Bind events
    this.bindEvents();

    // ✅ Ждём появления карточек
    this.waitForCards();
  }

  waitForCards() {
    const checkCards = () => {
      this.allItems = Array.from(this.grid.querySelectorAll(this.options.cardSelector));
      
      if (this.allItems.length > 0) {
        console.log(`✅ Found ${this.allItems.length} cards for pagination`);
        this.filteredItems = [...this.allItems];
        this.renderImmediate();
        return;
      }
      
      console.log('⏳ Waiting for cards...');
      
      // Используем MutationObserver для отслеживания появления карточек
      const observer = new MutationObserver(() => {
        this.allItems = Array.from(this.grid.querySelectorAll(this.options.cardSelector));
        
        if (this.allItems.length > 0) {
          console.log(`✅ Cards appeared! Found ${this.allItems.length} items`);
          observer.disconnect();
          this.filteredItems = [...this.allItems];
          this.renderImmediate();
        }
      });
      
      observer.observe(this.grid, {
        childList: true,
        subtree: true
      });
      
      // Fallback timeout - если карточки не появились за 5 секунд
      setTimeout(() => {
        observer.disconnect();
        if (this.allItems.length === 0) {
          console.warn('⚠️ No cards found after 5 seconds');
        }
      }, 5000);
    };
    
    checkCards();
  }

  injectAnimationStyles() {
    if (document.getElementById('pagination-animations')) return;

    const style = document.createElement('style');
    style.id = 'pagination-animations';
    style.textContent = `
      .pagination-card-exit {
        animation: cardFadeOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
      }

      .pagination-card-enter {
        animation: cardFadeIn 0.4s cubic-bezier(0, 0, 0.2, 1) forwards;
      }

      @keyframes cardFadeOut {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
      }

      @keyframes cardFadeIn {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .pagination__count {
        transition: opacity 0.3s ease;
      }

      .pagination--animating {
        pointer-events: none;
      }

      .pagination--animating .pagination__count {
        opacity: 0.5;
      }
    `;
    document.head.appendChild(style);
  }

  setupPerPageOptions(optionsString) {
    const options = optionsString.split(',').map(n => parseInt(n.trim()));
    
    if (this.perPageSelect && options.length > 0) {
      this.perPageSelect.innerHTML = options
        .map(value => `<option value="${value}">${value}</option>`)
        .join('');
      
      this.perPageSelect.value = this.options.itemsPerPage;
    }
  }

  bindEvents() {
    // Previous button
    this.prevButton?.addEventListener('click', () => {
      if (this.currentPage > 1 && !this.isAnimating) {
        this.goToPage(this.currentPage - 1);
      }
    });

    // Next button
    this.nextButton?.addEventListener('click', () => {
      const totalPages = this.getTotalPages();
      if (this.currentPage < totalPages && !this.isAnimating) {
        this.goToPage(this.currentPage + 1);
      }
    });

    // Per page selector
    this.perPageSelect?.addEventListener('change', (e) => {
      if (this.isAnimating) return;
      
      this.options.itemsPerPage = parseInt(e.target.value);
      this.currentPage = 1;
      this.render();
    });

    // Page number clicks (delegated)
    this.pagesContainer?.addEventListener('click', (e) => {
      if (this.isAnimating) return;
      
      const pageButton = e.target.closest('[data-page]');
      if (pageButton && !pageButton.classList.contains('pagination__ellipsis')) {
        const page = parseInt(pageButton.dataset.page);
        this.goToPage(page);
      }
    });
  }

  async goToPage(page) {
    const totalPages = this.getTotalPages();
    
    if (page < 1 || page > totalPages || this.isAnimating) return;
    
    this.isAnimating = true;
    this.container.classList.add('pagination--animating');
    
    const oldPage = this.currentPage;
    this.currentPage = page;

    // Animate page transition
    await this.animatePageTransition(oldPage, page);

    this.isAnimating = false;
    this.container.classList.remove('pagination--animating');

    // Smooth scroll to grid top
    this.smoothScrollToGrid();

    // Callback
    if (this.options.onPageChange) {
      this.options.onPageChange(page, this.getPageItems());
    }
  }

  async animatePageTransition(oldPage, newPage) {
    const oldItems = this.getPageItemsForPage(oldPage);
    const newItems = this.getPageItemsForPage(newPage);

    // Phase 1: Fade out old items
    await this.animateOut(oldItems);

    // Phase 2: Update visibility
    this.updateCardVisibility(newItems);

    // Phase 3: Update UI
    this.renderInfo();
    this.renderPageNumbers();
    this.updateButtons();

    // Phase 4: Fade in new items
    await this.animateIn(newItems);
  }

  animateOut(items) {
    return new Promise(resolve => {
      if (items.length === 0) {
        resolve();
        return;
      }

      let completed = 0;

      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('pagination-card-exit');
          
          const handleAnimationEnd = () => {
            item.removeEventListener('animationend', handleAnimationEnd);
            completed++;
            
            if (completed === items.length) {
              resolve();
            }
          };
          
          item.addEventListener('animationend', handleAnimationEnd);
        }, index * this.options.staggerDelay);
      });

      // Fallback timeout
      setTimeout(resolve, this.options.animationDuration + items.length * this.options.staggerDelay);
    });
  }

  animateIn(items) {
    return new Promise(resolve => {
      if (items.length === 0) {
        resolve();
        return;
      }

      let completed = 0;

      items.forEach((item, index) => {
        // Remove exit class
        item.classList.remove('pagination-card-exit');
        
        setTimeout(() => {
          item.classList.add('pagination-card-enter');
          
          const handleAnimationEnd = () => {
            item.removeEventListener('animationend', handleAnimationEnd);
            item.classList.remove('pagination-card-enter');
            completed++;
            
            if (completed === items.length) {
              resolve();
            }
          };
          
          item.addEventListener('animationend', handleAnimationEnd);
        }, index * this.options.staggerDelay);
      });

      // Fallback timeout
      setTimeout(() => {
        items.forEach(item => item.classList.remove('pagination-card-enter'));
        resolve();
      }, this.options.animationDuration + items.length * this.options.staggerDelay + 100);
    });
  }

  updateCardVisibility(visibleItems) {
    this.allItems.forEach(item => {
      item.style.display = 'none';
    });

    visibleItems.forEach(item => {
      item.style.display = '';
    });
  }

  smoothScrollToGrid() {
    const gridTop = this.grid.getBoundingClientRect().top + window.pageYOffset;
    const scrollTo = gridTop - this.options.scrollOffset;

    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
    });
  }

  getTotalPages() {
    return Math.ceil(this.filteredItems.length / this.options.itemsPerPage);
  }

  getPageItems() {
    return this.getPageItemsForPage(this.currentPage);
  }

  getPageItemsForPage(page) {
    const start = (page - 1) * this.options.itemsPerPage;
    const end = start + this.options.itemsPerPage;
    return this.filteredItems.slice(start, end);
  }

  render() {
    if (this.isAnimating) return;
    this.goToPage(this.currentPage);
  }

  renderImmediate() {
    const pageItems = this.getPageItems();
    
    this.allItems.forEach(item => {
      item.style.display = 'none';
    });

    pageItems.forEach(item => {
      item.style.display = '';
    });

    this.renderInfo();
    this.renderPageNumbers();
    this.updateButtons();
  }

  renderInfo() {
    if (!this.infoElement) return;

    const start = (this.currentPage - 1) * this.options.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.options.itemsPerPage, this.filteredItems.length);
    const total = this.filteredItems.length;

    // Animate count change
    this.infoElement.style.opacity = '0';
    
    setTimeout(() => {
      this.infoElement.textContent = `Shown ${start}-${end} of ${total}`;
      this.infoElement.style.opacity = '1';
    }, 150);
  }

  renderPageNumbers() {
    if (!this.pagesContainer) return;

    const totalPages = this.getTotalPages();
    const current = this.currentPage;
    const delta = 2;

    let pages = [];

    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const rangeStart = Math.max(2, current - delta);
      const rangeEnd = Math.min(totalPages - 1, current + delta);

      pages = [1];

      if (rangeStart > 2) {
        pages.push('...');
      }

      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    this.pagesContainer.innerHTML = pages.map(page => {
      if (page === '...') {
        return '<span class="pagination__ellipsis">...</span>';
      }

      const isActive = page === current;
      const activeClass = isActive ? ' pagination__page--active' : '';
      const ariaCurrent = isActive ? ' aria-current="page"' : '';

      return `
        <button 
          class="pagination__page${activeClass}" 
          data-page="${page}"
          ${ariaCurrent}
        >
          ${page}
        </button>
      `;
    }).join('');
  }

  updateButtons() {
    const totalPages = this.getTotalPages();

    if (this.prevButton) {
      if (this.currentPage <= 1) {
        this.prevButton.disabled = true;
        this.prevButton.classList.add('pagination__arrow--disabled');
      } else {
        this.prevButton.disabled = false;
        this.prevButton.classList.remove('pagination__arrow--disabled');
      }
    }

    if (this.nextButton) {
      if (this.currentPage >= totalPages) {
        this.nextButton.disabled = true;
        this.nextButton.classList.add('pagination__arrow--disabled');
      } else {
        this.nextButton.disabled = false;
        this.nextButton.classList.remove('pagination__arrow--disabled');
      }
    }
  }

  // Public API for filtering
  async filter(filterFn) {
    if (this.isAnimating) return;
    
    this.filteredItems = this.allItems.filter(filterFn);
    this.currentPage = 1;
    await this.render();
  }

  // Public API for updating items
  updateItems(newItems) {
    this.allItems.forEach(item => item.remove());

    newItems.forEach(itemData => {
      const card = this.createCardFromData(itemData);
      this.grid.appendChild(card);
    });

    this.allItems = Array.from(this.grid.querySelectorAll(this.options.cardSelector));
    this.filteredItems = [...this.allItems];
    this.currentPage = 1;
    this.renderImmediate();
  }

  createCardFromData(data) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="card__content">
        <h3>${data.title || 'Untitled'}</h3>
        <p>${data.description || ''}</p>
      </div>
    `;
    return div;
  }

  reset() {
    this.filteredItems = [...this.allItems];
    this.currentPage = 1;
    this.renderImmediate();
  }
}

// Auto-initialize all pagination instances
function initPaginations() {
  const paginationElements = document.querySelectorAll('[data-pagination]');
  const instances = [];

  paginationElements.forEach(element => {
    const instance = new ClientPagination(element);
    instances.push(instance);
    
    // Store instance reference for external access
    element.__pagination = instance;
  });

  // Store globally for easy access
  window.paginationInstances = instances;

  return instances;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPaginations);
} else {
  initPaginations();
}

// Export for use in other modules
export { ClientPagination, initPaginations };