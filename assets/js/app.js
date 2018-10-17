import { getHairdressers } from '../data/hairDressers.js'
import { getResourceSettings, getResourceServices, getServiceSchedule, sendBooking, showPinInput, Service, ServiceSchedule, ServiceScheduleSlot } from './data-handling.js'
import { smoothScrollTo } from './smooth-scroll.js'
import { weekNumber } from './weeknumber.js'

const monthShortNames = ['Jan', 'Feb', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December']
const dayShortNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']

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

let selectedOptions = { hairDresser: {}, options: {}, service: {}, slot: {} }

/** @type {Date} */
let activeSchedule = getWeekStartDate(new Date())

/**
 * Called from body.onload, starts the entire application
 */
function initiatePage () {
  highlightDayOfTheWeek()
  populateHairdresserContainer()
  animateContainer(true, '#who')
}

function getToday () {
  return new Date().getDay() ? new Date().getDay() : 7
}

function highlightDayOfTheWeek () {
  const target = /** @type {HTMLElement} */ (document.querySelector('#OpeningHours :nth-child(' + getToday() + ')'))
  target.classList.add('today')
}

function populateHairdresserContainer () {
  const hairdresserContainer = document.querySelector('#hairdresserContainer')
  if (hairdresserContainer) { hairdresserContainer.innerHTML = '' }
  getHairdressers().forEach(hairDresser => {
    const container = document.createElement('div')
    const img = document.createElement('img')
    const ring = document.createElement('div')
    const firstName = document.createElement('p')
    const lastName = document.createElement('p')

    container.addEventListener('click', function () {
      resourceClick(hairDresser, container)
    })
    container.id = hairDresser.key
    img.src = 'assets/img/profile/' + hairDresser.img + '.jpg'
    ring.classList.add('ring')
    firstName.textContent = hairDresser.name
    lastName.textContent = hairDresser.lastname

    container.appendChild(ring)
    container.appendChild(img)
    container.appendChild(firstName)
    container.appendChild(lastName)
    if (hairdresserContainer) { hairdresserContainer.appendChild(container) }
  })
}

/** @param {Object} hairDresser */
/** @param {HTMLDivElement} element */
function resourceClick (hairDresser, element) {
  if (highlightSelection(element, 'activeRing')) {
    getResourceServices(hairDresser.key).then(function (resourceServices) {
      populateResourceContainer(resourceServices)
    })
    getResourceSettings(hairDresser.key).then(function (resourceSettings) {
      selectedOptions.options = resourceSettings
    })
    selectedOptions.hairDresser = hairDresser
  } else {
    animateContainer(false, '#what')
    animateContainer(false, '#when')
    animateContainer(false, '#summary')
    selectedOptions = { hairDresser: {}, options: {}, service: {}, slot: {} }
  }
}

/** @param {HTMLDivElement} element */
/** @param {string} selector */
function highlightSelection (element, selector) {
  const clickedElement = element
  const lastClickedElement = document.querySelector('.' + selector)
  if (clickedElement) {
    if (lastClickedElement) {
      lastClickedElement.classList.remove(selector)
    }
    if (lastClickedElement !== clickedElement) {
      clickedElement.classList.add(selector)
      return true
    } else {
      return false
    }
  }
}

/** @param {ResourceServices} resourceServices */
function populateResourceContainer (resourceServices) {
  const container = document.querySelector('#resourceServiceContainer')
  let includesSelectedResource = false
  if (container) {
    container.innerHTML = ''
    resourceServices.services.forEach(function (service) {
      const row = document.createElement('div')
      const name = document.createElement('p')
      const timeIcon = document.createElement('i')
      const time = document.createElement('p')
      const price = document.createElement('p')

      if (selectedOptions.service.serviceId === service.serviceId) {
        row.classList.add('activeResourceOption')
        includesSelectedResource = true
      }
      row.addEventListener('click', function () {
        selectedOptions.service = service
        getServiceSchedule(service.serviceId, selectedOptions.hairDresser.key, activeSchedule.getFullYear(), weekNumber(activeSchedule)).then(function (serviceSchedule) {
          populateScheduleContainer(serviceSchedule)
        })
        highlightSelection(row, 'activeResourceOption')
      })
      row.id = String(service.serviceId)
      name.textContent = service.name
      timeIcon.className = 'fa fa-clock'
      time.textContent = (service.minDuration === service.maxDuration) ? service.minDuration + 'min' : service.minDuration + 'min - ' + service.maxDuration + 'min'
      const priceString = service.maxPrice ? service.maxPrice + 'kr' : ''
      price.textContent = priceString

      row.appendChild(name)
      row.appendChild(timeIcon)
      row.appendChild(time)
      row.appendChild(price)
      container.appendChild(row)
    })
  }
  if (!includesSelectedResource) {
    selectedOptions.service = {}
    animateContainer(false, '#when')
  } else {
    getServiceSchedule(selectedOptions.service.serviceId, selectedOptions.hairDresser.key, activeSchedule.getFullYear(), weekNumber(activeSchedule)).then(function (serviceSchedule) {
      populateScheduleContainer(serviceSchedule)
    })
  }
  animateContainer(true, '#what')
  smoothScrollTo('#what')
}

/** @param {Boolean} state */
/** @param {String} id */
function animateContainer (state, id) {
  const target = /** @type {HTMLElement} */ document.querySelector(id)

  if (target) {
    if (state) {
      const items = document.querySelector(id + ' div.content')
      if (target && items) {
        target.style.height = items.scrollHeight
      }
    } else {
      target.style.height = 0
    }
  }
}

/** @param {Date} date */
function getWeekStartDate (date) {
  const newDate = new Date(date.setDate(date.getDate() - getRealDay(date)))
  return newDate
}

/** @param {Date} date */
/** @param {number} toAdd */
function addDays (date, toAdd) {
  return new Date(date.setDate(date.getDate() + toAdd))
}

/** @param {Date} date */
function getRealDay (date) {
  let dateNumber = date.getDay() === 0 ? 6 : date.getDay() - 1
  return dateNumber
}

/** @param {ServiceSchedule} serviceSchedule */
function populateScheduleContainer (serviceSchedule) {
  populateScheduleDate()
  populateScheduleBoxes(serviceSchedule)
  animateContainer(true, '#when')
  smoothScrollTo('#when')
}

/** @param {string} type */
function scheduleArrowClick (type) {
  if (type === 'forward') {
    activeSchedule = addDays(activeSchedule, 7)
  } else if (type === 'backward') {
    activeSchedule = addDays(activeSchedule, -7)
  }
  getServiceSchedule(selectedOptions.service.serviceId, selectedOptions.hairDresser.key, activeSchedule.getFullYear(), weekNumber(activeSchedule)).then(function (serviceSchedule) {
    populateScheduleContainer(serviceSchedule)
  })
}

/** @param {ServiceSchedule} serviceSchedule */
function populateScheduleBoxes (serviceSchedule) {
  const target = document.getElementById('resourceScheduleContainer')
  const startDate = activeSchedule
  const oneWeekForward = addDays(new Date(startDate.getTime()), 6)
  let match = false

  /** @param {ServiceScheduleSlot} slot */
  const renderEntry = function (slot) {
    const entryElement = document.createElement('div')
    const textElement = document.createElement('p')
    textElement.textContent = slot.time.substring(0, 5)
    entryElement.classList.add('slot')
    entryElement.appendChild(textElement)
    entryElement.addEventListener('click', function () {
      selectedOptions.slot = slot
      highlightSelection(entryElement, 'activeSlot')
      populateSummeryContainer(slot)
    })
    if (slot.time === selectedOptions.slot.time && slot.date === selectedOptions.slot.date) {
      selectedOptions.slot = slot
      populateSummeryContainer(slot)
      entryElement.classList.add('activeSlot')
      match = true
    }
    return entryElement
  }

  const renderEmpty = function () {
    const p = document.createElement('p')
    p.textContent = 'Inga lediga tider'
    p.style.fontSize = '10px'
    return p
  }

  /** @param {Date} date1 */
  /** @param {Date} date2 */
  const compareDates = function (date1, date2) {
    if (date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()) {
      return true
    }
    return false
  }

  if (target) {
    target.innerHTML = ''
    for (let i = new Date(startDate.getTime()); i.getTime() <= oneWeekForward.getTime(); i = addDays(i, 1)) {
      const container = document.createElement('div')
      const column = document.createElement('div')
      const day = document.createElement('div')
      const dayName = document.createElement('h2')
      const dayDate = document.createElement('p')
      container.classList.add('column')
      dayName.textContent = dayShortNames[getRealDay(i)]
      dayDate.textContent = i.getDate() + ' ' + monthShortNames[i.getMonth()]
      day.appendChild(dayName)
      day.appendChild(dayDate)
      column.appendChild(day)
      container.appendChild(column)
      let match = false
      serviceSchedule.slots.forEach(function (slot) {
        const slotTime = new Date(slot.date)
        if (compareDates(slotTime, i)) {
          match = true
          container.appendChild(renderEntry(slot))
        }
      })
      if (!match) {
        container.appendChild(renderEmpty())
      }
      target.appendChild(container)
    }
    if (!match) {
      animateContainer(false, '#summary')
    }
  }
}

function populateScheduleDate () {
  const scheduleInfobar = document.getElementById('scheduleInfobar')
  if (scheduleInfobar) {
    scheduleInfobar.innerHTML = ''

    const weekElement = document.createElement('h2')
    const dateElement = document.createElement('p')
    const startDate = activeSchedule
    const oneWeekForward = addDays(new Date(startDate.getTime()), 6)

    weekElement.textContent = 'Vecka ' + weekNumber(startDate)
    dateElement.textContent = startDate.getDate() + ' ' + monthShortNames[startDate.getMonth()] + ' - ' + String(oneWeekForward.getDate()) + ' ' + monthShortNames[oneWeekForward.getMonth()]
    scheduleInfobar.appendChild(weekElement)
    scheduleInfobar.appendChild(dateElement)
  }
}

/** @param {String} date */
/** @param {String} time */
function getDateFromSlot (date, time) {
  const dateObj = new Date(date + 'T' + time)
  dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset())
  return dateObj
}

