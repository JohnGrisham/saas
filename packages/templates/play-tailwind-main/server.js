const express = require('express');
const app = express();
const port = 8080;

const handlebars = require('express-handlebars');
const { formatField } = require('../src/helpers/handlebars/formatField.js');

app.set('view engine', 'handlebars');
app.engine(
  'handlebars',
  handlebars.engine({
    helpers: {
      formatField,
    },
  }),
);
app.use(express.static('public'));
app.get('/', (_req, res) => {
  res.render('home', {
    hero: {
      cta: 'Try Now',
      header: 'test',
    },
    signedin: process.env.SIGNEDIN ?? false,
  });
});

app.listen(port, () => console.log(`App listening to port ${port}`));
