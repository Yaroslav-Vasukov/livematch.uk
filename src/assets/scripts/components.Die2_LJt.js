class S{constructor(t){this.element=t,this.dropdownButtons=t.querySelectorAll(".main-nav__link--dropdown"),this.burger=t.querySelector(".header__burger"),this.mainNav=t.querySelector(".header__main-nav"),this.secondaryNav=t.querySelector(".secondary-nav__list"),this.secondaryContainer=t.querySelector(".secondary-nav__container"),this.activeDropdown=null,this.isMenuOpen=!1,this.init()}init(){this.bindEvents(),this.initSecondaryNavScroll()}bindEvents(){this.burger&&this.burger.addEventListener("click",()=>this.toggleMobileMenu()),this.dropdownButtons.forEach(e=>{e.addEventListener("click",n=>this.toggleDropdown(n))}),document.addEventListener("click",e=>this.handleOutsideClick(e)),document.addEventListener("keydown",e=>{e.key==="Escape"&&(this.closeAllDropdowns(),this.isMenuOpen&&this.closeMobileMenu())}),this.element.querySelectorAll(".main-nav__dropdown").forEach(e=>{e.addEventListener("click",n=>{n.stopPropagation()})}),window.addEventListener("resize",()=>{window.innerWidth>768&&this.isMenuOpen&&this.closeMobileMenu()})}toggleMobileMenu(){this.isMenuOpen?this.closeMobileMenu():this.openMobileMenu()}openMobileMenu(){this.isMenuOpen=!0,this.mainNav.classList.add("is-open"),this.burger.setAttribute("aria-expanded","true"),document.body.style.overflow="hidden"}closeMobileMenu(){this.isMenuOpen=!1,this.mainNav.classList.remove("is-open"),this.burger.setAttribute("aria-expanded","false"),document.body.style.overflow="",this.closeAllDropdowns()}toggleDropdown(t){t.stopPropagation();const e=t.currentTarget,s=e.closest(".main-nav__item").querySelector(".main-nav__dropdown"),i=e.getAttribute("aria-expanded")==="true";this.activeDropdown&&this.activeDropdown!==s&&this.closeDropdown(this.activeDropdown),i?this.closeDropdown(s):this.openDropdown(s)}openDropdown(t){const e=t.previousElementSibling;t.hidden=!1,e.setAttribute("aria-expanded","true"),this.activeDropdown=t,requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="translateY(0)"})}closeDropdown(t){const e=t.previousElementSibling;t.hidden=!0,e.setAttribute("aria-expanded","false"),this.activeDropdown===t&&(this.activeDropdown=null)}closeAllDropdowns(){this.element.querySelectorAll(".main-nav__dropdown").forEach(e=>{e.hidden||this.closeDropdown(e)})}initSecondaryNavScroll(){if(!this.secondaryNav||!this.secondaryContainer)return;const t=()=>{const{scrollLeft:e,scrollWidth:n,clientWidth:s}=this.secondaryNav;e>10?this.secondaryContainer.classList.add("has-scroll-left"):this.secondaryContainer.classList.remove("has-scroll-left"),e<n-s-10?this.secondaryContainer.classList.add("has-scroll-right"):this.secondaryContainer.classList.remove("has-scroll-right")};t(),this.secondaryNav.addEventListener("scroll",t),window.addEventListener("resize",t),this.secondaryNav.addEventListener("wheel",e=>{e.deltaY!==0&&(e.preventDefault(),this.secondaryNav.scrollLeft+=e.deltaY)})}handleOutsideClick(t){const e=t.target.closest(".main-nav"),n=t.target.closest(".header__burger");!e&&this.activeDropdown&&this.closeAllDropdowns(),this.isMenuOpen&&!e&&!n&&this.closeMobileMenu()}}function A(){document.querySelectorAll('[data-module="header"]').forEach(t=>new S(t))}const x=Object.freeze(Object.defineProperty({__proto__:null,Header:S,default:A},Symbol.toStringTag,{value:"Module"}));class C{constructor(t){this.element=t}}function L(){document.querySelectorAll('[data-module="card-match"]').forEach(t=>{})}const $=Object.freeze(Object.defineProperty({__proto__:null,CardMatch:C,default:L},Symbol.toStringTag,{value:"Module"}));document.querySelectorAll(".swiper[data-swiper]").forEach(function(d){var t={};try{t=JSON.parse(d.getAttribute("data-swiper")||"{}")}catch{t={}}var e=d.querySelector("[data-swiper-prev]"),n=d.querySelector("[data-swiper-next]"),s=d.querySelector("[data-swiper-pagination]");(e||n)&&(t.navigation={prevEl:e||void 0,nextEl:n||void 0}),s&&(t.pagination={el:s,clickable:!0});var i={slidesPerView:1,spaceBetween:16};new Swiper(d,Object.assign(i,t))});const q=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));function v(d,t){return Array.from(d.querySelectorAll(t))}function y(d="id"){return`${d}-${Math.random().toString(36).slice(2,9)}`}function w(d=document){v(d,"[data-tabs]").forEach(e=>{const n=v(e,'[role="tab"], .tabs__tab'),s=v(e,'[role="tabpanel"], .tabs__panel');if(!n.length||!s.length)return;n.forEach((r,a)=>{if(r.id||(r.id=y("tab")),r.setAttribute("role","tab"),r.setAttribute("aria-selected","false"),r.tabIndex=-1,!r.getAttribute("aria-controls")){const c=s[a]||s[0];c&&(c.id||(c.id=y("panel")),r.setAttribute("aria-controls",c.id))}}),s.forEach((r,a)=>{r.id||(r.id=y("panel")),r.setAttribute("role","tabpanel");const o=n[a]||n[0];o&&r.setAttribute("aria-labelledby",o.id),r.hidden=!0,r.removeAttribute("hidden"),r.hidden=!0,r.classList.remove("is-active")});const i=r=>{if(!r)return;n.forEach(h=>{h.classList.remove("is-active"),h.setAttribute("aria-selected","false"),h.tabIndex=-1}),s.forEach(h=>{h.classList.remove("is-active"),h.hidden=!0,h.setAttribute("hidden","")}),r.classList.add("is-active"),r.setAttribute("aria-selected","true"),r.tabIndex=0;const a=r.getAttribute("aria-controls"),o=a?e.querySelector("#"+a):null;o&&(o.hidden=!1,o.removeAttribute("hidden"),o.classList.add("is-active"));const c=r.dataset.tab||r.id;if(e.dataset.active=c,e.dataset.tabsSync==="hash"&&e.id){const h=new URLSearchParams(window.location.hash.slice(1));h.set(e.id,c),window.history.replaceState(null,"","#"+h.toString())}e.dispatchEvent(new CustomEvent("tabs:change",{detail:{value:c,tab:r,panel:o},bubbles:!0}))},u=(()=>{if(e.dataset.tabsSync==="hash"&&e.id){const o=new URLSearchParams(window.location.hash.slice(1)).get(e.id);if(o){const c=n.find(h=>(h.dataset.tab||h.id)===o);if(c)return c}}if(e.dataset.active){const a=n.find(o=>(o.dataset.tab||o.id)===e.dataset.active);if(a)return a}const r=e.querySelector(".tabs__tab.is-active");return r||n[0]})();i(u);const g=u?.getAttribute("aria-controls"),m=g?e.querySelector("#"+g):null;m&&(m.hidden=!1,m.removeAttribute("hidden"),m.classList.add("is-active")),n.forEach(r=>{r.addEventListener("click",()=>i(r)),r.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),i(r))})}),(e.querySelector('[role="tablist"]')||e).addEventListener("keydown",r=>{const a=n,o=a.findIndex(h=>h.getAttribute("aria-selected")==="true");if(o<0)return;let c=o;(r.key==="ArrowRight"||r.key==="ArrowDown")&&(c=(o+1)%a.length),(r.key==="ArrowLeft"||r.key==="ArrowUp")&&(c=(o-1+a.length)%a.length),r.key==="Home"&&(c=0),r.key==="End"&&(c=a.length-1),c!==o&&(r.preventDefault(),a[c].focus(),i(a[c]))}),e.dataset.tabsSync==="hash"&&e.id&&window.addEventListener("hashchange",()=>{const a=new URLSearchParams(window.location.hash.slice(1)).get(e.id);if(!a)return;const o=n.find(c=>(c.dataset.tab||c.id)===a);o&&o!==e.querySelector(".tabs__tab.is-active")&&i(o)}),e.switchTo=r=>{const a=n.find(o=>(o.dataset.tab||o.id)===r);a&&i(a)}})}function M(){w(document)}const N=Object.freeze(Object.defineProperty({__proto__:null,default:M,initStandingsTabs:w},Symbol.toStringTag,{value:"Module"}));function D(){const d=document.querySelectorAll("[data-table]");d.length&&d.forEach(t=>{const e=t.getAttribute("data-table")||"default",n=t.querySelector(".table__wrap");if(!n)return;e==="default"&&n.addEventListener("wheel",l=>{Math.abs(l.deltaY)>Math.abs(l.deltaX)&&n.scrollWidth>n.clientWidth&&(n.scrollLeft+=l.deltaY)},{passive:!0}),t.querySelectorAll(".form").forEach(l=>{l.setAttribute("role","list"),l.querySelectorAll(".form__item").forEach(u=>{const g={W:"Win",D:"Draw",L:"Lose"},m=(u.textContent||"").trim();u.setAttribute("aria-label",g[m]||m)})});const i=t.querySelector(".table__head");i&&(i.style.position="sticky",i.style.top="0",i.style.zIndex="2",n.addEventListener("scroll",()=>{const l=n.scrollLeft>0;i.style.boxShadow=l?"inset 6px 0 8px -6px rgba(0,0,0,0.25)":"none"}))})}const F=Object.freeze(Object.defineProperty({__proto__:null,default:D},Symbol.toStringTag,{value:"Module"}));function E(d){const t=parseInt(d.getAttribute("data-count")),e=2e3,n=60,s=t/n;let i=0,l=0;const u=setInterval(()=>{l++,i+=s,l>=n?(d.textContent=t,clearInterval(u)):d.textContent=Math.floor(i)},e/n)}function T(){const d=document.querySelector('[data-module="stats-section"]');if(!d)return;const t=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&(n.target.querySelectorAll("[data-count]").forEach(i=>{i.textContent==="0"&&E(i)}),t.unobserve(n.target))})},{threshold:.3});t.observe(d)}const B=Object.freeze(Object.defineProperty({__proto__:null,animateCounter:E,default:T},Symbol.toStringTag,{value:"Module"}));class P{constructor(t,e={}){this.container=t,this.options={itemsPerPage:parseInt(t.dataset.perPage)||12,cardSelector:t.dataset.cardSelector||e.cardSelector||".card",gridSelector:t.dataset.gridSelector||e.gridSelector||".archive__grid",animationDuration:e.animationDuration||400,staggerDelay:e.staggerDelay||30,scrollOffset:parseInt(t.dataset.scrollOffset)||e.scrollOffset||164,onPageChange:e.onPageChange||null,...e},this.grid=document.querySelector(this.options.gridSelector),this.infoElement=t.querySelector("[data-pagination-info]"),this.pagesContainer=t.querySelector("[data-pagination-pages]"),this.prevButton=t.querySelector("[data-pagination-prev]"),this.nextButton=t.querySelector("[data-pagination-next]"),this.perPageSelect=t.querySelector("[data-pagination-per-page]"),this.currentPage=1,this.allItems=[],this.filteredItems=[],this.isAnimating=!1,this.init()}init(){if(!this.grid){console.warn("Pagination: grid not found");return}this.injectAnimationStyles(),this.container.dataset.perPageOptions&&this.setupPerPageOptions(this.container.dataset.perPageOptions),this.bindEvents(),this.waitForCards()}waitForCards(){(()=>{if(this.allItems=Array.from(this.grid.querySelectorAll(this.options.cardSelector)),this.allItems.length>0){console.log(`✅ Found ${this.allItems.length} cards for pagination`),this.filteredItems=[...this.allItems],this.renderImmediate();return}console.log("⏳ Waiting for cards...");const e=new MutationObserver(()=>{this.allItems=Array.from(this.grid.querySelectorAll(this.options.cardSelector)),this.allItems.length>0&&(console.log(`✅ Cards appeared! Found ${this.allItems.length} items`),e.disconnect(),this.filteredItems=[...this.allItems],this.renderImmediate())});e.observe(this.grid,{childList:!0,subtree:!0}),setTimeout(()=>{e.disconnect(),this.allItems.length===0&&console.warn("⚠️ No cards found after 5 seconds")},5e3)})()}injectAnimationStyles(){if(document.getElementById("pagination-animations"))return;const t=document.createElement("style");t.id="pagination-animations",t.textContent=`
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
    `,document.head.appendChild(t)}setupPerPageOptions(t){const e=t.split(",").map(n=>parseInt(n.trim()));this.perPageSelect&&e.length>0&&(this.perPageSelect.innerHTML=e.map(n=>`<option value="${n}">${n}</option>`).join(""),this.perPageSelect.value=this.options.itemsPerPage)}bindEvents(){this.prevButton?.addEventListener("click",()=>{this.currentPage>1&&!this.isAnimating&&this.goToPage(this.currentPage-1)}),this.nextButton?.addEventListener("click",()=>{const t=this.getTotalPages();this.currentPage<t&&!this.isAnimating&&this.goToPage(this.currentPage+1)}),this.perPageSelect?.addEventListener("change",t=>{this.isAnimating||(this.options.itemsPerPage=parseInt(t.target.value),this.currentPage=1,this.render())}),this.pagesContainer?.addEventListener("click",t=>{if(this.isAnimating)return;const e=t.target.closest("[data-page]");if(e&&!e.classList.contains("pagination__ellipsis")){const n=parseInt(e.dataset.page);this.goToPage(n)}})}async goToPage(t){const e=this.getTotalPages();if(t<1||t>e||this.isAnimating)return;this.isAnimating=!0,this.container.classList.add("pagination--animating");const n=this.currentPage;this.currentPage=t,await this.animatePageTransition(n,t),this.isAnimating=!1,this.container.classList.remove("pagination--animating"),this.smoothScrollToGrid(),this.options.onPageChange&&this.options.onPageChange(t,this.getPageItems())}async animatePageTransition(t,e){const n=this.getPageItemsForPage(t),s=this.getPageItemsForPage(e);await this.animateOut(n),this.updateCardVisibility(s),this.renderInfo(),this.renderPageNumbers(),this.updateButtons(),await this.animateIn(s)}animateOut(t){return new Promise(e=>{if(t.length===0){e();return}let n=0;t.forEach((s,i)=>{setTimeout(()=>{s.classList.add("pagination-card-exit");const l=()=>{s.removeEventListener("animationend",l),n++,n===t.length&&e()};s.addEventListener("animationend",l)},i*this.options.staggerDelay)}),setTimeout(e,this.options.animationDuration+t.length*this.options.staggerDelay)})}animateIn(t){return new Promise(e=>{if(t.length===0){e();return}let n=0;t.forEach((s,i)=>{s.classList.remove("pagination-card-exit"),setTimeout(()=>{s.classList.add("pagination-card-enter");const l=()=>{s.removeEventListener("animationend",l),s.classList.remove("pagination-card-enter"),n++,n===t.length&&e()};s.addEventListener("animationend",l)},i*this.options.staggerDelay)}),setTimeout(()=>{t.forEach(s=>s.classList.remove("pagination-card-enter")),e()},this.options.animationDuration+t.length*this.options.staggerDelay+100)})}updateCardVisibility(t){this.allItems.forEach(e=>{e.style.display="none"}),t.forEach(e=>{e.style.display=""})}smoothScrollToGrid(){const e=this.grid.getBoundingClientRect().top+window.pageYOffset-this.options.scrollOffset;window.scrollTo({top:e,behavior:"smooth"})}getTotalPages(){return Math.ceil(this.filteredItems.length/this.options.itemsPerPage)}getPageItems(){return this.getPageItemsForPage(this.currentPage)}getPageItemsForPage(t){const e=(t-1)*this.options.itemsPerPage,n=e+this.options.itemsPerPage;return this.filteredItems.slice(e,n)}render(){this.isAnimating||this.goToPage(this.currentPage)}renderImmediate(){const t=this.getPageItems();this.allItems.forEach(e=>{e.style.display="none"}),t.forEach(e=>{e.style.display=""}),this.renderInfo(),this.renderPageNumbers(),this.updateButtons()}renderInfo(){if(!this.infoElement)return;const t=(this.currentPage-1)*this.options.itemsPerPage+1,e=Math.min(this.currentPage*this.options.itemsPerPage,this.filteredItems.length),n=this.filteredItems.length;this.infoElement.style.opacity="0",setTimeout(()=>{this.infoElement.textContent=`Shown ${t}-${e} of ${n}`,this.infoElement.style.opacity="1"},150)}renderPageNumbers(){if(!this.pagesContainer)return;const t=this.getTotalPages(),e=this.currentPage,n=2;let s=[];if(t<=7)s=Array.from({length:t},(i,l)=>l+1);else{const i=Math.max(2,e-n),l=Math.min(t-1,e+n);s=[1],i>2&&s.push("...");for(let u=i;u<=l;u++)s.push(u);l<t-1&&s.push("..."),s.push(t)}this.pagesContainer.innerHTML=s.map(i=>{if(i==="...")return'<span class="pagination__ellipsis">...</span>';const l=i===e;return`
        <button 
          class="pagination__page${l?" pagination__page--active":""}" 
          data-page="${i}"
          ${l?' aria-current="page"':""}
        >
          ${i}
        </button>
      `}).join("")}updateButtons(){const t=this.getTotalPages();this.prevButton&&(this.currentPage<=1?(this.prevButton.disabled=!0,this.prevButton.classList.add("pagination__arrow--disabled")):(this.prevButton.disabled=!1,this.prevButton.classList.remove("pagination__arrow--disabled"))),this.nextButton&&(this.currentPage>=t?(this.nextButton.disabled=!0,this.nextButton.classList.add("pagination__arrow--disabled")):(this.nextButton.disabled=!1,this.nextButton.classList.remove("pagination__arrow--disabled")))}async filter(t){this.isAnimating||(this.filteredItems=this.allItems.filter(t),this.currentPage=1,await this.render())}updateItems(t){this.allItems.forEach(e=>e.remove()),t.forEach(e=>{const n=this.createCardFromData(e);this.grid.appendChild(n)}),this.allItems=Array.from(this.grid.querySelectorAll(this.options.cardSelector)),this.filteredItems=[...this.allItems],this.currentPage=1,this.renderImmediate()}createCardFromData(t){const e=document.createElement("div");return e.className="card",e.innerHTML=`
      <div class="card__content">
        <h3>${t.title||"Untitled"}</h3>
        <p>${t.description||""}</p>
      </div>
    `,e}reset(){this.filteredItems=[...this.allItems],this.currentPage=1,this.renderImmediate()}}function _(){const d=document.querySelectorAll("[data-pagination]"),t=[];return d.forEach(e=>{const n=new P(e);t.push(n),e.__pagination=n}),window.paginationInstances=t,t}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();const j=Object.freeze(Object.defineProperty({__proto__:null,ClientPagination:P,initPaginations:_},Symbol.toStringTag,{value:"Module"}));function k(){const d=document.querySelector('[data-module="calendar"]'),t=document.getElementById("datepicker"),e=document.getElementById("calendarEvents"),n=document.getElementById("calendarInfo");if(!t||!e||!n||!d){console.warn("[Calendar] Required elements not found");return}let s=null;if(d.dataset.events)try{s=JSON.parse(d.dataset.events),console.log("[Calendar] Data loaded from data-attribute:",s.length,"events")}catch(i){console.error("[Calendar] Failed to parse data-events:",i)}if(!s&&window.CALENDAR_EVENTS&&(s=window.CALENDAR_EVENTS,console.log("[Calendar] Data loaded from window:",s.length,"events")),!s){console.log("[Calendar] Waiting for data...");let i=0;const l=10,u=setInterval(()=>{i++,window.CALENDAR_EVENTS&&window.CALENDAR_EVENTS.length>0?(clearInterval(u),console.log("[Calendar] Data loaded (delayed):",window.CALENDAR_EVENTS.length,"events"),b(window.CALENDAR_EVENTS)):i>=l&&(clearInterval(u),console.error("[Calendar] No events data found after waiting"),showError("Failed to load calendar data. Please check console."))},100);return}s&&s.length>0?b(s):(console.error("[Calendar] No events data available"),showError("No calendar data available"))}function b(d){const t=document.getElementById("datepicker"),e=document.getElementById("calendarEvents"),n=document.getElementById("calendarInfo"),s=[...new Set(d.map(a=>{const o=new Date(a.published_at);return u(o)}))];i().then(()=>{l()}).catch(a=>{console.error("[Calendar] Failed to load Flatpickr:",a)});function i(){return new Promise((a,o)=>{if(window.flatpickr){a();return}if(!document.querySelector('link[href*="flatpickr"]')){const h=document.createElement("link");h.rel="stylesheet",h.href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css",document.head.appendChild(h)}const c=document.createElement("script");c.src="https://cdn.jsdelivr.net/npm/flatpickr",c.onload=()=>a(),c.onerror=()=>o(new Error("Failed to load Flatpickr")),document.head.appendChild(c)})}function l(){window.flatpickr(t,{dateFormat:"Y-m-d",defaultDate:"today",onChange:function(a){a.length>0&&m(a[0])},onDayCreate:function(a,o,c,h){const p=h.dateObj,I=u(p);s.includes(I)&&(h.innerHTML+='<span class="flatpickr-day-event-dot"></span>')},onReady:function(a,o,c){m(new Date)}}),console.log("[Calendar] Initialized successfully")}function u(a){const o=a.getFullYear(),c=String(a.getMonth()+1).padStart(2,"0"),h=String(a.getDate()).padStart(2,"0");return`${o}-${c}-${h}`}function g(a){const o=new Date(a),c=String(o.getHours()).padStart(2,"0"),h=String(o.getMinutes()).padStart(2,"0");return`${c}:${h}`}function m(a){const o=u(a),c=d.filter(h=>{const p=new Date(h.published_at);return u(p)===o});if(c.length===0){e.innerHTML=f("No matches on this date"),n.innerHTML='<span class="calendar__info-text">No matches found</span>';return}n.innerHTML=`
      <span class="calendar__info-text">
        Found matches: <strong>${c.length}</strong>
      </span>
    `,e.innerHTML=c.map(h=>r(h)).join("")}function f(a){return`
      <div class="calendar-events__empty">
        <svg class="calendar-events__empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z" 
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="calendar-events__empty-text">${a}</p>
      </div>
    `}function r(a){const o=g(a.published_at),h=new Date(a.published_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})+", "+o,p=a.status||"scheduled";return`
      <article class="card-match" 
               data-module="card-match" 
               data-match-id="${a.id}"
               data-match-time="${a.published_at}"
               data-status="${p}">
        
        <!-- Header -->
        <div class="card-match__header">
          <a href="${a.league.href}" class="card-match__league">
            <img src="${a.league.logo}" alt="${a.league.name}" class="card-match__league-logo">
            <span class="card-match__league-name">${a.league.name}</span>
          </a>
          <time class="card-match__date" datetime="${a.published_at}">
            ${h}
          </time>
        </div>

        <!-- Teams -->
        <div class="card-match__teams">
          
          <!-- Team 1 -->
          <a href="${a.team1.href}" class="card-match__team card-match__team--home">
            <div class="card-match__team-logo">
              <img src="${a.team1.logo}" alt="${a.team1.name}" loading="lazy">
            </div>
            <h3 class="card-match__team-name">${a.team1.name}</h3>
          </a>

          <!-- Middle - Score/Time -->
          <div class="card-match__middle">
            ${p==="live"?`
              <!-- Live -->
              <div class="card-match__status card-match__status--live">
                <span class="card-match__status-dot"></span>
                Live
              </div>
              <div class="card-match__score">
                <span class="card-match__score-number">${a.score.t1}</span>
                <span class="card-match__score-separator">:</span>
                <span class="card-match__score-number">${a.score.t2}</span>
              </div>
              ${a.minute?`<span class="card-match__minute">${a.minute}'</span>`:""}
            `:p==="finished"?`
              <!-- Finished -->
              <div class="card-match__status">Finished</div>
              <div class="card-match__score">
                <span class="card-match__score-number">${a.score.t1}</span>
                <span class="card-match__score-separator">:</span>
                <span class="card-match__score-number">${a.score.t2}</span>
              </div>
            `:`
              <!-- Scheduled -->
              <div class="card-match__time">
                <span class="material-symbols-outlined">schedule</span>
                ${o}
              </div>
            `}
          </div>

          <!-- Team 2 -->
          <a href="${a.team2.href}" class="card-match__team card-match__team--away">
            <h3 class="card-match__team-name">${a.team2.name}</h3>
            <div class="card-match__team-logo">
              <img src="${a.team2.logo}" alt="${a.team2.name}" loading="lazy">
            </div>
          </a>

        </div>

        <!-- Footer -->
        <div class="card-match__footer">
          <a href="${a.href}" class="card-match__link">
            ${p==="live"?`
              <span class="material-symbols-outlined">play_circle</span>
              Watch Live
            `:p==="finished"?`
              <span class="material-symbols-outlined">info</span>
              Match Details
            `:`
              <span class="material-symbols-outlined">event</span>
              View Match
            `}
          </a>
        </div>

      </article>
    `}}const z=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"}));function O(){const d=document.querySelectorAll('[data-module="player-stats"]');if(!d.length)return;const t=(s,i,l,u)=>{const g=String(l).includes("%"),m=parseFloat(l);if(isNaN(m)){s.textContent=l;return}const f=performance.now(),r=a=>{const o=a-f,c=Math.min(o/u,1),h=1-Math.pow(1-c,4),p=i+(m-i)*h;g?s.textContent=Math.round(p)+"%":s.textContent=Math.round(p),c<1?requestAnimationFrame(r):s.textContent=l};requestAnimationFrame(r)},e={threshold:.2,rootMargin:"0px 0px -50px 0px"},n=new IntersectionObserver(s=>{s.forEach(i=>{if(i.isIntersecting){const l=i.target.querySelectorAll("[data-count]");l.forEach(u=>{const g=u.getAttribute("data-count"),m=2e3,f=Array.from(l).indexOf(u)*100;setTimeout(()=>{t(u,0,g,m)},f)}),n.unobserve(i.target)}})},e);d.forEach(s=>{n.observe(s)}),console.log("✅ Player stats initialized")}const V=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"}));export{F as a,B as b,$ as c,z as d,V as e,x as h,j as p,q as s,N as t};
