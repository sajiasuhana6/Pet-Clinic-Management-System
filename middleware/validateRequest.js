// middleware/validateRequest.js

// validates that required fields exist in req.body
export const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(
      (field) =>
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === "",
    );

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    next();
  };
};

// validates that req.params.id is a valid positive integer
export const validateId = (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: `Invalid ID: "${req.params.id}". Must be a positive integer.`,
    });
  }

  next();
};

// validates that req.query.date is a valid YYYY-MM-DD date
export const validateDate = (req, res, next) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: 'Query parameter "date" is required',
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return res.status(400).json({
      success: false,
      error: `Invalid date format: "${date}". Use YYYY-MM-DD.`,
    });
  }

  next();
};
