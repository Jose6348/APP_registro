const express = require('express');
const router = express.Router();
const SinalVital = require('../models/SinalVital');

// Get all vital signs
router.get('/', async (req, res) => {
  try {
    const sinais = await SinalVital.find().populate('alunoId', 'name');
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vital signs by student ID
router.get('/aluno/:alunoId', async (req, res) => {
  try {
    const sinais = await SinalVital.find({ alunoId: req.params.alunoId }).populate('alunoId', 'name');
    res.json(sinais);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new vital sign record
router.post('/', async (req, res) => {
  const sinalVital = new SinalVital({
    alunoId: req.body.alunoId,
    data: new Date(req.body.data),
    pressaoArterial: req.body.pressaoArterial,
    frequenciaCardiaca: parseInt(req.body.frequenciaCardiaca),
    frequenciaRespiratoria: parseInt(req.body.frequenciaRespiratoria)
  });

  try {
    const novoSinal = await sinalVital.save();
    const populatedSinal = await SinalVital.findById(novoSinal._id).populate('alunoId', 'name');
    res.status(201).json(populatedSinal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update vital sign record
router.put('/:id', async (req, res) => {
  try {
    const sinalVital = await SinalVital.findById(req.params.id);
    if (!sinalVital) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }

    if (req.body.data) sinalVital.data = new Date(req.body.data);
    if (req.body.pressaoArterial) sinalVital.pressaoArterial = req.body.pressaoArterial;
    if (req.body.frequenciaCardiaca) sinalVital.frequenciaCardiaca = parseInt(req.body.frequenciaCardiaca);
    if (req.body.frequenciaRespiratoria) sinalVital.frequenciaRespiratoria = parseInt(req.body.frequenciaRespiratoria);

    const updatedSinal = await sinalVital.save();
    const populatedSinal = await SinalVital.findById(updatedSinal._id).populate('alunoId', 'name');
    res.json(populatedSinal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete vital sign record
router.delete('/:id', async (req, res) => {
  try {
    const sinalVital = await SinalVital.findById(req.params.id);
    if (!sinalVital) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }

    await sinalVital.deleteOne();
    res.json({ message: 'Registro excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 