const express = require('express');
const mongoose = require('mongoose');
const Plate = require('./models/plate');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose
  .connect('mongodb+srv://bberrci:<password>@plates.jlccxom.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

app.get('/', (req, res) => {
  Plate.find()
    .then((plates) => {
      res.render('index', { plates });
    })
    .catch((err) => {
      console.error('Failed to fetch plates:', err);
      res.status(500).send('Failed to fetch plates');
    });
});

app.post('/add-plate', (req, res) => {
  const plateNumber = req.body.plateNumber.toLowerCase();

  const newPlate = new Plate({
    plateNumber: plateNumber,
  });

  newPlate
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error('Failed to save plate:', err);
      res.status(500).send('Failed to save plate');
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});