const express = require('express');

const app = express();

const router = express.Router();

const path = require('path')

let accessToken;
let request = require('request');

let album_ids = new Set([
  '0FgZKfoU2Br5sHOfvZKTI9',
  '6pwuKxMUkNg673KETsXPUV',
  '2Ek1q2haOnxVqhvVKqMvJe',
  '7gsWAHLeT0w7es6FofOXk1',
  '7D2NdGvBHIavgLhmcwhluK',
  '0A3g19AGFd9Qe3rAIkP8e0',
  '7mCeLbChyegbRwwKK5shJs',
  '20r762YmB5HeofjMCiPMLv',
  '3WFTGIO6E3Xh4paEOBY9OU',
  '5fPglEDz9YEwRgbLRvhCZy',
  '5ll74bqtkcXlKE7wwkMq4g',
  '4Uv86qWpGTxf7fU7lG5X6F',
])

function getKanye () {
  return new Promise((resolve, reject) => {
    let client_id = 'REDACTED';
    let client_secret = 'REDACTED';

    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        accessToken = body.access_token;
        let options = {
          url: `https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x`,
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          json: true
        };

        request.get(options, function(error, response, body) {
          return resolve({
            'artist': body.name,
            'uri': body.uri,
            'popularity': body.popularity,
            'imageUrl': body.images[0].url
          })
        });
      }
    });
  })
}

function getAlbums () {
  return new Promise((resolve, reject) => {
    options = {
      url: `https://api.spotify.com/v1/artists/5K4W6rqBFWDnAN6FQUkS6x/albums?market=US&limit=50`,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      json: true
    };

    request.get(options, function(error, response, body) {
      let albums = {
        'data': {},
        'order': []
      }

      // Simulate Album Release
      // albums['data']['yuck'] = {
      //   'name': 'yuck',
      //   'uri': 'spotify:track:3MnbXlC1N7GdS9M8HzA6no',
      //   'releaseDate': '2021-09-11',
      //   'imageUrl': 'https://images.unsplash.com/reserve/aOcWqRTfQ12uwr3wWevA_14401305508_804b300054_o.jpg?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1055&q=80'
      // }
      // albums['order'].push('yuck')


      body.items.forEach((album) => {
        let today = new Date('2021-08-10')

        let releaseDate = new Date(album.release_date)

        if (!(album.name in albums.data) && (album_ids.has(album.id) || releaseDate > today)) {
          albums.order.push(album.name)
          albums.data[album.name] = {
            'name': album.name,
            'uri': album.uri,
            'imageUrl': album.images[0].url,
            'releaseDate': album.release_date
          }
        }
      });
      return resolve(albums)
    });
  })
}

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/', router);

router.get('/kanye', async function(req, res){
  res.setHeader('Content-Type', 'application/json');
  let kanye = await getKanye()
  let albums = await getAlbums()
  res.end(JSON.stringify({
    'kanye': kanye,
    'albums': albums
  }));
});

app.use('/kanye', router);

app.use(express.static(path.join(__dirname, 'public')))

let server = app.listen(3000, function() {
  console.log("App server is running on port 3000");
});
