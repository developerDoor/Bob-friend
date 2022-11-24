"use strict"
import express from 'express';
import {
    getSuggestedFood,
    suggestFood,
    updateSuggestedFood,
    getBobFriend,
    getThisWeekIndex,
    getBobFriendNew,
    likeFood,
    getLikedFood,
    suggestDay,
    updateDay,
    getVotedDay,
    getDay
} from "./bob_friend.ctrl.js";
import {SET_BOB_FRIEND} from '../../middleware/cron.js'


const router = express.Router();



router.post('/food', suggestFood) // 음식제안
router.get('/food', getSuggestedFood) // 제안된 음식 조회
router.put('/food', updateSuggestedFood) // 제안된 음식수정
router.get('/team/list/:tNum', getBobFriend) // 팀원조회
router.get('/team/index/thisweek/:mNum', getThisWeekIndex) // 이번주 팀 인덱스 조회
router.get('/team/list/new/:mNum', getBobFriendNew) // 팀원조회
router.get('/food/start', SET_BOB_FRIEND) // 팀원생성
router.post('/food/like', likeFood) // 음식좋아요
router.get('/food/like/:tIndex/:mNum',  getLikedFood)
router.get('/food/like/:tIndex', getLikedFood)

// 요일투표 라우터
router.post('/day/:tIndex/:mNum', suggestDay)
router.put('/day/:tIndex/:mNum', updateDay)

// 투표된 요일 조회
router.get('/day/:tIndex', getVotedDay)

// 어느팀 누가 무슨 요일 좋아요 눌렀는지 확인하는 라우터
router.get('/day/:tIndex/:mNum', getDay)
export default router;