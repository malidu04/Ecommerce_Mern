const express = require('express');
const router = express.Router();

const {
  create,
  categoryById,
  read,
  update,
  remove,
  list
} = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/category/:categoryId', read);               // GET a category by ID
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);  // POST to create category
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update); // PUT to update category
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove); // DELETE category
router.get('/categories', list); // GET all categories


router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;