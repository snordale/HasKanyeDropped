let tooltip = $('#wave-meter-tooltip')
$('#wave-meter-container').on('click', function () {
  event.stopPropagation();
  tooltip.toggleClass('d-none')
  tooltip.toggleClass('d-inline')
})
$(window).click(function() {
  if (tooltip.hasClass('d-inline')) {
    tooltip.toggleClass('d-none')
    tooltip.toggleClass('d-inline')    
  }
});

let themes = {
  'CD': {
    'colors': [
      '#ce9748',
      '#3f1612'
    ],
    'lyrics': [
      "We ain't goin' nowhere, but got suits and cases."
    ]
  },
  'LR': {
    'colors': [
      '#634d3c',
    ],
    'lyrics': [
      'We want prenup! Yeah!'
    ]
  },
  'GR': {
    'colors': [
      '#592d82'
    ],
    'lyrics': [
      "I'm doing pretty good as far as geniuses go."
    ]
  },
  'HE': {
    'colors': [
      '#c3cccb'
    ],
    'lyrics': [
      'So amazing, so amazing.'
    ]
  },
  'MB': {
    'colors': [
      '#ce263f'
    ],
    'lyrics': [
      "Every superhero need his theme music."
    ]
  },
  'YZ': {
    'colors': [
      '#ce263f'
    ],
    'lyrics': [
      "That’s right, I’m in it."
    ]
  },
  'TL': {
    'colors': [
      '#f08d59'
    ],
    'lyrics': [
      "Party's in here, we don't need to go out!"
    ]
  },
  'YE': {
    'colors': [
      '#263e5e'
    ],
    'lyrics': [
      "They gon' have to rope me off."
    ]
  },
  'KS': {
    'colors': [
      '#e42a63'
    ],
    'lyrics': [
      "I done proved to myself, back on that rulin’ myself."
    ]
  }
}
function setTheme () {
  // wave-meter:color
  // days-since-release:color
  // main-image-container:border-color
  let keys = Object.keys(themes)
  let int = keys[Math.floor(Math.random() * keys.length)]

  let color = themes[int]['colors'][0]
  let lyric = themes[int]['lyrics'][0]

  $('#title').html(lyric)
  $('#logo-text').css('color', color)
  $('#wave-meter').css('color', color)
  $('#days-since-release').css('color', color)
  $('#main-image-container').css('border-color', color)
}

setTheme()

function initialize () {
  $.ajax({
    url: `/kanye`,
    type: 'get',
    dataType: 'json',
    statusCode: {
      404: function() {
        alert( "404 Page Not Found" );
      },
      400: function() {
        alert( "400 Bad Request" );
      },
      500: function() {
        alert( "500 Spotify Server Error" );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(`/artists call textStatus: ${textStatus}`)
    },
    success: function(data) {
      $('#wave-meter').html(`${data.kanye.popularity}%.`)

      if (data.albums.order.length == 12) {
        $('#main-image').attr('src', data.kanye.imageUrl)
        $('#donda-tracker').html('')
        $('#donda-tracker').append($(`
          <div class='d-inline'>
            <img src='/images/gifs/shrug.gif' style='width: 50px;'>
          </div>
          <div class='px-2'>Kanye hasn't dropped yet.</div>
          <div class='d-inline'>
            <img src='/images/gifs/blank-stare.gif' style='width: 50px;'
          </div>
        `))
        $('#main-image-container').css('border-color', '#ff0015')
        $('#overlay-text').html('No')
        $('#overlay-text').css('color', '#ff0015')
      }
      else {
        let newAlbum = data.albums.data[data.albums.order[0]]
        $('#main-image').attr('src', newAlbum.imageUrl)
        $('#main-image-container').css('border-color', '#00cc2f')
        $('#overlay-text').html('Yes')
        
        $('#overlay-text').css('color', '#00cc2f')
        $('#subtitle').css('display', 'none')
        $('#subtitle').removeClass('d-inline')
        let date = newAlbum.releaseDate.split('-')
        $('#donda-tracker').html('')
        $('#donda-tracker').append($(`
          <div class='d-inline'>
            <img src='/images/gifs/lit.gif' style='width: 50px;'>
          </div>
          <a href='${newAlbum.uri}' class=' touchable px-2'>${newAlbum.name} dropped on ${date[1]}.${date[2]}.${date[0]}</a>
          <div class='d-inline'>
            <img src='/images/gifs/sprinting.gif' style='width: 50px;'
          </div>
        `))

      }

      let currentDatetime = new Date()
      let releaseDate = new Date(`${data.albums.data['JESUS IS KING'].releaseDate}`)

      $('#days-since-release').html(Math.trunc((currentDatetime - releaseDate) / (1000*60*60*24)))

      let album;
      $('#album-list').append($.map(data.albums.order, function (albumName) {
        album = data.albums.data[albumName]
        releaseDate = new Date(album['releaseDate'])
        return $(`
        <div class='d-flex row justify-content-center py-4'>
          <a href='${album['uri']}' class='touchable'>
            <div class='d-flex flex-column align-items-center p-4 rounded'>
              <img style='width: 200px; height: 200px; border-radius: 12px;' src='${album['imageUrl']}'>
              <div class='d-inline text-center text-break pt-3 small font-weight-bold'>${album['name']}</div>
              <div class='d-inline pt-1 small font-weight-bold text-truncate'>${releaseDate.getMonth()+1}.${releaseDate.getDate()}.${releaseDate.getFullYear()}</div>
            </div>
          </a>
        </div>
        `)
      }))
    }
  });
}

initialize()