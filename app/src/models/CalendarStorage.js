"use strict";

import connection from '../config/db_mysql.js';
import client from '../config/db_postgresql.js'

// GET :: 달력 월 정보 조회 함수
async function getCalendarInfo(year, month) {
    return connection.query(
        `SELECT *, DATE_FORMAT(cal_start_day, '%Y-%m-%d') cal_start_day, DATE_FORMAT(cal_end_day, '%Y-%m-%d') cal_end_day FROM tbl_calendar
                WHERE CONCAT(${year}, '-', LPAD(${month}, 2, 0)) BETWEEN DATE_FORMAT(cal_start_day, '%Y-%m') AND DATE_FORMAT(cal_end_day, '%Y-%m');`
        ,);
}

async function getCalendarId(id) {
    return connection.query(
        `SELECT *, DATE_FORMAT(cal_start_day, '%Y-%m-%d') cal_start_day, DATE_FORMAT(cal_end_day, '%Y-%m-%d') cal_end_day FROM tbl_calendar WHERE cal_index = '${id}';`
    );
}

// POST :: 달력 정보 생성 함수
async function createCalendarInfo(reqBody) {
    return connection.query(
        `INSERT INTO tbl_calendar(cal_title, cal_start_day, cal_end_day, cal_category)
            VALUES (:cal_title, :cal_start_day, :cal_end_day, :cal_category);` // 객체에 있는 값을 편하게 사용하고, 같은 값을 여러번 사용해야 할 때
        , reqBody);
    // VALUES ('${reqBody.cal_title}', '${reqBody.cal_start_day}', '${reqBody.cal_end_day}', '${reqBody.cal_category}');
}

// PUT :: 달력 정보 수정 함수
async function updateCalendarInfo(calIndex, reqBody) {
    return connection.query(
        `UPDATE tbl_calendar 
            SET cal_title = '${reqBody.cal_title}',
            cal_start_day = '${reqBody.cal_start_day}',
            cal_end_day = '${reqBody.cal_end_day}',
            cal_category = '${reqBody.cal_category}'
            WHERE cal_index = ${calIndex.index}`
    );
}

// DELETE :: 달력 정보 삭제 함수
async function deleteCalendarInfo(calIndex) {
    return connection.query(
        `DELETE FROM tbl_calendar WHERE cal_index = ${calIndex.index};`
    )
}

// GET : 전자결재 정보 조회 함수
async function getApprovalInfo(year, month) {
    return client.query(
        `SELECT
              m.m_nm mNm,
              f.folder_nm depNm,
              to_char(ad.cal_stdt + INTERVAL '9 hour', 'YYYY-MM-DD') strDt,
              to_char(ad.cal_eddt, 'YYYY-MM-DD') endDte,
              ad.vacation_type v_type,
              ad.breakaway_reason reason
        FROM appr_doc ad
        LEFT JOIN member m on ad.m_no = m.m_no
        LEFT JOIN folder f on ad.folder_no = f.folder_no
        WHERE ad.form_type = 'VACATION'
          AND ad.doc_status = 'COMPLETE'
          AND (to_char(ad.cal_stdt, 'YYYY-MM') = '${year}-${month}' OR to_char(ad.cal_eddt, 'YYYY-MM') = '${year}-${month}')
        ORDER BY ad.doc_no DESC
`)
}

export default {
    getCalendarInfo,
    getCalendarId,
    createCalendarInfo,
    updateCalendarInfo,
    deleteCalendarInfo,
    getApprovalInfo,
};