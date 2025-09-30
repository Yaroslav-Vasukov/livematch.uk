// dev/components/header/header.js

class Header {
  constructor(element) {
    this.element = element;
    this.dropdownButtons = element.querySelectorAll('.main-nav__link--dropdown');
    this.burger = element.querySelector('.header__burger');
    this.mainNav = element.querySelector('.header__main-nav');
    this.secondaryNav = element.querySelector('.secondary-nav__list');
    this.secondaryContainer = element.querySelector('.secondary-nav__container');
    this.activeDropdown = null;
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.initSecondaryNavScroll();
  }

  bindEvents() {
    // Бургер-меню
    if (this.burger) {
      this.burger.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Открытие/закрытие dropdown по клику на кнопку
    this.dropdownButtons.forEach(button => {
      button.addEventListener('click', (e) => this.toggleDropdown(e));
    });

    // Закрытие dropdown при клике вне его
    document.addEventListener('click', (e) => this.handleOutsideClick(e));

    // Закрытие dropdown при нажатии Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
        if (this.isMenuOpen) {
          this.closeMobileMenu();
        }
      }
    });

    // Предотвращение закрытия при клике внутри dropdown
    const dropdowns = this.element.querySelectorAll('.main-nav__dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });

    // Закрытие мобильного меню при изменении размера экрана
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.mainNav.classList.add('is-open');
    this.burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mainNav.classList.remove('is-open');
    this.burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    this.closeAllDropdowns();
  }

  toggleDropdown(e) {
    e.stopPropagation();
    
    const button = e.currentTarget;
    const item = button.closest('.main-nav__item');
    const dropdown = item.querySelector('.main-nav__dropdown');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Если открываем другой dropdown, закрываем предыдущий
    if (this.activeDropdown && this.activeDropdown !== dropdown) {
      this.closeDropdown(this.activeDropdown);
    }

    if (isExpanded) {
      this.closeDropdown(dropdown);
    } else {
      this.openDropdown(dropdown);
    }
  }

  openDropdown(dropdown) {
    const button = dropdown.previousElementSibling;
    
    dropdown.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    this.activeDropdown = dropdown;

    requestAnimationFrame(() => {
      dropdown.style.opacity = '1';
      dropdown.style.transform = 'translateY(0)';
    });
  }

  closeDropdown(dropdown) {
    const button = dropdown.previousElementSibling;
    
    dropdown.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
    }
  }

  closeAllDropdowns() {
    const allDropdowns = this.element.querySelectorAll('.main-nav__dropdown');
    allDropdowns.forEach(dropdown => {
      if (!dropdown.hidden) {
        this.closeDropdown(dropdown);
      }
    });
  }

  initSecondaryNavScroll() {
    if (!this.secondaryNav || !this.secondaryContainer) return;

    const updateScrollIndicators = () => {
      const { scrollLeft, scrollWidth, clientWidth } = this.secondaryNav;
      
      // Check if can scroll left
      if (scrollLeft > 10) {
        this.secondaryContainer.classList.add('has-scroll-left');
      } else {
        this.secondaryContainer.classList.remove('has-scroll-left');
      }

      // Check if can scroll right
      if (scrollLeft < scrollWidth - clientWidth - 10) {
        this.secondaryContainer.classList.add('has-scroll-right');
      } else {
        this.secondaryContainer.classList.remove('has-scroll-right');
      }
    };

    // Initial check
    updateScrollIndicators();

    // Update on scroll
    this.secondaryNav.addEventListener('scroll', updateScrollIndicators);

    // Update on resize
    window.addEventListener('resize', updateScrollIndicators);

    // Mouse wheel horizontal scroll
    this.secondaryNav.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        this.secondaryNav.scrollLeft += e.deltaY;
      }
    });
  }

  handleOutsideClick(e) {
    const isClickInsideNav = e.target.closest('.main-nav');
    const isClickOnBurger = e.target.closest('.header__burger');
    
    // Закрываем dropdown если клик вне навигации
    if (!isClickInsideNav && this.activeDropdown) {
      this.closeAllDropdowns();
    }

    // Закрываем мобильное меню если клик вне меню и не на бургер
    if (this.isMenuOpen && !isClickInsideNav && !isClickOnBurger) {
      this.closeMobileMenu();
    }
  }
}

// Default export для динамического импорта
export default function() {
  const headers = document.querySelectorAll('[data-module="header"]');
  headers.forEach(header => new Header(header));
}

// Экспорт класса для использования в других модулях
export { Header };