import { getHairdressers } from '../data/hairDressers.js'
import { getResourceSettings, getResourceServices } from './data-handling.js'
import {} from './smooth-scroll.js'

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
  animateResourceRing(hairDresser)
  showServices(hairDresser)
}

/** @param {HairDresser} hairDresser */
function animateResourceRing (hairDresser) {
  const clickedElement = document.getElementById(hairDresser.key)
  const lastClickedElement = document.querySelector('.selected')
  if (clickedElement) {
    if (lastClickedElement) {
      lastClickedElement.classList.remove('selected')
    }
    clickedElement.classList.add('selected')
  }
}

/** @param {HairDresser} hairDresser */
function showServices (hairDresser) {
  getResourceSettings(hairDresser.key).then(function (resourceSettings) {
    console.log(resourceSettings)
  })
}

/* Export public functions */
window['initiatePage'] = initiatePage