/** @param {Date} date */
function readableDate (date) {
  let day
  if (dayShortNames[getRealDay(date)] === 'Tor') {
    day = 'Tors'
  } else {
    day = dayShortNames[getRealDay(date)]
  }
  const string = day + 'dag den ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' klockan ' + date.getHours() + ':' + ('0' + String(date.getMinutes())).slice(-2)
  return string
}

function populateSummeryContainer (slot) {
  const target = document.getElementById('summaryTextContainer')
  if (target) {
    const title = document.createElement('h3')
    const p = document.createElement('p')
    const date = getDateFromSlot(slot.date, slot.time)
    const string = readableDate(date)
    target.innerHTML = ''
    title.textContent = selectedOptions.service.name
    p.textContent = string
    target.appendChild(title)
    target.appendChild(p)
    animateContainer(true, '#summary')
    smoothScrollTo('#summary')
  }
}

/** @param {string} number */
function getNumber (number) {
  number = number.replace(/\s/g,'');
  if (number) {
    if (number.charAt(0) === '4' && number.charAt(1) === '6') {
      number = '+' + number
    } else if (number.charAt(0) !== '+') {
      number = number.substring(1)
      number = '+46' + number
    }
  }
  return number
}

/** @param {string} number */
function isValidPhone (number) {
  // +46 accounts to 3 letters number is 7 - 9
  const isnum = /^\d+$/.test(number.substring(1))
  if (!isnum) {
    return false
  }
  if (number.length === 10 || number.length === 11 || number.length === 12) {
    return true
  } else {
    return false
  }
}

