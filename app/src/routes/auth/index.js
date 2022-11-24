"use strict"

import express from 'express';
import authCtrl from './authCtrl.js'
import { isLoggedIn, isNotLoggedIn } from "./middlewares.js";
const router = express.Router();

router.post('/join', isNotLoggedIn, authCtrl.join);
router.post('/login', isNotLoggedIn,authCtrl.login);
router.get('/login/check', isLoggedIn, authCtrl.loginCheck)
router.get('/logout', isLoggedIn, authCtrl.logout);

export default router;
