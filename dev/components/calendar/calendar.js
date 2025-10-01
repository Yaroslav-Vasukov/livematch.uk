// dev/components/calendar/calendar.js
"use strict";

export default function initCalendar() {
  const calendarElement = document.querySelector('[data-module="calendar"]');
  const calendarInput = document.getElementById('datepicker');
  const eventsContainer = document.getElementById('calendarEvents');
  const infoContainer = document.getElementById('calendarInfo');

  if (!calendarInput || !eventsContainer || !infoContainer || !calendarElement) {
    console.warn('[Calendar] Required elements not found');
    return;
  }

  // Пробуем получить данные из data-атрибута или window
  let eventsData = null;
  
  // Способ 1: из data-атрибута
  if (calendarElement.dataset.events) {
    try {
      eventsData = JSON.parse(calendarElement.dataset.events);
      console.log('[Calendar] Data loaded from data-attribute:', eventsData.length, 'events');
    } catch (e) {
      console.error('[Calendar] Failed to parse data-events:', e);
    }
  }
  
  // Способ 2: из window.CALENDAR_EVENTS
  if (!eventsData && window.CALENDAR_EVENTS) {
    eventsData = window.CALENDAR_EVENTS;
    console.log('[Calendar] Data loaded from window:', eventsData.length, 'events');
  }
  
  // Способ 3: ждем загрузки через window
  if (!eventsData) {
    console.log('[Calendar] Waiting for data...');
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkData = setInterval(() => {
      attempts++;
      
      if (window.CALENDAR_EVENTS && window.CALENDAR_EVENTS.length > 0) {
        clearInterval(checkData);
        console.log('[Calendar] Data loaded (delayed):', window.CALENDAR_EVENTS.length, 'events');
        initializeCalendar(window.CALENDAR_EVENTS);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkData);
        console.error('[Calendar] No events data found after waiting');
        showError('Failed to load calendar data. Please check console.');
      }
    }, 100);
    return;
  }
  
  // Если данные есть сразу - инициализируем
  if (eventsData && eventsData.length > 0) {
    initializeCalendar(eventsData);
  } else {
    console.error('[Calendar] No events data available');
    showError('No calendar data available');
  }
}

