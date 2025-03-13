const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'כתובת אימייל לא תקינה',
      'string.empty': 'אימייל הוא שדה חובה',
      'any.required': 'אימייל הוא שדה חובה'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'סיסמה חייבת להכיל לפחות 6 תווים',
      'string.empty': 'סיסמה היא שדה חובה',
      'any.required': 'סיסמה היא שדה חובה'
    }),
  name: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.min': 'שם חייב להכיל לפחות 2 תווים',
      'string.empty': 'שם הוא שדה חובה',
      'any.required': 'שם הוא שדה חובה'
    })
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'כתובת אימייל לא תקינה',
      'string.empty': 'אימייל הוא שדה חובה',
      'any.required': 'אימייל הוא שדה חובה'
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'סיסמה היא שדה חובה',
      'any.required': 'סיסמה היא שדה חובה'
    })
});

module.exports = {
  registerSchema,
  loginSchema
}; 