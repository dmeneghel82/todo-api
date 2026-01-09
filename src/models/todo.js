const crypto = require('crypto');

// In-memory storage
let todos = [];

const TodoModel = {
  // Get all todos
  findAll() {
    return [...todos];
  },

  // Get a single todo by ID
  findById(id) {
    return todos.find(todo => todo.id === id) || null;
  },

  // Create a new todo
  create(data) {
    const todo = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    todos.push(todo);
    return todo;
  },

  // Update a todo
  update(id, data) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return null;
    }

    const updated = {
      ...todos[index],
      ...data,
      id: todos[index].id, // Prevent ID change
      createdAt: todos[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };
    todos[index] = updated;
    return updated;
  },

  // Delete a todo
  delete(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      return false;
    }
    todos.splice(index, 1);
    return true;
  },

  // Clear all todos (useful for testing)
  clear() {
    todos = [];
  }
};

module.exports = TodoModel;
