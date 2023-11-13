const { check } = require('express-validator');

exports.signupValidation = [
    check('username', 'Please include a valid username').not().isEmpty(),
    check('password', 'Password must be 3 or more characters').isLength({ min: 3 }),
    check('role, Please include a valid role').not().isEmpty()
]
 
exports.loginValidation = [
    check('username', 'Please include a valid username').not().isEmpty(),
    check('password', 'Password must be 3 or more characters').isLength({ min: 3 })
]