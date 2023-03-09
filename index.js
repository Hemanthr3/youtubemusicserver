const express = require("express");
const cors = require("cors");
const request = require("request");
var querystring = require("querystring");
const app = express();
app.use(cors());

var redirect_uri = "http://localhost:5001/callback";
var client_id = "7aab3d176e08460a97552c709b9344cc";
var client_secret = "8fe72653059942749d6bfe50a9a3d9c0";
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  var scope =
    "user-read-private user-read-email user-read-currently-playing streaming user-read-recently-played user-top-read user-read-playback-state user-library-read user-library-modify user-follow-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
      })
  );
});

app.get("/callback", (req, res) => {
  var code = req.query.code || null;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const { access_token, refresh_token } = body;
      res.redirect(
        `http://localhost:3000/authorize?access_token=${access_token}&refresh_token=${refresh_token}`
      );
    }
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
