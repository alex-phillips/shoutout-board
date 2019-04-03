// https://codepen.io/edmondko/pen/udcHG

(function ($) {
  /**
   * Auto-growing textareas; technique ripped from Facebook
   *
   * https://github.com/jaz303/jquery-grab-bag/tree/master/javascripts/jquery.autogrow-textarea.js
   */
  $.fn.autogrow = function (options) {
    return this.filter('textarea').each(function () {
      var self = this
      var $self = $(self)
      var minHeight = $self.height()
      var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0

      var shadow = $('<div></div>').css({
        position: 'absolute',
        top: -10000,
        left: -10000,
        width: $self.width(),
        fontSize: $self.css('fontSize'),
        fontFamily: $self.css('fontFamily'),
        fontWeight: $self.css('fontWeight'),
        lineHeight: $self.css('lineHeight'),
        resize: 'none',
        'word-wrap': 'break-word'
      }).appendTo(document.body)

      var update = function (event) {
        var times = function (string, number) {
          for (var i = 0, r = ''; i < number; i++) r += string
          return r
        }

        var val = self.value.replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n$/, '<br/>&nbsp;')
          .replace(/\n/g, '<br/>')
          .replace(/ {2,}/g, function (space) {
            return times('&nbsp;', space.length - 1) + ' '
          })

        // Did enter get pressed?  Resize in this keydown event so that the flicker doesn't occur.
        if (event && event.data && event.data.event === 'keydown' && event.keyCode === 13) {
          val += '<br />'
        }

        shadow.css('width', $self.width())
        shadow.html(val + (noFlickerPad === 0 ? '...' : '')) // Append '...' to resize pre-emptively.
        $self.height(Math.max(shadow.height() + noFlickerPad, minHeight))
      }

      $self.change(update).keyup(update).keydown({
        event: 'keydown'
      }, update)
      $(window).resize(update)

      update()
    })
  }
})(jQuery)

var notes = []

var noteTemp = '<div class="note">' +
  // '<a href="javascript:;" class="button remove">X</a>' +
  '<div class="note_cnt">' +
  '<textarea class="title" placeholder="Enter note title"></textarea>' +
  // '<textarea class="cnt" placeholder="Enter note description here"></textarea>' +
  '</div> ' +
  '</div>'

var noteZindex = 1

function deleteNote () {
  $(this).parent('.note').hide('puff', {
    percent: 133
  }, 250)
};

function newNote (body, id) {
  var randomSkew = randomNumber(5)
  if (randomSkew !== 0 && Math.round(Math.random()) === 0) {
    randomSkew = '-' + randomSkew
  }

  var colors = [
    {
      background: '#faaaca', // pink
      foregrounds: [
        '#15f4ee', // neon blue
        '#ccff15', // yellow
        '#000' // black
      ]
    },
    {
      background: '#69f098', // green
      foregrounds: [
        '#ccff15', // yellow
        '#000'
      ]
    },
    {
      background: '#fffd75', // yellow
      foregrounds: [
        '#15f4ee', // neon blue
        '#000' // black
      ]
    }
  ]

  var color = colors[Math.floor(Math.random() * colors.length)]

  var newnote = $(noteTemp)
  newnote.attr('data-id', id)
  newnote.css('transform', 'skew(' + randomSkew + 'deg, ' + (randomSkew * -1) + 'deg)')
  newnote.find('textarea').css('color', color.foregrounds[Math.floor(Math.random() * color.foregrounds.length)])
  newnote.css('background', color.background)
  newnote.find('textarea').val(body)

  console.log($(document).width())
  console.log($(document).height())

  newnote.prependTo('#board')

  // newnote.find('textarea').autogrow()
  newnote.show()
  // newnote.draggable()

  notes.push(newnote)
  if (notes.length > 15) {
    notes.shift().remove()
  }
  return false
};

function randomNumber (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

$(document).ready(function () {
  // Get initial load notes
  fetch('http://192.168.53.251:3000/shoutouts')
    .then(function (response) {
      return response.json()
    })
    .then(function (shoutouts) {
      for (var shoutout of shoutouts.reverse()) {
        switch (shoutout.type) {
          case 'twitter':
            newNote(JSON.parse(shoutout.body).text, shoutout.id)
            break
          default:
            newNote(shoutout.body, shoutout.id)
        }
      }
    })

  $('#board').height($(document).height() - 180)

  $('#add_new').click(newNote)

  $('.remove').click(deleteNote)

  var socket = io('http://192.168.53.251:3000')
  socket.on('shoutout', function (shoutout) {
    console.log(shoutout.body)
    switch (shoutout.type) {
      case 'twitter':
        newNote(JSON.parse(shoutout.body).text, shoutout.id)
        break
      default:
        newNote(shoutout.body, shoutout.id)
    }
  })

  socket.on('shoutout-delete', function (id) {
    for (let index in notes) {
      if (notes[index].attr('data-id') == id) {
        notes[index].remove()
        delete (notes[index])
        notes = notes.filter(function () { return true })
        break
      }
    }
  })

  return false
})
