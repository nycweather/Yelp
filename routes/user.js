const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require("passport");
const users = require('../controllers/users')

router.route('/register')
    .get(users.userRender)
    .post(catchAsync(users.userRegister));

router.get('/login', users.userLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.userLoginFlash);

router.get('/logout', users.userLogout);

module.exports = router;