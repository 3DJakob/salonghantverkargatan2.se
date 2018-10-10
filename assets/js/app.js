import { getHairdressers } from '../data/hairDressers.js'
import { getResourceSettings, getResourceServices, getServiceSchedule, Service, ServiceSchedule } from './data-handling.js'
import {} from './smooth-scroll.js'
import { weekNumber } from './weeknumber.js'
// const weeknumber = require('weeknumber')
// import weeknumber from 'weeknumber'
// import { weekNumber } from './weeknumber.js'

const monthNames = ['Jan', 'Feb', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
const dayNames = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön']

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

let selectedOptions = { hairDresser: {}, service: {} }

/** @type {Date} */
let activeSchedule = getWeekStartDate(new Date())

/**
 * Called from body.onload, starts the entire application
 */
function initiatePage () {
  highlightDayOfTheWeek()
  populateHairdresserContainer()
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
  getHairdressers().forEach(hairDresser => {
    const container = document.createElement('div')
    const img = document.createElement('img')
    const ring = document.createElement('div')
    const firstName = document.createElement('p')
    const lastName = document.createElement('p')

    container.addEventListener('click', function () {
      resourceClick(hairDresser)
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
function resourceClick (hairDresser) {
  if (animateResourceRing(hairDresser)) {
    getResourceServices(hairDresser.key).then(function (resourceServices) {
      populateResourceContainer(resourceServices)
    })
    selectedOptions.hairDresser = hairDresser
  } else {
    showServiceContainer(false)
    selectedOptions = { hairDresser: {}, service: {} }
  }
}

/** @param {HairDresser} hairDresser */
function animateResourceRing (hairDresser) {
  const clickedElement = document.getElementById(hairDresser.key)
  const lastClickedElement = document.querySelector('.selected')
  if (clickedElement) {
    if (lastClickedElement) {
      lastClickedElement.classList.remove('selected')
    }
    if (lastClickedElement !== clickedElement) {
      clickedElement.classList.add('selected')
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
        const startDate = getWeekStartDate(new Date())
        getServiceSchedule(service.serviceId, selectedOptions.hairDresser.key, startDate.getFullYear(), weekNumber(startDate)).then(function (serviceSchedule) {
          populateScheduleContainer(serviceSchedule)
        })
        animateService(service)
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
  }
  showServiceContainer(true)
}

/** @param {Boolean} state */
function showServiceContainer (state) {
  const target = /** @type {HTMLElement} */ document.querySelector('#what')

  if (target) {
    if (state) {
      const items = document.querySelector('#resourceServiceContainer')
      const header = document.querySelector('#what h2')
      if (target && items && header) {
        target.style.height = items.clientHeight + header.clientHeight
      }
    } else {
      target.style.height = 0
    }
  }
}

/** @param {Service} service */
function animateService (service) {
  const previous = /** @type {HTMLElement} */ document.querySelectorAll('.activeResourceOption')
  if (previous[0]) {
    previous.forEach(function (item) {
      item.classList.remove('activeResourceOption')
    })
  }

  const next = /** @type {HTMLElement} */ document.getElementById(String(service.serviceId))
  if (next) {
    next.classList.add('activeResourceOption')
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
}

/** @param {string} type */
function scheduleArrowClick (type) {
  if (type === 'forward') {
    activeSchedule = addDays(activeSchedule, 6)
  } else if (type === 'backward') {
    activeSchedule = addDays(activeSchedule, -8)
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

  if (target) {
    target.innerHTML = ''
    for (let i = startDate; i.getTime() <= oneWeekForward.getTime(); i = addDays(i, 1)) {
      const column = document.createElement('div')
      const day = document.createElement('div')
      const dayName = document.createElement('h2')
      const dayDate = document.createElement('p')
      column.classList.add('column')
      dayName.textContent = dayNames[getRealDay(i)]
      dayDate.textContent = i.getDate() + ' ' + monthNames[i.getMonth()]
      day.appendChild(dayName)
      day.appendChild(dayDate)
      column.appendChild(day)
      target.appendChild(column)
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
    dateElement.textContent = startDate.getDate() + ' ' + monthNames[startDate.getMonth()] + ' - ' + String(oneWeekForward.getDate()) + ' ' + monthNames[oneWeekForward.getMonth()]
    scheduleInfobar.appendChild(weekElement)
    scheduleInfobar.appendChild(dateElement)
  }
}

/* Export public functions */
window['initiatePage'] = initiatePage
window['scheduleArrowClick'] = scheduleArrowClick
