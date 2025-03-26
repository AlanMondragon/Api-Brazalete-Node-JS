const express = require('express');
const router = express.Router();
const passwordController = require('./../controllers/passwordController');

router.post('./request-reset', passwordController.requestPasswordReset);
router.post('./reset-password', passwordController.resetPassword);

module.exports = router;