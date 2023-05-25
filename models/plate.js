const mongoose = require('mongoose');

const plateSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
  },
});

const Plate = mongoose.model('Plate', plateSchema);

module.exports = Plate;