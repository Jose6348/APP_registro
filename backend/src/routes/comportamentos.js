const express = require('express');
const router = express.Router();
const Comportamento = require('../models/Comportamento');

// Get all behavior records
router.get('/', async (req, res) => {
  try {
    const comportamentos = await Comportamento.find().populate('alunoId', 'name');
    res.json(comportamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get behavior records by student ID
router.get('/aluno/:alunoId', async (req, res) => {
  try {
    const comportamentos = await Comportamento.find({ alunoId: req.params.alunoId }).populate('alunoId', 'name');
    res.json(comportamentos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new behavior record
router.post('/', async (req, res) => {
  const comportamento = new Comportamento({
    alunoId: req.body.alunoId,
    data: new Date(req.body.data),
    observacao: req.body.observacao
  });

  try {
    const novoComportamento = await comportamento.save();
    const populatedComportamento = await Comportamento.findById(novoComportamento._id).populate('alunoId', 'name');
    res.status(201).json(populatedComportamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update behavior record
router.put('/:id', async (req, res) => {
  try {
    const comportamento = await Comportamento.findById(req.params.id);
    if (!comportamento) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }

    if (req.body.data) comportamento.data = new Date(req.body.data);
    if (req.body.observacao) comportamento.observacao = req.body.observacao;

    const updatedComportamento = await comportamento.save();
    const populatedComportamento = await Comportamento.findById(updatedComportamento._id).populate('alunoId', 'name');
    res.json(populatedComportamento);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete behavior record
router.delete('/:id', async (req, res) => {
  try {
    const comportamento = await Comportamento.findById(req.params.id);
    if (!comportamento) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }

    await comportamento.deleteOne();
    res.json({ message: 'Registro excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 