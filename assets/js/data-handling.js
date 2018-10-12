/* global fetch */
import { weekNumber } from './weeknumber.js'

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
 * @property {Slot[]} slots
 */

/**
 * @typedef {Object} Slot
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
  return fetch('https://liveapi04.cliento.com/api/vip/settings/' + key)
    .then(function (response) {
      return response.json()
    })
}

/**
 * @param {String} key
 * @returns {Promise<ResourceServices>}
 */
export function getResourceServices (key) {
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
export function getServiceSchedule (serviceId, key, year, week) {
  const today = new Date()
  // return fetch('https://liveapi04.cliento.com/api/vip/slots/service/' + String(serviceId) + '/resource/' + key + '/' + today.getFullYear() + '-' + weekNumber(today) + week + '/')
  return fetch('https://liveapi04.cliento.com/api/vip/slots/service/' + String(serviceId) + '/resource/' + key + '/' + year + '-' + week + '/')
    .then(function (response) {
      return response.json()
    })
}
