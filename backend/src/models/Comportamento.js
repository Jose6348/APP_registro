const mongoose = require('mongoose');

const comportamentoSchema = new mongoose.Schema({
  alunoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  observacao: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comportamento', comportamentoSchema); 