"use strict";

import connection from '../config/db_mysql.js';

// user 정보 확인
async function getUserInfo(mId) {
    return connection.query(
        `SELECT m_num, m_id, m_name, d_deptno FROM tbl_member WHERE m_id = '${mId}';`)
}

async function getUserInfoTeamNum(mId) {
    return connection.query(
        `SELECT
                    M.m_num, M.m_id, M.m_name, M.d_deptno, TM.t_index
                FROM tbl_member M
                JOIN tbl_tmember TM
                ON M.m_num = TM.m_num
                JOIN tbl_team T
                ON TM.t_index = T.t_index AND T.t_wnum = WEEK(DATE_ADD(NOW(), INTERVAL 7 DAY)) AND T.t_ynum = DATE_FORMAT(now(), '%Y')
                WHERE M.m_id = ?;`
        , [mId])
}


// user ID 존재 확인
async function getUserId(userId) {
    return connection.query(
        `SELECT m_id FROM tbl_member WHERE m_id = '${userId}';`
    )
}

// 회원가입(id, password, name, deptno 저장
async function joinUser(reqBody, hashedPassword) {
    return connection.query(
        `INSERT INTO tbl_member(m_id, m_password, m_name, d_deptno) 
            VALUES (:id, '${hashedPassword}', :name, :deptno);`
        , reqBody);
}

//
async function getUserPassword(userId) {
    return connection.query(
        `SELECT m_password FROM tbl_member WHERE m_id = '${userId}';`
    )
}


export default {
    getUserId,
    joinUser,
    getUserPassword,
    getUserInfo,
    getUserInfoTeamNum,
}