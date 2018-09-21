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
