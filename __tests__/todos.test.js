const request = require('supertest');
const app = require('../src/app');
const TodoModel = require('../src/models/todo');

describe('Todo API', () => {
  // Clear todos before each test
  beforeEach(() => {
    TodoModel.clear();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /todos', () => {
    it('should return empty array when no todos exist', async () => {
      const res = await request(app).get('/todos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all todos', async () => {
      TodoModel.create({ title: 'Todo 1' });
      TodoModel.create({ title: 'Todo 2' });

      const res = await request(app).get('/todos');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Todo 1');
      expect(res.body[1].title).toBe('Todo 2');
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a single todo', async () => {
      const todo = TodoModel.create({ title: 'Test Todo', description: 'Test Description' });

      const res = await request(app).get(`/todos/${todo.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(todo.id);
      expect(res.body.title).toBe('Test Todo');
      expect(res.body.description).toBe('Test Description');
      expect(res.body.completed).toBe(false);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app).get('/todos/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Todo not found');
    });

    it('should return 400 for invalid UUID', async () => {
      const res = await request(app).get('/todos/invalid-id');
      expect(res.status).toBe(400);
      expect(res.body.errors[0].field).toBe('id');
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'New Todo', description: 'New Description' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Todo');
      expect(res.body.description).toBe('New Description');
      expect(res.body.completed).toBe(false);
      expect(res.body.id).toBeDefined();
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();
    });

    it('should create todo without description', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Todo without description' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Todo without description');
      expect(res.body.description).toBe('');
    });

    it('should trim whitespace from title', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: '  Trimmed Title  ' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Trimmed Title');
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ description: 'Only description' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'title',
        message: 'Title is required'
      });
    });

    it('should return 400 when title is empty', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: '' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'title',
        message: 'Title cannot be empty'
      });
    });

    it('should return 400 when title is only whitespace', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'title',
        message: 'Title cannot be empty'
      });
    });

    it('should return 400 when title exceeds 200 characters', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'a'.repeat(201) });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'title',
        message: 'Title cannot exceed 200 characters'
      });
    });

    it('should return 400 when title is not a string', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 123 });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'title',
        message: 'Title must be a string'
      });
    });

    it('should return 400 when description is not a string', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Valid Title', description: 123 });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'description',
        message: 'Description must be a string'
      });
    });

    it('should return 400 when description exceeds 1000 characters', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Valid Title', description: 'a'.repeat(1001) });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'description',
        message: 'Description cannot exceed 1000 characters'
      });
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update todo title', async () => {
      const todo = TodoModel.create({ title: 'Original Title' });

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.id).toBe(todo.id);
    });

    it('should update todo description', async () => {
      const todo = TodoModel.create({ title: 'Title', description: 'Original' });

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ description: 'Updated Description' });

      expect(res.status).toBe(200);
      expect(res.body.description).toBe('Updated Description');
    });

    it('should update todo completed status', async () => {
      const todo = TodoModel.create({ title: 'Title' });

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('should update multiple fields at once', async () => {
      const todo = TodoModel.create({ title: 'Original' });

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ title: 'New Title', description: 'New Desc', completed: true });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New Title');
      expect(res.body.description).toBe('New Desc');
      expect(res.body.completed).toBe(true);
    });

    it('should preserve createdAt on update', async () => {
      const todo = TodoModel.create({ title: 'Title' });
      const originalCreatedAt = todo.createdAt;

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ title: 'Updated' });

      expect(res.body.createdAt).toBe(originalCreatedAt);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .put('/todos/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Todo not found');
    });

    it('should return 400 for invalid UUID', async () => {
      const res = await request(app)
        .put('/todos/invalid-id')
        .send({ title: 'Updated' });

      expect(res.status).toBe(400);
    });

    it('should return 400 when no fields provided', async () => {
      const todo = TodoModel.create({ title: 'Title' });

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'body',
        message: 'At least one field (title, description, or completed) must be provided'
      });
    });

    it('should return 400 when title is empty string', async () => {
      const todo = TodoModel.create({ title: 'Title' });

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ title: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 when completed is not boolean', async () => {
      const todo = TodoModel.create({ title: 'Title' });

      const res = await request(app)
        .put(`/todos/${todo.id}`)
        .send({ completed: 'yes' });

      expect(res.status).toBe(400);
      expect(res.body.errors).toContainEqual({
        field: 'completed',
        message: 'Completed must be a boolean'
      });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = TodoModel.create({ title: 'To Delete' });

      const res = await request(app).delete(`/todos/${todo.id}`);
      expect(res.status).toBe(204);

      // Verify it's deleted
      const getRes = await request(app).get(`/todos/${todo.id}`);
      expect(getRes.status).toBe(404);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app).delete('/todos/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Todo not found');
    });

    it('should return 400 for invalid UUID', async () => {
      const res = await request(app).delete('/todos/invalid-id');
      expect(res.status).toBe(400);
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });
  });
});
