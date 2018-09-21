(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// window['hairDressers'] = [
//   {
//     'name': 'Sofia',
//     'lastname': 'Seppälä',
//     'img': 'sofia',
//     'key': 'QN225Q'
//   }, {
//     'name': 'Petra',
//     'lastname': 'Larsson',
//     'img': 'petra',
//     'key': '3DXXZ3'
//   }, {
//     'name': 'Caroline',
//     'lastname': 'Asplund',
//     'img': 'caroline',
//     'key': '36MMMQ'
//   }, {
//     'name': 'Hannah',
//     'lastname': 'Åkermark',
//     'img': 'hannah',
//     'key': '3MZVNQ'
//   }, {
//     'name': 'Josefina',
//     'lastname': 'Nettelmark',
//     'img': 'josefina',
//     'key': '3M44DQ'
//   }, {
//     'name': '',
//     'lastname': 'Snabbast möjliga tid',
//     'img': 'dog',
//     'key': ''
//   }
// ]

exports.getData = function getData () {
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
  ]
  return data
}

},{}],2:[function(require,module,exports){
const hairDressers = require('../data/hairDressers')
const dataHandling = require('./data-handling')
const smoothScroll = require('./smooth-scroll')

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
  hairDressers.getData().forEach(hairDresser => {
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
  dataHandling.getResourceSettings(hairDresser.key).then(function (resourceSettings) {
    console.log(resourceSettings)
  })
}

/* Export public functions */
window['initiatePage'] = initiatePage

},{"../data/hairDressers":1,"./data-handling":3,"./smooth-scroll":4}],3:[function(require,module,exports){
/* global fetch */

/**
 * @typedef {Object} ResourceSettings
 * @property {Number} resourceId
 * @property {String} resourceName
 * @property {Settings} settings
 */

/**
 * @typedef {Object} Settings
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
 * @param {String} key
 * @returns {Promise<ResourceSettings>}
 */
exports.getResourceSettings = function getResourceSettings (key) {
  return fetch('https://liveapi04.cliento.com/api/vip/settings/' + key)
    .then(function (response) {
      return response.json()
    })
}

// /* Export public functions */
// window['getResourceSettings'] = getResourceSettings

},{}],4:[function(require,module,exports){
'use strict'

var scrollDuration = 512

function easeInOutQuad (t) {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t
}

function smoothScrollTo (href) {
  var start = window.performance.now()
  var target = document.getElementById(href.substring(1))

  var startY = window.scrollY
  var deltaY = target.getBoundingClientRect().top

  function move (pos) {
    window.scroll(0, startY + (deltaY * pos))
  }

  function update (ts) {
    var pos = (ts - start) / scrollDuration

    if (pos >= 1) {
      return move(1)
    }

    move(easeInOutQuad(pos))

    window.requestAnimationFrame(update)
  }

  window.requestAnimationFrame(update)
}

var elements = Array.from(document.querySelectorAll('.smooth-scroll'))

for (let element of elements) {
  element.addEventListener('click', function (ev) {
    ev.preventDefault()
    smoothScrollTo(element.getAttribute('href'))
  })
}

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvZGF0YS9oYWlyRHJlc3NlcnMuanMiLCJhc3NldHMvanMvYXBwLmpzIiwiYXNzZXRzL2pzL2RhdGEtaGFuZGxpbmcuanMiLCJhc3NldHMvanMvc21vb3RoLXNjcm9sbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyB3aW5kb3dbJ2hhaXJEcmVzc2VycyddID0gW1xuLy8gICB7XG4vLyAgICAgJ25hbWUnOiAnU29maWEnLFxuLy8gICAgICdsYXN0bmFtZSc6ICdTZXBwYcyIbGHMiCcsXG4vLyAgICAgJ2ltZyc6ICdzb2ZpYScsXG4vLyAgICAgJ2tleSc6ICdRTjIyNVEnXG4vLyAgIH0sIHtcbi8vICAgICAnbmFtZSc6ICdQZXRyYScsXG4vLyAgICAgJ2xhc3RuYW1lJzogJ0xhcnNzb24nLFxuLy8gICAgICdpbWcnOiAncGV0cmEnLFxuLy8gICAgICdrZXknOiAnM0RYWFozJ1xuLy8gICB9LCB7XG4vLyAgICAgJ25hbWUnOiAnQ2Fyb2xpbmUnLFxuLy8gICAgICdsYXN0bmFtZSc6ICdBc3BsdW5kJyxcbi8vICAgICAnaW1nJzogJ2Nhcm9saW5lJyxcbi8vICAgICAna2V5JzogJzM2TU1NUSdcbi8vICAgfSwge1xuLy8gICAgICduYW1lJzogJ0hhbm5haCcsXG4vLyAgICAgJ2xhc3RuYW1lJzogJ0HMimtlcm1hcmsnLFxuLy8gICAgICdpbWcnOiAnaGFubmFoJyxcbi8vICAgICAna2V5JzogJzNNWlZOUSdcbi8vICAgfSwge1xuLy8gICAgICduYW1lJzogJ0pvc2VmaW5hJyxcbi8vICAgICAnbGFzdG5hbWUnOiAnTmV0dGVsbWFyaycsXG4vLyAgICAgJ2ltZyc6ICdqb3NlZmluYScsXG4vLyAgICAgJ2tleSc6ICczTTQ0RFEnXG4vLyAgIH0sIHtcbi8vICAgICAnbmFtZSc6ICcnLFxuLy8gICAgICdsYXN0bmFtZSc6ICdTbmFiYmFzdCBtb8yIamxpZ2EgdGlkJyxcbi8vICAgICAnaW1nJzogJ2RvZycsXG4vLyAgICAgJ2tleSc6ICcnXG4vLyAgIH1cbi8vIF1cblxuZXhwb3J0cy5nZXREYXRhID0gZnVuY3Rpb24gZ2V0RGF0YSAoKSB7XG4gIGNvbnN0IGRhdGEgPSBbXG4gICAge1xuICAgICAgJ25hbWUnOiAnU29maWEnLFxuICAgICAgJ2xhc3RuYW1lJzogJ1NlcHBhzIhsYcyIJyxcbiAgICAgICdpbWcnOiAnc29maWEnLFxuICAgICAgJ2tleSc6ICdRTjIyNVEnXG4gICAgfSwge1xuICAgICAgJ25hbWUnOiAnUGV0cmEnLFxuICAgICAgJ2xhc3RuYW1lJzogJ0xhcnNzb24nLFxuICAgICAgJ2ltZyc6ICdwZXRyYScsXG4gICAgICAna2V5JzogJzNEWFhaMydcbiAgICB9LCB7XG4gICAgICAnbmFtZSc6ICdDYXJvbGluZScsXG4gICAgICAnbGFzdG5hbWUnOiAnQXNwbHVuZCcsXG4gICAgICAnaW1nJzogJ2Nhcm9saW5lJyxcbiAgICAgICdrZXknOiAnMzZNTU1RJ1xuICAgIH0sIHtcbiAgICAgICduYW1lJzogJ0hhbm5haCcsXG4gICAgICAnbGFzdG5hbWUnOiAnQcyKa2VybWFyaycsXG4gICAgICAnaW1nJzogJ2hhbm5haCcsXG4gICAgICAna2V5JzogJzNNWlZOUSdcbiAgICB9LCB7XG4gICAgICAnbmFtZSc6ICdKb3NlZmluYScsXG4gICAgICAnbGFzdG5hbWUnOiAnTmV0dGVsbWFyaycsXG4gICAgICAnaW1nJzogJ2pvc2VmaW5hJyxcbiAgICAgICdrZXknOiAnM000NERRJ1xuICAgIH0sIHtcbiAgICAgICduYW1lJzogJycsXG4gICAgICAnbGFzdG5hbWUnOiAnU25hYmJhc3QgbW/MiGpsaWdhIHRpZCcsXG4gICAgICAnaW1nJzogJ2RvZycsXG4gICAgICAna2V5JzogJydcbiAgICB9XG4gIF1cbiAgcmV0dXJuIGRhdGFcbn1cbiIsImNvbnN0IGhhaXJEcmVzc2VycyA9IHJlcXVpcmUoJy4uL2RhdGEvaGFpckRyZXNzZXJzJylcbmNvbnN0IGRhdGFIYW5kbGluZyA9IHJlcXVpcmUoJy4vZGF0YS1oYW5kbGluZycpXG5jb25zdCBzbW9vdGhTY3JvbGwgPSByZXF1aXJlKCcuL3Ntb290aC1zY3JvbGwnKVxuXG4vKipcbiAqIEB0eXBlZGVmIHtIYWlyRHJlc3Nlcn0gaGFpckRyZXNzZXJzW11cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEhhaXJEcmVzc2VyXG4gKiBAcHJvcGVydHkge1N0cmluZ30gbmFtZVxuICogQHByb3BlcnR5IHtTdHJpbmd9IGxhc3RuYW1lXG4gKiBAcHJvcGVydHkge1N0cmluZ30gaW1nXG4gKiBAcHJvcGVydHkge1N0cmluZ30ga2V5XG4gKi9cblxuLyoqXG4gKiBDYWxsZWQgZnJvbSBib2R5Lm9ubG9hZCwgc3RhcnRzIHRoZSBlbnRpcmUgYXBwbGljYXRpb25cbiAqL1xuZnVuY3Rpb24gaW5pdGlhdGVQYWdlICgpIHtcbiAgaGlnaGxpZ2h0RGF5T2ZUaGVXZWVrKClcbiAgcG9wdWxhdGVIYWlyZHJlc3NlckNvbnRhaW5lcigpXG59XG5cbmZ1bmN0aW9uIGdldFRvZGF5ICgpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0RGF5KCkgPyBuZXcgRGF0ZSgpLmdldERheSgpIDogN1xufVxuXG5mdW5jdGlvbiBoaWdobGlnaHREYXlPZlRoZVdlZWsgKCkge1xuICBjb25zdCB0YXJnZXQgPSAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqLyAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI09wZW5pbmdIb3VycyA6bnRoLWNoaWxkKCcgKyBnZXRUb2RheSgpICsgJyknKSlcbiAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ3RvZGF5Jylcbn1cblxuZnVuY3Rpb24gcG9wdWxhdGVIYWlyZHJlc3NlckNvbnRhaW5lciAoKSB7XG4gIGNvbnN0IGhhaXJkcmVzc2VyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2hhaXJkcmVzc2VyQ29udGFpbmVyJylcbiAgaGFpckRyZXNzZXJzLmdldERhdGEoKS5mb3JFYWNoKGhhaXJEcmVzc2VyID0+IHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgY29uc3QgcmluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgZmlyc3ROYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4gICAgY29uc3QgbGFzdE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcblxuICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlc291cmNlQ2xpY2soaGFpckRyZXNzZXIpXG4gICAgfSlcbiAgICBjb250YWluZXIuaWQgPSBoYWlyRHJlc3Nlci5rZXlcbiAgICBpbWcuc3JjID0gJ2Fzc2V0cy9pbWcvcHJvZmlsZS8nICsgaGFpckRyZXNzZXIuaW1nICsgJy5qcGcnXG4gICAgcmluZy5jbGFzc0xpc3QuYWRkKCdyaW5nJylcbiAgICBmaXJzdE5hbWUudGV4dENvbnRlbnQgPSBoYWlyRHJlc3Nlci5uYW1lXG4gICAgbGFzdE5hbWUudGV4dENvbnRlbnQgPSBoYWlyRHJlc3Nlci5sYXN0bmFtZVxuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJpbmcpXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGltZylcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZmlyc3ROYW1lKVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYXN0TmFtZSlcbiAgICBpZiAoaGFpcmRyZXNzZXJDb250YWluZXIpIHsgaGFpcmRyZXNzZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKSB9XG4gIH0pXG59XG5cbi8qKiBAcGFyYW0ge09iamVjdH0gaGFpckRyZXNzZXIgKi9cbmZ1bmN0aW9uIHJlc291cmNlQ2xpY2sgKGhhaXJEcmVzc2VyKSB7XG4gIGFuaW1hdGVSZXNvdXJjZVJpbmcoaGFpckRyZXNzZXIpXG4gIHNob3dTZXJ2aWNlcyhoYWlyRHJlc3Nlcilcbn1cblxuLyoqIEBwYXJhbSB7SGFpckRyZXNzZXJ9IGhhaXJEcmVzc2VyICovXG5mdW5jdGlvbiBhbmltYXRlUmVzb3VyY2VSaW5nIChoYWlyRHJlc3Nlcikge1xuICBjb25zdCBjbGlja2VkRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhaXJEcmVzc2VyLmtleSlcbiAgY29uc3QgbGFzdENsaWNrZWRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJylcbiAgaWYgKGNsaWNrZWRFbGVtZW50KSB7XG4gICAgaWYgKGxhc3RDbGlja2VkRWxlbWVudCkge1xuICAgICAgbGFzdENsaWNrZWRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJylcbiAgICB9XG4gICAgY2xpY2tlZEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKVxuICB9XG59XG5cbi8qKiBAcGFyYW0ge0hhaXJEcmVzc2VyfSBoYWlyRHJlc3NlciAqL1xuZnVuY3Rpb24gc2hvd1NlcnZpY2VzIChoYWlyRHJlc3Nlcikge1xuICBkYXRhSGFuZGxpbmcuZ2V0UmVzb3VyY2VTZXR0aW5ncyhoYWlyRHJlc3Nlci5rZXkpLnRoZW4oZnVuY3Rpb24gKHJlc291cmNlU2V0dGluZ3MpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNvdXJjZVNldHRpbmdzKVxuICB9KVxufVxuXG4vKiBFeHBvcnQgcHVibGljIGZ1bmN0aW9ucyAqL1xud2luZG93Wydpbml0aWF0ZVBhZ2UnXSA9IGluaXRpYXRlUGFnZVxuIiwiLyogZ2xvYmFsIGZldGNoICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gUmVzb3VyY2VTZXR0aW5nc1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IHJlc291cmNlSWRcbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSByZXNvdXJjZU5hbWVcbiAqIEBwcm9wZXJ0eSB7U2V0dGluZ3N9IHNldHRpbmdzXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTZXR0aW5nc1xuICogQHByb3BlcnR5IHtTdHJpbmd9IGNvbXBhbnlOYW1lXG4gKiBAcHJvcGVydHkge1N0cmluZ30gY3VycmVuY3lDb2RlXG4gKiBAcHJvcGVydHkge1N0cmluZ30gcHJlZmVycmVkRTE2NENvdW50cnlDb2RlXG4gKiBAcHJvcGVydHkge1N0cmluZ30gc3RhYmxlSWRcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB3ZWJCb29raW5nTWF4RGF5c0luQWR2YW5jZVxuICogQHByb3BlcnR5IHtTdHJpbmd9IHdlYkNvbnRhY3ROdW1iZXJcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gd2ViSGlkZU5vdGVzXG4gKiBAcHJvcGVydHkge051bWJlcn0gd2ViTWluVGltZUJlZm9yZUJvb2tpbmdcbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gd2ViUmVxdWlyZUVtYWlsXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHdlYlJlcXVpcmVOb3Rlc1xuICogQHByb3BlcnR5IHtCb29sZWFufSB3ZWJSZXF1aXJlUG5vXG4gKiBAcHJvcGVydHkge0Jvb2xlYW59IHdlYlVzZVNtc1ZlcmlmaWNhdGlvblxuICovXG5cbi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHJldHVybnMge1Byb21pc2U8UmVzb3VyY2VTZXR0aW5ncz59XG4gKi9cbmV4cG9ydHMuZ2V0UmVzb3VyY2VTZXR0aW5ncyA9IGZ1bmN0aW9uIGdldFJlc291cmNlU2V0dGluZ3MgKGtleSkge1xuICByZXR1cm4gZmV0Y2goJ2h0dHBzOi8vbGl2ZWFwaTA0LmNsaWVudG8uY29tL2FwaS92aXAvc2V0dGluZ3MvJyArIGtleSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICB9KVxufVxuXG4vLyAvKiBFeHBvcnQgcHVibGljIGZ1bmN0aW9ucyAqL1xuLy8gd2luZG93WydnZXRSZXNvdXJjZVNldHRpbmdzJ10gPSBnZXRSZXNvdXJjZVNldHRpbmdzXG4iLCIndXNlIHN0cmljdCdcblxudmFyIHNjcm9sbER1cmF0aW9uID0gNTEyXG5cbmZ1bmN0aW9uIGVhc2VJbk91dFF1YWQgKHQpIHtcbiAgcmV0dXJuIHQgPCAwLjVcbiAgICA/IDIgKiB0ICogdFxuICAgIDogLTEgKyAoNCAtIDIgKiB0KSAqIHRcbn1cblxuZnVuY3Rpb24gc21vb3RoU2Nyb2xsVG8gKGhyZWYpIHtcbiAgdmFyIHN0YXJ0ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpXG4gIHZhciB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChocmVmLnN1YnN0cmluZygxKSlcblxuICB2YXIgc3RhcnRZID0gd2luZG93LnNjcm9sbFlcbiAgdmFyIGRlbHRhWSA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3BcblxuICBmdW5jdGlvbiBtb3ZlIChwb3MpIHtcbiAgICB3aW5kb3cuc2Nyb2xsKDAsIHN0YXJ0WSArIChkZWx0YVkgKiBwb3MpKVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlICh0cykge1xuICAgIHZhciBwb3MgPSAodHMgLSBzdGFydCkgLyBzY3JvbGxEdXJhdGlvblxuXG4gICAgaWYgKHBvcyA+PSAxKSB7XG4gICAgICByZXR1cm4gbW92ZSgxKVxuICAgIH1cblxuICAgIG1vdmUoZWFzZUluT3V0UXVhZChwb3MpKVxuXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpXG4gIH1cblxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSlcbn1cblxudmFyIGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc21vb3RoLXNjcm9sbCcpKVxuXG5mb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpXG4gICAgc21vb3RoU2Nyb2xsVG8oZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSlcbiAgfSlcbn1cbiJdfQ==
