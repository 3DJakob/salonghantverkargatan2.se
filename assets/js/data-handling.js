/* global fetch */

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