function initializeCalendar(eventsData) {
  const calendarInput = document.getElementById('datepicker');
  const eventsContainer = document.getElementById('calendarEvents');
  const infoContainer = document.getElementById('calendarInfo');

  // Извлекаем уникальные даты с событиями (только дата без времени)
  const eventDates = [...new Set(eventsData.map(event => {
    const date = new Date(event.published_at);
    return formatDateToISO(date);
  }))];

  // Динамически загружаем Flatpickr
  loadFlatpickr().then(() => {
    initializeFlatpickr();
  }).catch(err => {
    console.error('[Calendar] Failed to load Flatpickr:', err);
  });

  function loadFlatpickr() {
    return new Promise((resolve, reject) => {
      if (window.flatpickr) {
        resolve();
        return;
      }

      if (!document.querySelector('link[href*="flatpickr"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
        document.head.appendChild(link);
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Flatpickr'));
      document.head.appendChild(script);
    });
  }

  function initializeFlatpickr() {
    const picker = window.flatpickr(calendarInput, {
      dateFormat: "Y-m-d",
      defaultDate: "today",
      onChange: function(selectedDates) {
        if (selectedDates.length > 0) {
          showEventsForDate(selectedDates[0]);
        }
      },
      onDayCreate: function(dObj, dStr, fp, dayElem) {
        const date = dayElem.dateObj;
        const dateString = formatDateToISO(date);
        
        if (eventDates.includes(dateString)) {
          dayElem.innerHTML += '<span class="flatpickr-day-event-dot"></span>';
        }
      },
      onReady: function(selectedDates, dateStr, instance) {
        // Показываем события сегодняшнего дня при загрузке
        const today = new Date();
        showEventsForDate(today);
      }
    });

    console.log('[Calendar] Initialized successfully');
  }

  function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function showEventsForDate(date) {
    const dateString = formatDateToISO(date);
    const events = eventsData.filter(event => {
      const eventDate = new Date(event.published_at);
      return formatDateToISO(eventDate) === dateString;
    });
    
    if (events.length === 0) {
      eventsContainer.innerHTML = createEmptyState('No matches on this date');
      infoContainer.innerHTML = '<span class="calendar__info-text">No matches found</span>';
      return;
    }

    infoContainer.innerHTML = `
      <span class="calendar__info-text">
        Found matches: <strong>${events.length}</strong>
      </span>
    `;

    eventsContainer.innerHTML = events.map(event => createEventCard(event)).join('');
  }

  function createEmptyState(message) {
    return `
      <div class="calendar-events__empty">
        <svg class="calendar-events__empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" 
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="calendar-events__empty-text">${message}</p>
      </div>
    `;
  }

  function createEventCard(event) {
    const time = formatTime(event.published_at);
    const date = new Date(event.published_at);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + time;
    const status = event.status || 'scheduled';
    const hasScore = event.score && (status === 'finished' || status === 'live');
    
    return `
      <article class="card-match" 
               data-module="card-match" 
               data-match-id="${event.id}"
               data-match-time="${event.published_at}"
               data-status="${status}">
        
        <!-- Header -->
        <div class="card-match__header">
          <a href="${event.league.href}" class="card-match__league">
            <img src="${event.league.logo}" alt="${event.league.name}" class="card-match__league-logo">
            <span class="card-match__league-name">${event.league.name}</span>
          </a>
          <time class="card-match__date" datetime="${event.published_at}">
            ${formattedDate}
          </time>
        </div>

        <!-- Teams -->
        <div class="card-match__teams">
          
          <!-- Team 1 -->
          <a href="${event.team1.href}" class="card-match__team card-match__team--home">
            <div class="card-match__team-logo">
              <img src="${event.team1.logo}" alt="${event.team1.name}" loading="lazy">
            </div>
            <h3 class="card-match__team-name">${event.team1.name}</h3>
          </a>

          <!-- Middle - Score/Time -->
          <div class="card-match__middle">
            ${status === 'live' ? `
              <!-- Live -->
              <div class="card-match__status card-match__status--live">
                <span class="card-match__status-dot"></span>
                Live
              </div>
              <div class="card-match__score">
                <span class="card-match__score-number">${event.score.t1}</span>
                <span class="card-match__score-separator">:</span>
                <span class="card-match__score-number">${event.score.t2}</span>
              </div>
              ${event.minute ? `<span class="card-match__minute">${event.minute}'</span>` : ''}
            ` : status === 'finished' ? `
              <!-- Finished -->
              <div class="card-match__status">Finished</div>
              <div class="card-match__score">
                <span class="card-match__score-number">${event.score.t1}</span>
                <span class="card-match__score-separator">:</span>
                <span class="card-match__score-number">${event.score.t2}</span>
              </div>
            ` : `
              <!-- Scheduled -->
              <div class="card-match__time">
                <span class="material-symbols-outlined">schedule</span>
                ${time}
              </div>
            `}
          </div>

          <!-- Team 2 -->
          <a href="${event.team2.href}" class="card-match__team card-match__team--away">
            <h3 class="card-match__team-name">${event.team2.name}</h3>
            <div class="card-match__team-logo">
              <img src="${event.team2.logo}" alt="${event.team2.name}" loading="lazy">
            </div>
          </a>

        </div>

        <!-- Footer -->
        <div class="card-match__footer">
          <a href="${event.href}" class="card-match__link">
            ${status === 'live' ? `
              <span class="material-symbols-outlined">play_circle</span>
              Watch Live
            ` : status === 'finished' ? `
              <span class="material-symbols-outlined">info</span>
              Match Details
            ` : `
              <span class="material-symbols-outlined">event</span>
              View Match
            `}
          </a>
        </div>

      </article>
    `;
  }
  
  function showError(message) {
    const eventsContainer = document.getElementById('calendarEvents');
    if (eventsContainer) {
      eventsContainer.innerHTML = `
        <div class="calendar-events__empty">
          <svg class="calendar-events__empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" style="color: #ef4444;">
            <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" 
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="calendar-events__empty-text" style="color: #ef4444;">${message}</p>
        </div>
      `;
    }
  }
}