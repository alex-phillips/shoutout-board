// https://codepen.io/edmondko/pen/udcHG

var HOST_URL = '192.168.53.251:3000'

var notes = []

var noteTemp = '<div class="note">' +
  // '<a href="javascript:;" class="button remove">X</a>' +
  '<div class="note_cnt">' +
  '<div class="body-container"><div class="body-content"></div></div>' +
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
        // '#ccff15', // yellow
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

  var images = [
    'hex_blue',
    'hex_green',
    'hex_light_blue',
    'hex_orange',
    'hex_purple',
    'hex_red',
    'hex_yellow_green'
  ]

  var image = images[Math.floor(Math.random() * images.length)]

  var newnote = $(noteTemp)
  newnote.attr('data-id', id)
  // newnote.css('transform', 'skew(' + randomSkew + 'deg, ' + (randomSkew * -1) + 'deg)')
  // newnote.find('textarea').css('color', color.foregrounds[Math.floor(Math.random() * color.foregrounds.length)])
  // newnote.css('background', 'url(' + image + ')')
  newnote.addClass(image)
  newnote.find('div.body-content').html(twemoji.parse(body))

  console.log($(document).width())
  console.log($(document).height())

  newnote.prependTo('#board')

  // newnote.find('textarea').autogrow()
  newnote.show()
  // newnote.draggable()

  notes.push(newnote)
  if (notes.length > 10) {
    notes.shift().remove()
  }

  return false
};

function randomNumber (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

$(document).ready(function () {
  // Get initial load notes
  fetch('http://' + HOST_URL + '/shoutouts')
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

  fetch('http://' + HOST_URL + '/settings')
    .then(function (response) {
      return response.json()
    })
    .then(function (settings) {
      for (let setting of settings) {
        if (setting.identifier === 'motd_header') {
          $('#motd p').text(setting.value)
        }

        if (setting.identifier === 'motd_body') {
          console.log(setting)
          $('div#motd-body').html(twemoji.parse(setting.value))
        }
      }
    })

  $('#board').height($(document).height() - 180)

  $('#add_new').click(newNote)

  $('.remove').click(deleteNote)

  // var socket = io('http://192.168.53.251:3000')
  var socket = io('http://' + HOST_URL + '')
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

  socket.on('settings_updated', function () {
    location.reload()
  })

  return false
})
