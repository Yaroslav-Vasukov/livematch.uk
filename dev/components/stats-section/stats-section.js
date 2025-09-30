// stats-counter.js

/**
 * Анимация счетчика от 0 до целевого значения
 * @param {HTMLElement} element - Элемент с data-count атрибутом
 */
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current += increment;
    
    if (step >= steps) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, duration / steps);
}

/**
 * Инициализация модуля статистики
 * Вызывается автоматически через систему ленивой загрузки
 */
export default function initStatsSection() {
  const statsSection = document.querySelector('[data-module="stats-section"]');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(counter => {
          if (counter.textContent === '0') {
            animateCounter(counter);
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

// Экспорт функции для использования в других модулях
export { animateCounter };