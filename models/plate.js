const mongoose = require('mongoose');

const plateSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
  },
  owned: {
    type: Boolean,
    default: false,
  },
});

const Plate = mongoose.model('Plate', plateSchema);

module.exports = Plate;