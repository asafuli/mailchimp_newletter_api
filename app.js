const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Post signup
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  //Validate fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us19.api.mailchimp.com/3.0/lists/cce095dbef',
    method: 'POST',
    headers: { Authorization: 'auth bb75632638e2ac29615f852bb31dbdc3-us19' },
    body: postData
  };

  request(options, (err, response, body) => {
    if (response && response.statusCode === 200) {
      res.redirect('/success.html');
    } else {
      res.redirect('/fail.html');
    }
  });
});

app.listen(port, (req, res) => {
  console.log(`server started on ${port}`);
});
