// Validation middleware for todo operations

const validateTodoCreate = (req, res, next) => {
  const { title } = req.body;
  const errors = [];

  // Title is required
  if (title === undefined || title === null) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (typeof title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'Title cannot exceed 200 characters' });
  }

  // Description is optional but must be a string if provided
  if (req.body.description !== undefined) {
    if (typeof req.body.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (req.body.description.length > 1000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateTodoUpdate = (req, res, next) => {
  const { title, description, completed } = req.body;
  const errors = [];

  // At least one field must be provided
  if (title === undefined && description === undefined && completed === undefined) {
    errors.push({ field: 'body', message: 'At least one field (title, description, or completed) must be provided' });
  }

  // Title validation (if provided)
  if (title !== undefined) {
    if (typeof title !== 'string') {
      errors.push({ field: 'title', message: 'Title must be a string' });
    } else if (title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.length > 200) {
      errors.push({ field: 'title', message: 'Title cannot exceed 200 characters' });
    }
  }

  // Description validation (if provided)
  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (description.length > 1000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 1000 characters' });
    }
  }

  // Completed validation (if provided)
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push({ field: 'completed', message: 'Completed must be a boolean' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateUUID = (req, res, next) => {
  const { id } = req.params;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(id)) {
    return res.status(400).json({
      errors: [{ field: 'id', message: 'Invalid ID format' }]
    });
  }

  next();
};

module.exports = {
  validateTodoCreate,
  validateTodoUpdate,
  validateUUID
};
