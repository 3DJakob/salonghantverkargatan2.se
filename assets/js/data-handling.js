/* global fetch */
import { weekNumber } from './weeknumber.js'
// import { showPinInput } from './app.js'

/**
 * @typedef {Object} ResourceSettings
 * @property {Number} resourceId
 * @property {String} resourceName
 * @property {Setting[]} settings
 */

/**
 * @typedef {Object} Setting
 * @property {String} companyName
 * @property {String} currencyCode
 * @property {String} preferredE164CountryCode
 * @property {String} stableId
 * @property {Number} webBookingMaxDaysInAdvance
 * @property {String} webContactNumber
 * @property {Boolean} webHideNotes
 * @property {Number} webMinTimeBeforeBooking
 * @property {Boolean} webRequireEmail
 * @property {Boolean} webRequireNotes
 * @property {Boolean} webRequirePno
 * @property {Boolean} webUseSmsVerification
 */

/**
 * @typedef {Object} ResourceServices
 * @property {Service[]} services
 */

/**
 * @typedef {Object} Service
 * @property {String} description
 * @property {String} group
 * @property {Number} maxDuration
 * @property {Number} maxPrice
 * @property {Number} minDuration
 * @property {Number} minPrice
 * @property {String} name
 * @property {Boolean} priceFrom
 * @property {Number} serviceId
 */

/**
 * @typedef {Object} ServiceSchedule
 * @property {ServiceScheduleSlot[]} slots
 */

/**
 * @typedef {Object} ServiceScheduleSlot
 * @property {String} key
 * @property {String} date
 * @property {String} time
 * @property {String} resource
 * @property {Number} resourceId
 * @property {Number} price
 * @property {Boolean} priceFrom
 */

/**
 * @param {String} key
 * @returns {Promise<ResourceSettings>}
 */
export function getResourceSettings (key) {
  return fetch('https://cliento.com/api/vip/settings/' + key)
    .then(function (response) {
      return response.json()
    })
}

/**
 * @param {String} key
 * @returns {Promise<ResourceServices>}
 */
export function getResourceServices (key) {
  const url = key === 'ALL' ? 'https://cliento.com/api/v2/partner/cliento/5twAGxhwQrBx6wXjjJeh3j/services/' : 'https://cliento.com/api/vip/services/' + key
  return fetch(url)
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
export function getServiceSchedule (serviceId, key, year, week) {
  const date = year + '-' + week
  const url = key === 'ALL' ? 'https://cliento.com/api/v2/partner/cliento/5twAGxhwQrBx6wXjjJeh3j/slots/service/' + String(serviceId) + '/resource/ALL/' + date : 'https://cliento.com/api/vip/slots/service/' + String(serviceId) + '/resource/' + key + '/' + date
  return fetch(url)
    .then(function (response) {
      return response.json()
    })
}

export function sendBooking (data, stableId) {
  return new Promise(function (resolve, reject) {
    const url = 'https://cliento.com/api/v2/partner/cliento/' + stableId + '/booking/'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(response => resolve(response))
      .catch(error => console.error('Error:', error))
  })
}

/**
 * @param {String} pin
 * @returns {boolean}
 */
function isValidPin (pin) {
  if (pin.length === 4 || !isNaN(pin)) {
    return true
  }
  return false
}

export function showPinInput (res, stableId) {
  return new Promise(function (resolve, reject) {
    const url = 'https://cliento.com/api/v2/partner/cliento/' + stableId + '/booking/confirm/'
    const pin = window.prompt('Skriv in pin från SMS', '')
    const data = { 'slotKey': res.confirmKey, 'pin': pin }
    if (isValidPin(pin)) {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
        .then(response => resolve(true))
        .catch(error => resolve(false))
    } else {
      resolve(false)
    }
  })
}
