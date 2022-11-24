import conn from "../../config/db_mysql.js";
import bobStorage from "../../models/bobStorage.js"

// SELECT :: 이번주 팀이 만들어져 있는지 체크
export const checkThisInsertTeam = () => conn.query(`SELECT * FROM tbl_team WHERE t_wnum = WEEK(NOW()) AND t_ynum = DATE_FORMAT(now(), '%Y')`)

// SELECT :: TEAM 이 만들어져 있는지 체크
export const checkInsertTeam = () => conn.query(`SELECT * FROM tbl_team WHERE t_wnum = WEEK(DATE_ADD(NOW(), INTERVAL 7 DAY)) AND t_ynum = DATE_FORMAT(now(), '%Y')`)

// SELECT :: 모든 유저 index 갖고옴
export const getAllUserNum = () => conn.query(`SELECT m_num FROM tbl_member WHERE m_deldt IS NULL`)

// SELECT :: 가장 마지막에 만든 TEAM INDEX 를 갖고옴
export const getLastTeamNum = () => conn.query(`SELECT IFNULL(MAX(t_index), 0) t_index FROM tbl_team WHERE t_deldt IS NULL`);

// INSERT ::  이번주TEAM 생성
export const insertThisTeam = tNum => conn.query(`
    INSERT INTO tbl_team (t_index, t_wnum, t_ynum) VALUES (?, WEEK(NOW()), DATE_FORMAT(now(), '%Y'))
`, [tNum]);

// INSERT :: TEAM 생성
export const insertTeam = tNum => conn.query(`
    INSERT INTO tbl_team (t_index, t_wnum, t_ynum) VALUES (?, WEEK(DATE_ADD(NOW(), INTERVAL 7 DAY)), DATE_FORMAT(now(), '%Y'))
`, [tNum]);

// INSERT :: TEAM 별 유저 생성
export const insertTeamMember = (tNum, mNum) => conn.query(`
    INSERT INTO tbl_tmember (t_index, m_num) VALUES (?, ?)
`, [tNum, mNum]);


export const suggestFood = async (req, res, next) => {
    try {
        const result = await bobStorage.suggestFood(req.body)
        return res.send(result[0])
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const getSuggestedFood = async (req, res, next) => {
    try {
        const requset = req.query;
        const result = await bobStorage.getSuggestedFood(requset.tIndex);
        return res.send(result[0])
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const updateSuggestedFood = async (req, res, next) => {
    try {
        const result = await bobStorage.updateSuggestedFood(req.body);
        return res.send(result[0])
    } catch (err) {
        return res.status(400).json(err);
    }
}


export const getBobFriend = async (req, res, next) => {
    try {
        const result = await bobStorage.getBobFriend(req.params.tNum);
        return res.send(result[0])
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const getThisWeekIndex = async (req, res, next) => {
    try {
        const result = await bobStorage.getThisWeekTeamIndex(req.params.mNum);
        return res.send(result[0])
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const getBobFriendNew = async (req, res, next) => {
    try {
        const resultThis = await bobStorage.getThisBobFriend(req.params.mNum)
        const resultNext = await bobStorage.getNextBobFriend(req.params.mNum)
        return res.send([resultThis[0], resultNext[0]])
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const likeFood = async (req, res, next) => {
    try {
        const checkInfo = await bobStorage.checkLikedFood(req.body);
        if (checkInfo[0].length === 0) {
            bobStorage.likeFood(req.body);
            return res.status(200).send('좋아요 성공');
        }

        if (req.body.fName === checkInfo[0][0].f_name) {
            return res.status(200).send('이미 반영된 좋아요 메뉴입니다.');
        }

        bobStorage.changeLikedFood(req.body)
        return res.status(200).send('좋아요 메뉴 변경');

    } catch (err) {
        return res.status(400).json(err);
    }
}

export const getLikedFood = async (req, res, next) => {
    try {
        const result = await bobStorage.getLikedFood(req.params.tIndex, req.params.mNum);
        return res.status(200).send(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const suggestDay = async (req, res, next) => {
    try {
        const check = req.body.map(_ => _.checked)
        const result = await bobStorage.suggestDay(req.params.tIndex, req.params.mNum, check)
        return res.status(200).send(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const updateDay = async (req, res, next) => {
    try {
        const check = req.body.map(_ => _.checked)
        const result = await bobStorage.updateDay(req.params.tIndex, req.params.mNum, check)
        return res.status(200).send(result[0]);
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const getVotedDay = async (req, res, next) => {
    try {
        const votedDay = await bobStorage.getVotedDay(req.params.tIndex);
        const result = Object.values(votedDay[0][0]);
        const numresult = result.map(Number);
        const max = Math.max(...numresult);
        const index = numresult.indexOf(max);
        return res.status(200).json(index);
    } catch (err) {
        return res.status(400).json(err);
    }
}

export const getDay = async (req, res, next) => {
    try {
        const dataForm = [
            {
                id: 1,
                text: "월요일",
                checked: true,
            },
            {
                id: 2,
                text: "화요일",
                checked: true,
            },
            {
                id: 3,
                text: "수요일",
                checked: true,
            },
            {
                id: 4,
                text: "목요일",
                checked: true,
            },
            {
                id: 5,
                text: "금요일",
                checked: true,
            }
        ]
        const result = await bobStorage.getDay(req.params.tIndex, req.params.mNum)
        for (let i = 0; i < 5; i++) {
            const arr = Object.values(result[0][0])
            dataForm[i].checked = arr[i];

        }
        return res.status(200).json(dataForm);
    } catch (err) {
        return res.status(400).json(err);
    }
}
