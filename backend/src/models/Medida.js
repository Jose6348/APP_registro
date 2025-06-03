const mongoose = require('mongoose');

const medidaSchema = new mongoose.Schema({
  alunoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  peso: {
    type: Number,
    required: true
  },
  altura: {
    type: Number,
    required: true
  },
  circunferenciaBraco: {
    type: Number,
    required: true
  },
  circunferenciaCintura: {
    type: Number,
    required: true
  },
  circunferenciaQuadril: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medida', medidaSchema); 