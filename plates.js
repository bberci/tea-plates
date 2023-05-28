const express = require('express');
const mongoose = require('mongoose');
const Plate = require('./models/plate');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose
  .connect('mongodb+srv://bberrci:wS6oSNaJucekwSi2@plates.jlccxom.mongodb.net/?retryWrites=true&w=majority', {
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
        const plateNumbers = plates.map((plate) => plate.plateNumber);
        const ownedCount = plateNumbers.filter(isOwned).length;
        const totalPlates = 999; // Total number of plates from TEA-001 to TEA-999
        res.render('index', { plates: plateNumbers, ownedCount, totalPlates });
        console.log(plateNumbers);
      })
      .catch((err) => {
        console.error('Failed to fetch plates:', err);
        res.status(500).send('Failed to fetch plates');
      });
  });

  function isOwned(plate) {
    return !plate.owned;
  }
  
  app.post('/add-plate', (req, res) => {
    const plateNumber = req.body.plateNumber.toUpperCase();
  
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

  app.post('/delete-plate', (req, res) => {
    const plateNumber = req.body.plateNumber.toUpperCase();
  
    Plate.findOneAndDelete({ plateNumber: plateNumber })
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        console.error('Failed to delete plate:', err);
        res.status(500).send('Failed to delete plate');
      });
  });
  
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000');
  });
  
  function generatePlateNumbers() {
    const plateNumbers = [];
    for (let i = 1; i <= 999; i++) {
      const paddedNumber = i.toString().padStart(3, '0');
      plateNumbers.push(`TEA-${paddedNumber}`);
    }
    return plateNumbers;
  }