/** @param {string} email */
function isValidEmail (email) {
  if ((email.includes('@') && email.includes('.')) || email === '') {
    return true
  }
  return false
}

function sendRequest () {
  const nameElement = document.getElementById('name')
  const phoneElement = document.getElementById('phone')
  const emailElement = document.getElementById('email')
  const noteElement = document.getElementById('message')
  if (nameElement && phoneElement && noteElement && emailElement) {
    const name = nameElement.value
    const phone = getNumber(phoneElement.value)
    const email = emailElement.value
    const note = noteElement.value
    if (!name) {
      const reset = function () {
        nameElement.style.animation = ''
      }
      nameElement.style.animation = 'shake 200ms'
      setTimeout(reset, 200)
    }
    if (!isValidPhone(phone)) {
      const reset = function () {
        phoneElement.style.animation = ''
      }
      phoneElement.style.animation = 'shake 200ms'
      setTimeout(reset, 200)
    }
    if (!isValidEmail(email)) {
      const reset = function () {
        emailElement.style.animation = ''
      }
      emailElement.style.animation = 'shake 200ms'
      setTimeout(reset, 200)
    }

    if (name && isValidPhone(phone) && isValidEmail(email)) { // valid click!
      const obj = { 'slotKey': selectedOptions.slot.key, name, email, phone, note, 'reminderTypes': ['SMS'] }
      sendBooking(obj, selectedOptions.options.settings.stableId).then(function (response) {
        if (response) {
          showPinInput(response, selectedOptions.options.settings.stableId).then(function (confirmed) {
            if (confirmed) {
              populateConfirmed()
            }
          })
        }
      })
    }
  }
}

function retractBookingContainer () {
  animateContainer(false, '#summary')
  animateContainer(false, '#when')
  animateContainer(false, '#what')
  animateContainer(false, '#who')
}

function populateConfirmed () {
  const bookingDate = getDateFromSlot(selectedOptions.slot.date, selectedOptions.slot.time)
  const bookingString = readableDate(bookingDate)
  const textElement = document.querySelector('#confirmDate')
  if (textElement) {
    textElement.textContent = selectedOptions.service.name + ' ' + bookingString
  }
  selectedOptions = { hairDresser: {}, options: {}, service: {}, slot: {} }
  populateHairdresserContainer()
  animateContainer(true, '#complete')
  smoothScrollTo('#page2')
  setTimeout(function () { retractBookingContainer() }, 512)
}

function newBooking () {
  animateContainer(false, '#complete')
  animateContainer(true, '#who')
}

function slideshow (goTo) {
  document.querySelector('#imageContainer').style.transform = 'translateX(' + -25 * (goTo - 1) + '%)'
}

/* Export public functions */
window['initiatePage'] = initiatePage
window['scheduleArrowClick'] = scheduleArrowClick
window['sendRequest'] = sendRequest
window['newBooking'] = newBooking
window['slideshow'] = slideshow
