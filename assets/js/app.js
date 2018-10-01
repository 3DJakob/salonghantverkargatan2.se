import { getHairdressers } from '../data/hairDressers.js'
import { getResourceSettings, getResourceServices } from './data-handling.js'
import {} from './smooth-scroll.js'

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
    showServices(hairDresser)
    selectedOptions.hairDresser = hairDresser
  } else {
    showResourceContainer(false)
    selectedOptions.hairDresser = {}
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

/** @param {HairDresser} hairDresser */
function showServices (hairDresser) {
  getResourceSettings(hairDresser.key).then(function (resourceSettings) {

  })
  getResourceServices(hairDresser.key).then(function (resourceServices) {
    populateResourceContainer(resourceServices)
  })
}

/** @param {ResourceServices} resourceServices */
function populateResourceContainer (resourceServices) {
  console.log(resourceServices)
  const container = document.querySelector('#resourceServiceContainer')
  if (container) {
    container.innerHTML = ''
    resourceServices.services.forEach(function (service) {
      const row = document.createElement('div')
      const name = document.createElement('p')
      const timeIcon = document.createElement('i')
      const time = document.createElement('p')
      const price = document.createElement('p')

      row.addEventListener('click', function () {
        selectedOptions.service = service
      })
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
  showResourceContainer(true)
}

/** @param {Boolean} state */
function showResourceContainer (state) {
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

/* Export public functions */
window['initiatePage'] = initiatePage
