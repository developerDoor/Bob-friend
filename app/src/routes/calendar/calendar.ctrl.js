"use strict"

import CalendarStorage from '../../models/CalendarStorage.js'

// GET 컨트롤러
async function getCalendarInfo(req, res, next) {
    try {
        const request = req.query;
        const result = await CalendarStorage.getCalendarInfo(request.year,request.month);

        return res.send(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

async function getCalendarId(req, res, next) {
    try {
        const request = req.params.id;
        const result = await CalendarStorage.getCalendarId(request);

        return res.send(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

// POST 컨트롤러
async function createCalendarInfo(req, res, next) {
    try {
        const result = await CalendarStorage.createCalendarInfo(req.body);
        res.json(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

// PUT 컨트롤러
async function updateCalendarInfo(req, res, next) {
    try {
        const result = await CalendarStorage.updateCalendarInfo(req.params, req.body);
        res.json(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

// DELETE 컨트롤러
async function deleteCalendarInfo(req, res, next) {
    try {
        const result = await CalendarStorage.deleteCalendarInfo(req.params);
        res.json(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

// GET 전자결재 컨트롤러
async function getApprovalInfo(req, res, next) {
    try {
        const request = req.query;
        const result = await CalendarStorage.getApprovalInfo(request.year,request.month);
        return res.send(result.rows);
    } catch (err) {
        return res.status(400).json(err);
    }
}


export default {
    getCalendarInfo,
    getCalendarId,
    createCalendarInfo,
    updateCalendarInfo,
    deleteCalendarInfo,
    getApprovalInfo
};