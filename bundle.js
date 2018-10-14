(function () {
  'use strict';

  function getHairdressers () {
    const data = [
      {
        'name': 'Sofia',
        'lastname': 'Seppälä',
        'img': 'sofia',
        'key': 'QN225Q'
      }, {
        'name': 'Petra',
        'lastname': 'Larsson',
        'img': 'petra',
        'key': '3DXXZ3'
      }, {
        'name': 'Caroline',
        'lastname': 'Asplund',
        'img': 'caroline',
        'key': '36MMMQ'
      }, {
        'name': 'Hannah',
        'lastname': 'Åkermark',
        'img': 'hannah',
        'key': '3MZVNQ'
      }, {
        'name': 'Josefina',
        'lastname': 'Nettelmark',
        'img': 'josefina',
        'key': '3M44DQ'
      }, {
        'name': '',
        'lastname': 'Snabbast möjliga tid',
        'img': 'dog',
        'key': ''
      }
    ];
    return data
  }

  /*!
   * weeknumber
   * @author commenthol
   * @license Unlicense
   */
  const WEEK = 604800000; // = 7 * 24 * 60 * 60 * 1000 = 7 days in ms

  /**
   * ISO 8601 week numbering.
   *
   * New week starts on mondays.
   * Used by most European countries, most of Asia and Oceania.
   *
   * 1st week contains 4-7 days of the new year
   * @param {Date} [date] - local date - its recommended to use noon to avoid issues for days switching to DST
   * @return {Number} week number in ISO 8601 format
   * @example
   * weekNumber(new Date(2016, 0, 3, 12)) // Sun
   * //> 53
   * weekNumber(new Date(2016, 0, 4, 12)) // Mon
   * //> 1
   */
  const weekNumber = (date = new Date()) => {
    // day 0 is monday
    const day = (date.getDay() + 6) % 7;
    // get thursday of present week
    const thursday = new Date(date);
    thursday.setDate(date.getDate() - day + 3);
    if (thursday.getHours() < 3) thursday.setHours(3); // avoid problems with DST changes
    // set 1st january first
    const firstThursday = new Date(thursday.getFullYear(), 0, 1);
    // if Jan 1st is not a thursday...
    if (firstThursday.getDay() !== 4) {
      firstThursday.setMonth(0, 1 + (11 /* 4 + 7 */ - firstThursday.getDay()) % 7);
    }
    const weekNumber = 1 + Math.floor((thursday - firstThursday) / WEEK);
    return weekNumber
  };

  /* global fetch */

  /**
   * @param {String} key
   * @returns {Promise<ResourceServices>}
   */
  function getResourceServices (key) {
    return fetch('https://liveapi04.cliento.com/api/vip/services/' + key)
      .then(function (response) {
        return response.json()
      })
  }

  /**
   * @param {Number} serviceId
   * @param {String} key
   * @param {Number} year
   * @param {Number} week
   * @returns {Promise<ResourceServices>}
   */
  function getServiceSchedule (serviceId, key, year, week) {
    // return fetch('https://liveapi04.cliento.com/api/vip/slots/service/' + String(serviceId) + '/resource/' + key + '/' + today.getFullYear() + '-' + weekNumber(today) + week + '/')
    return fetch('https://liveapi04.cliento.com/api/vip/slots/service/' + String(serviceId) + '/resource/' + key + '/' + year + '-' + week + '/')
      .then(function (response) {
        return response.json()
      })
  }

  var scrollDuration = 512;

  function easeInOutQuad (t) {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t
  }

  const smoothScrollTo = (href) => {
    var start = window.performance.now();
    var target = document.getElementById(href.substring(1));

    var startY = window.scrollY;
    var deltaY = target.getBoundingClientRect().top;

    function move (pos) {
      window.scroll(0, startY + (deltaY * pos));
    }

    function update (ts) {
      var pos = (ts - start) / scrollDuration;

      if (pos >= 1) {
        return move(1)
      }

      move(easeInOutQuad(pos));

      window.requestAnimationFrame(update);
    }

    window.requestAnimationFrame(update);
  };

  var elements = Array.from(document.querySelectorAll('.smooth-scroll'));

  for (let element of elements) {
    element.addEventListener('click', function (ev) {
      ev.preventDefault();
      smoothScrollTo(element.getAttribute('href'));
    });
  }

  // import { isValid, getNumber } from './awesome-phonenumber.js'

  const monthShortNames = ['Jan', 'Feb', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  const dayShortNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  /** @typedef {import('./data-handling.js').ResourceServices} ResourceServices */

  /**
   * @typedef {HairDresser} hairDressers[]
   */

  /**
   * @typedef {Object} HairDresser
   * @property {String} name
   * @property {String} lastname
   * @property {String} img
   * @property {String} key
   */

  /**
    * @typedef {Object} selectedOptions
    * @param {HairDresser} hairDresser
    * @param {Service} service
  */
  let selectedOptions = { hairDresser: {}, service: {}, slot: {} };

  /** @type {Date} */
  let activeSchedule = getWeekStartDate(new Date());

  /**
   * Called from body.onload, starts the entire application
   */
  function initiatePage () {
    highlightDayOfTheWeek();
    populateHairdresserContainer();
  }

  function getToday () {
    return new Date().getDay() ? new Date().getDay() : 7
  }

  function highlightDayOfTheWeek () {
    const target = /** @type {HTMLElement} */ (document.querySelector('#OpeningHours :nth-child(' + getToday() + ')'));
    target.classList.add('today');
  }

  function populateHairdresserContainer () {
    const hairdresserContainer = document.querySelector('#hairdresserContainer');
    getHairdressers().forEach(hairDresser => {
      const container = document.createElement('div');
      const img = document.createElement('img');
      const ring = document.createElement('div');
      const firstName = document.createElement('p');
      const lastName = document.createElement('p');

      container.addEventListener('click', function () {
        resourceClick(hairDresser, container);
      });
      container.id = hairDresser.key;
      img.src = 'assets/img/profile/' + hairDresser.img + '.jpg';
      ring.classList.add('ring');
      firstName.textContent = hairDresser.name;
      lastName.textContent = hairDresser.lastname;

      container.appendChild(ring);
      container.appendChild(img);
      container.appendChild(firstName);
      container.appendChild(lastName);
      if (hairdresserContainer) { hairdresserContainer.appendChild(container); }
    });
  }

  /** @param {Object} hairDresser */
  /** @param {HTMLDivElement} element */
  function resourceClick (hairDresser, element) {
    if (highlightSelection(element, 'activeRing')) {
      getResourceServices(hairDresser.key).then(function (resourceServices) {
        populateResourceContainer(resourceServices);
      });
      selectedOptions.hairDresser = hairDresser;
    } else {
      animateContainer(false, '#what');
      animateContainer(false, '#when');
      selectedOptions = { hairDresser: {}, service: {} };
    }
  }

  /** @param {HTMLDivElement} element */
  /** @param {string} selector */
  function highlightSelection (element, selector) {
    const clickedElement = element;
    const lastClickedElement = document.querySelector('.' + selector);
    if (clickedElement) {
      if (lastClickedElement) {
        lastClickedElement.classList.remove(selector);
      }
      if (lastClickedElement !== clickedElement) {
        clickedElement.classList.add(selector);
        return true
      } else {
        return false
      }
    }
  }

  /** @param {ResourceServices} resourceServices */
  function populateResourceContainer (resourceServices) {
    const container = document.querySelector('#resourceServiceContainer');
    const startDate = getWeekStartDate(new Date());
    let includesSelectedResource = false;
    if (container) {
      container.innerHTML = '';
      resourceServices.services.forEach(function (service) {
        const row = document.createElement('div');
        const name = document.createElement('p');
        const timeIcon = document.createElement('i');
        const time = document.createElement('p');
        const price = document.createElement('p');

        if (selectedOptions.service.serviceId === service.serviceId) {
          row.classList.add('activeResourceOption');
          includesSelectedResource = true;
        }
        row.addEventListener('click', function () {
          selectedOptions.service = service;
          getServiceSchedule(service.serviceId, selectedOptions.hairDresser.key, activeSchedule.getFullYear(), weekNumber(activeSchedule)).then(function (serviceSchedule) {
            populateScheduleContainer(serviceSchedule);
          });
          highlightSelection(row, 'activeResourceOption');
        });
        row.id = String(service.serviceId);
        name.textContent = service.name;
        timeIcon.className = 'fa fa-clock';
        time.textContent = (service.minDuration === service.maxDuration) ? service.minDuration + 'min' : service.minDuration + 'min - ' + service.maxDuration + 'min';
        const priceString = service.maxPrice ? service.maxPrice + 'kr' : '';
        price.textContent = priceString;

        row.appendChild(name);
        row.appendChild(timeIcon);
        row.appendChild(time);
        row.appendChild(price);
        container.appendChild(row);
      });
    }
    if (!includesSelectedResource) {
      selectedOptions.service = {};
      animateContainer(false, '#when');
    } else {
      getServiceSchedule(selectedOptions.service.serviceId, selectedOptions.hairDresser.key, activeSchedule.getFullYear(), weekNumber(activeSchedule)).then(function (serviceSchedule) {
        populateScheduleContainer(serviceSchedule);
      });
    }
    animateContainer(true, '#what');
    smoothScrollTo('#what');
  }

  /** @param {Boolean} state */
  /** @param {String} id */
  function animateContainer (state, id) {
    const target = /** @type {HTMLElement} */ document.querySelector(id);

    if (target) {
      if (state) {
        const items = document.querySelector(id + ' div.content');
        if (target && items) {
          target.style.height = items.scrollHeight;
        }
      } else {
        target.style.height = 0;
      }
    }
  }

  /** @param {Date} date */
  function getWeekStartDate (date) {
    const newDate = new Date(date.setDate(date.getDate() - getRealDay(date)));
    return newDate
  }

  /** @param {Date} date */
  /** @param {number} toAdd */
  function addDays (date, toAdd) {
    return new Date(date.setDate(date.getDate() + toAdd))
  }

  /** @param {Date} date */
  function getRealDay (date) {
    let dateNumber = date.getDay() === 0 ? 6 : date.getDay() - 1;
    return dateNumber
  }

  /** @param {ServiceSchedule} serviceSchedule */
  function populateScheduleContainer (serviceSchedule) {
    populateScheduleDate();
    populateScheduleBoxes(serviceSchedule);
    animateContainer(true, '#when');
    smoothScrollTo('#when');
  }

  /** @param {string} type */
  function scheduleArrowClick (type) {
    if (type === 'forward') {
      activeSchedule = addDays(activeSchedule, 7);
    } else if (type === 'backward') {
      activeSchedule = addDays(activeSchedule, -7);
    }
    getServiceSchedule(selectedOptions.service.serviceId, selectedOptions.hairDresser.key, activeSchedule.getFullYear(), weekNumber(activeSchedule)).then(function (serviceSchedule) {
      populateScheduleContainer(serviceSchedule);
    });
  }

  /** @param {ServiceSchedule} serviceSchedule */
  function populateScheduleBoxes (serviceSchedule) {
    const target = document.getElementById('resourceScheduleContainer');
    const startDate = activeSchedule;
    const oneWeekForward = addDays(new Date(startDate.getTime()), 6);
    let match = false;

    // /** @param {ServiceScheduleslot} slot */
    const renderEntry = function (slot) {
      const entryElement = document.createElement('div');
      const textElement = document.createElement('p');
      textElement.textContent = slot.time.substring(0, 5);
      entryElement.classList.add('slot');
      entryElement.appendChild(textElement);
      entryElement.addEventListener('click', function () {
        selectedOptions.slot = slot;
        highlightSelection(entryElement, 'activeSlot');
        populateSummeryContainer(slot);
      });
      if (slot.time === selectedOptions.slot.time && slot.date === selectedOptions.slot.date) {
        selectedOptions.slot = slot;
        populateSummeryContainer(slot);
        entryElement.classList.add('activeSlot');
        match = true;
      }
      return entryElement
    };

    const renderEmpty = function () {
      const p = document.createElement('p');
      p.textContent = 'Inga lediga tider';
      p.style.fontSize = '10px';
      return p
    };

    /** @param {Date} date1 */
    /** @param {Date} date2 */
    const compareDates = function (date1, date2) {
      if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
        return true
      }
      return false
    };

    if (target) {
      target.innerHTML = '';
      for (let i = new Date(startDate.getTime()); i.getTime() <= oneWeekForward.getTime(); i = addDays(i, 1)) {
        const container = document.createElement('div');
        const column = document.createElement('div');
        const day = document.createElement('div');
        const dayName = document.createElement('h2');
        const dayDate = document.createElement('p');
        container.classList.add('column');
        dayName.textContent = dayShortNames[getRealDay(i)];
        dayDate.textContent = i.getDate() + ' ' + monthShortNames[i.getMonth()];
        day.appendChild(dayName);
        day.appendChild(dayDate);
        column.appendChild(day);
        container.appendChild(column);
        let match = false;
        serviceSchedule.slots.forEach(function (slot) {
          const slotTime = new Date(slot.date);
          if (compareDates(slotTime, i)) {
            match = true;
            container.appendChild(renderEntry(slot));
          }
        });
        if (!match) {
          container.appendChild(renderEmpty());
        }
        target.appendChild(container);
      }
      if (!match) {
        animateContainer(false, '#summary');
      }
    }
  }

  function populateScheduleDate () {
    const scheduleInfobar = document.getElementById('scheduleInfobar');
    if (scheduleInfobar) {
      scheduleInfobar.innerHTML = '';

      const weekElement = document.createElement('h2');
      const dateElement = document.createElement('p');
      const startDate = activeSchedule;
      const oneWeekForward = addDays(new Date(startDate.getTime()), 6);

      weekElement.textContent = 'Vecka ' + weekNumber(startDate);
      dateElement.textContent = startDate.getDate() + ' ' + monthShortNames[startDate.getMonth()] + ' - ' + String(oneWeekForward.getDate()) + ' ' + monthShortNames[oneWeekForward.getMonth()];
      scheduleInfobar.appendChild(weekElement);
      scheduleInfobar.appendChild(dateElement);
    }
  }

  function populateSummeryContainer (slot) {
    const target = document.getElementById('summaryTextContainer');
    if (target) {
      const title = document.createElement('h3');
      const p = document.createElement('p');
      const date = new Date(slot.date);
      const string = dayShortNames[getRealDay(date)] + 'dag den ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' klockan ' + slot.time.substring(0, 5);
      target.innerHTML = '';
      title.textContent = selectedOptions.service.name;
      p.textContent = string;
      target.appendChild(title);
      target.appendChild(p);
      animateContainer(true, '#summary');
      smoothScrollTo('#summary');
    }
  }

  function getNumber (number) {
    number = number.replace(/\s/g,'');
    if (number) {
      if (number.charAt(0) === '4' && number.charAt(1) === '6') {
        number = '+' + number;
      } else if (number.charAt(0) !== '+') {
        number = number.substring(1);
        number = '+46' + number;
      }
    }
    return number
  }

  function isValid (number) {
    // +46 accounts to 3 letters number is 7 - 9
    const isnum = /^\d+$/.test(number.substring(1));
    if (!isnum) {
      return false
    }
    if (number.length === 10 || number.length === 11 || number.length === 12) {
      return true
    } else {
      return false
    }
  }

  function sendRequest () {
    // {"slotKey":"/SDP4xJBJrRj2NXmZOYmku27wuQhGEfDqX7/sOY6jgN2fiu13xexNhTQAiVi3l07","name":"HEnric",","phone":"+46732961010","note":"","reminderTypes":["SMS"]}
    const nameElement = document.getElementById('name');
    const phoneElement = document.getElementById('phone');
    const noteElement = document.getElementById('message');
    if (nameElement && phoneElement && noteElement) {
      const name = nameElement.value;
      const phone = getNumber(phoneElement.value);
      const note = noteElement.value;
      if (!name) {
        const reset = function () {
          nameElement.style.animation = '';
        };
        nameElement.style.animation = 'shake 200ms';
        setTimeout(reset, 200);
      }
      if (!isValid(phone)) {
        const reset = function () {
          phoneElement.style.animation = '';
        };
        phoneElement.style.animation = 'shake 200ms';
        setTimeout(reset, 200);
      }

      if (name && isValid(phone)) {
        const obj = { 'slotKey': selectedOptions.slot.key, name, phone, note, 'reminderTypes': ['SMS'] };
        console.log(obj);
      }


      // https://liveapi04.cliento.com/api/v2/partner/cliento/7DUdvNGJ5LXQK83UlWTJ1O/booking/
    }
  }

  /* Export public functions */
  window['initiatePage'] = initiatePage;
  window['scheduleArrowClick'] = scheduleArrowClick;
  window['sendRequest'] = sendRequest;

}());
//# sourceMappingURL=bundle.js.map
