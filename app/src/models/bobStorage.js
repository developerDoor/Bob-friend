"use strict";
import conn from "../config/db_mysql.js";

// INSERT :: 팀원 음식 제안
const suggestFood = (reqBody) => conn.query(`INSERT INTO tbl_food (t_index, m_num, f_name) VALUES (:tIndex, :mNum, :fName)`, reqBody);
// SELECT :: 음식 제안 현황 조회
const getSuggestedFood = (tIndex, mNum) => conn.query(`SELECT m_num, f_name FROM tbl_food WHERE t_index = ?`, [tIndex, mNum]);

// UPDATE :: 음식 제안 수정
const updateSuggestedFood = (reqBody) => conn.query(`
    UPDATE tbl_food SET f_name = :fName WHERE t_index = :tIndex and m_num = :mNum
`, reqBody)

const likeFood = (reqBody) => conn.query(`INSERT INTO tbl_foodlike (t_index, m_num, f_name) VALUES (:tIndex, :mNum, :fName)`, reqBody);

const checkLikedFood = (reqBody) => conn.query(`SELECT * FROM tbl_foodlike WHERE t_index = :tIndex AND m_num = :mNum`, reqBody);

const changeLikedFood = (reqBody) => conn.query(`UPDATE tbl_foodlike SET f_name = :fName WHERE t_index = :tIndex AND m_num = :mNum`, reqBody);

const getLikedFood = (tIndex, mNum) => {
    if (mNum === undefined) {
        return conn.query(`SELECT liked,f_name FROM (SELECT Count(*) AS liked, f_name FROM tbl_foodlike WHERE t_index = ? GROUP BY f_name) tb2 ORDER BY liked DESC LIMIT 1;`, [tIndex]);
    } else {
        return conn.query(`SELECT f_name FROM tbl_foodlike WHERE t_index = ? AND m_num = ?`, [tIndex, mNum]);
    }
}
const getMostLikedFood = (reqBody) => conn.query(`
    SELECT MAXSELECT Count(*), f_name FROM tbl_foodlike WHERE t_index=1 GROUP BY f_name;
`)

// SELECT :: 밥친구 팀 조회
const getBobFriend = (tIndex) => conn.query(`
    SELECT
        M.m_name
    FROM tbl_member M
    JOIN tbl_tmember TM
    ON M.m_num = TM.m_num
    JOIN tbl_team T
    ON TM.t_index = T.t_index 
    WHERE TM.t_index = ?
`, [tIndex])
// 두번째 ON 절에 지운 부분
// AND T.t_wnum = WEEK(DATE_ADD(NOW(), INTERVAL 7 DAY)) AND T.t_ynum = DATE_FORMAT(now(), '%Y')


const getThisWeekTeamIndex = (mNum) => conn.query(`
    SELECT
        TM.t_index
    FROM tbl_tmember TM
    JOIN tbl_team T
    ON TM.t_index = T.t_index AND T.t_wnum = WEEK(NOW()) AND T.t_ynum = DATE_FORMAT(now(), '%Y')
    WHERE TM.m_num = ?;
`, [mNum])


const getThisBobFriend = (mNum) => conn.query(`
    SELECT
        M.m_name
    FROM tbl_member M
    JOIN tbl_tmember TM
    ON M.m_num = TM.m_num
    WHERE TM.t_index =(SELECT
                        TM.t_index
                    FROM tbl_tmember TM
                    JOIN tbl_team T
                    ON TM.t_index = T.t_index AND T.t_wnum = WEEK(NOW()) AND T.t_ynum = DATE_FORMAT(now(), '%Y')
                    WHERE TM.m_num = ?)
`, [mNum])

const getNextBobFriend = (mNum) => conn.query(`
    SELECT
        M.m_name
    FROM tbl_member M
    JOIN tbl_tmember TM
    ON M.m_num = TM.m_num
    WHERE TM.t_index =(SELECT
                        TM.t_index
                    FROM tbl_tmember TM
                    JOIN tbl_team T
                    ON TM.t_index = T.t_index AND T.t_wnum = WEEK(DATE_ADD(NOW(), INTERVAL 7 DAY)) AND T.t_ynum = DATE_FORMAT(now(), '%Y')
                    WHERE TM.m_num = ?)
`, [mNum])

// POST :: 식사 요일 제안
const suggestDay = (tIndex, mNum, days) => {
    return conn.query(`INSERT INTO tbl_day VALUES (?, ?, ?, ?, ?, ?, ?)`,[tIndex, mNum, ...days])
}

const updateDay = (tIndex, mNum, days) => {
    return conn.query(`UPDATE tbl_day
                SET day_mon = ?, day_tue = ?, day_wed = ?, day_thur = ?, day_fri = ?
                WHERE t_index = ? AND m_num = ?`,[...days, tIndex, mNum])
}

const getVotedDay = (tIndex) => {
    return conn.query(`
        SELECT SUM(day_mon) as mon, SUM(day_tue) as tue, SUM(day_wed) as wed, SUM(day_thur) as thur, SUM(day_fri)  as fri FROM tbl_day WHERE t_index = ?
    `,[tIndex])
}

const getDay = (tIndex, mNum) => {
    return conn.query(`
        SELECT day_mon, day_tue, day_wed, day_thur, day_fri FROM tbl_day WHERE t_index = ? AND m_num = ?
    `,[tIndex, mNum])
}
export default {
    suggestFood,
    getSuggestedFood,
    updateSuggestedFood,
    getBobFriend,
    getThisWeekTeamIndex,
    getThisBobFriend,
    getNextBobFriend,
    likeFood,
    checkLikedFood,
    changeLikedFood,
    getLikedFood,
    suggestDay,
    updateDay,
    getVotedDay,
    getDay
}