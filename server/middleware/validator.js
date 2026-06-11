import { body, validationResult } from 'express-validator';

// Standard error formatting middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(err => ({ field: err.path, message: err.msg }));
    return res.status(400).json({
      success: false,
      message: formatted[0].message,
      errors: formatted
    });
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

export const activityValidator = [
  body('category').isIn(['TRANSPORT', 'FOOD', 'ENERGY', 'SHOPPING']).withMessage('Category must be one of TRANSPORT, FOOD, ENERGY, SHOPPING'),
  body('description').trim().notEmpty().withMessage('Description is required').escape(),
  body('co2Kg').isFloat({ min: 0 }).withMessage('co2Kg must be a non-negative number'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO8601 date'),
  validate
];

export const onboardingValidator = [
  body('transport').isObject().withMessage('Transport information is required'),
  body('transport.carType').isIn(['petrol', 'diesel', 'electric', 'none']).withMessage('Invalid car type'),
  body('transport.weeklyKm').isNumeric().withMessage('Weekly kilometers must be a number'),
  body('transport.flightsPerYear').isNumeric().withMessage('Flights per year must be a number'),
  body('diet').isIn(['vegan', 'vegetarian', 'omnivore', 'heavy_meat', 'heavy meat']).withMessage('Invalid diet type'),
  body('energy').isObject().withMessage('Energy information is required'),
  body('energy.houseSize').trim().notEmpty().withMessage('House size is required'),
  body('energy.energySource').isIn(['renewable', 'mixed', 'fossil']).withMessage('Invalid energy source'),
  body('shopping').isObject().withMessage('Shopping information is required'),
  body('shopping.clothesPerMonth').isNumeric().withMessage('Clothes per month must be a number'),
  body('shopping.onlineOrdersPerMonth').isNumeric().withMessage('Online orders per month must be a number'),
  validate
];
