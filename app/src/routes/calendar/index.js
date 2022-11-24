"use strict"

import express from 'express';
import calendarCtrl from "./calendar.ctrl.js";

const router = express.Router();


router.get("/", calendarCtrl.getCalendarInfo);
router.get("/approval", calendarCtrl.getApprovalInfo);
router.get("/:id", calendarCtrl.getCalendarId);
router.post("/", calendarCtrl.createCalendarInfo);
router.put("/:index", calendarCtrl.updateCalendarInfo);
router.delete("/:index", calendarCtrl.deleteCalendarInfo);

export default router;
