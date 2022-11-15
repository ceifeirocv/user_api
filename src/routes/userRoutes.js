const { Router } = require('express');
const auth = require('../middlewares/auth');

const {
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/UserController');

const router = Router();

router.post('/', createUser);

router.use(auth);

router.get('/', getUser);
router.put('/', updateUser);
router.delete('/', deleteUser);

module.exports = router;
