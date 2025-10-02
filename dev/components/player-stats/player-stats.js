// player-stats.js

export default function initPlayerStats() {
  const statsContainers = document.querySelectorAll('[data-module="player-stats"]');
  
  if (!statsContainers.length) return;

  const animateCount = (element, start, end, duration) => {
    const isPercentage = String(end).includes('%');
    const numericEnd = parseFloat(end);
    
    if (isNaN(numericEnd)) {
      element.textContent = end;
      return;
    }

    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function для плавной анимации
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (numericEnd - start) * easeOutQuart;
      
      if (isPercentage) {
        element.textContent = Math.round(current) + '%';
      } else {
        element.textContent = Math.round(current);
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = end; // Финальное значение
      }
    };
    
    requestAnimationFrame(update);
  };

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const valueElements = entry.target.querySelectorAll('[data-count]');
        
        valueElements.forEach(el => {
          const targetValue = el.getAttribute('data-count');
          const duration = 2000; // 2 секунды анимации
          
          // Запускаем анимацию с небольшой задержкой для каждого элемента
          const delay = Array.from(valueElements).indexOf(el) * 100;
          
          setTimeout(() => {
            animateCount(el, 0, targetValue, duration);
          }, delay);
        });

        // Отключаем наблюдение после первой анимации
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Наблюдаем за каждым контейнером статистики
  statsContainers.forEach(container => {
    observer.observe(container);
  });

  console.log('✅ Player stats initialized');
}