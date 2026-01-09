const express = require('express');
const TodoModel = require('../models/todo');
const { validateTodoCreate, validateTodoUpdate, validateUUID } = require('../middleware/validation');

const router = express.Router();

// GET /todos - List all todos
router.get('/', (req, res) => {
  const todos = TodoModel.findAll();
  res.json(todos);
});

// GET /todos/:id - Get a single todo
router.get('/:id', validateUUID, (req, res) => {
  const todo = TodoModel.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

// POST /todos - Create a new todo
router.post('/', validateTodoCreate, (req, res) => {
  const { title, description } = req.body;
  const todo = TodoModel.create({ title: title.trim(), description: description?.trim() });
  res.status(201).json(todo);
});

// PUT /todos/:id - Update a todo
router.put('/:id', validateUUID, validateTodoUpdate, (req, res) => {
  const { title, description, completed } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (completed !== undefined) updateData.completed = completed;

  const todo = TodoModel.update(req.params.id, updateData);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

// DELETE /todos/:id - Delete a todo
router.delete('/:id', validateUUID, (req, res) => {
  const deleted = TodoModel.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(204).send();
});

module.exports = router;
