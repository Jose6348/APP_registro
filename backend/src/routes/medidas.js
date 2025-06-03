const express = require('express');
const router = express.Router();
const Medida = require('../models/Medida');

// Get all measurements
router.get('/', async (req, res) => {
  try {
    const medidas = await Medida.find().populate('alunoId', 'name');
    res.json(medidas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get measurements by student ID
router.get('/aluno/:alunoId', async (req, res) => {
  try {
    const medidas = await Medida.find({ alunoId: req.params.alunoId }).populate('alunoId', 'name');
    res.json(medidas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new measurement
router.post('/', async (req, res) => {
  const medida = new Medida({
    alunoId: req.body.alunoId,
    data: new Date(req.body.data),
    peso: parseFloat(req.body.peso),
    altura: parseFloat(req.body.altura),
    circunferenciaBraco: parseFloat(req.body.circunferenciaBraco),
    circunferenciaCintura: parseFloat(req.body.circunferenciaCintura),
    circunferenciaQuadril: parseFloat(req.body.circunferenciaQuadril)
  });

  try {
    const novaMedida = await medida.save();
    const populatedMedida = await Medida.findById(novaMedida._id).populate('alunoId', 'name');
    res.status(201).json(populatedMedida);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update measurement
router.put('/:id', async (req, res) => {
  try {
    const medida = await Medida.findById(req.params.id);
    if (!medida) {
      return res.status(404).json({ message: 'Medida não encontrada' });
    }

    if (req.body.data) medida.data = new Date(req.body.data);
    if (req.body.peso) medida.peso = parseFloat(req.body.peso);
    if (req.body.altura) medida.altura = parseFloat(req.body.altura);
    if (req.body.circunferenciaBraco) medida.circunferenciaBraco = parseFloat(req.body.circunferenciaBraco);
    if (req.body.circunferenciaCintura) medida.circunferenciaCintura = parseFloat(req.body.circunferenciaCintura);
    if (req.body.circunferenciaQuadril) medida.circunferenciaQuadril = parseFloat(req.body.circunferenciaQuadril);

    const updatedMedida = await medida.save();
    const populatedMedida = await Medida.findById(updatedMedida._id).populate('alunoId', 'name');
    res.json(populatedMedida);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete measurement
router.delete('/:id', async (req, res) => {
  try {
    const medida = await Medida.findById(req.params.id);
    if (!medida) {
      return res.status(404).json({ message: 'Medida não encontrada' });
    }

    await medida.deleteOne();
    res.json({ message: 'Medida excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 