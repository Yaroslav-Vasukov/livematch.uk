class CardMatch {
  constructor(element) {
    this.element = element;
    // Можно добавить другую логику если понадобится
    // Например, клики, анимации и т.д.
  }
}

// Default export для динамического импорта
export default function() {
  const cards = document.querySelectorAll('[data-module="card-match"]');
  
  cards.forEach(card => {
    new CardMatch(card);
  });
}

// Export класса
export { CardMatch };