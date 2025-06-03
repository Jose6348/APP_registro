const mongoose = require('mongoose');

const sinalVitalSchema = new mongoose.Schema({
  alunoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  pressaoArterial: {
    type: String,
    required: true
  },
  frequenciaCardiaca: {
    type: Number,
    required: true
  },
  frequenciaRespiratoria: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SinalVital', sinalVitalSchema); 