const { Router } = require('express');

const { createSession } = require('../controllers/SessionController');

const router = Router();

router.post('/', createSession);

module.exports = router;
