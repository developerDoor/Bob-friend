"use strict"
import authStorage from "../../models/authStorage.js";
import sha256 from 'sha256'
import passport from "passport";

async function join(req, res, next) {
    const {id, password} = req.body; // 요청의 body 정보값 구조분해할당
    try {
        const result = await authStorage.getUserId(id)
        if (result[0].length === 1) {
            return res.status(409).send('이미 존재하는 ID입니다.');
        }
        const hash = await sha256(password)
        await authStorage.joinUser(req.body, hash)
        return res.status(200).send('회원가입 완료.');
    } catch (err) {
        return res.status(400).json(err);
    }
}

async function login(req, res, next) {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (user.length === undefined) {
            return res.status(400).send(`${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            // 세션 쿠키를 브라우저로 보내준다.
            return res.json({ message : '로그인 성공'});
        });
    })(req, res, next);
}

async function loginCheck(req, res, next) {
    if (req.user) {
        const [userInfo] = await authStorage.getUserInfoTeamNum(req.user[0].m_id)
        res.json(userInfo[0]);
    } else {
        res.status(401).send(null);
    }
}

async function logout(req, res, next) {
    req.logout((err) => {
        if (err) {return next(err);}
    });
    req.session.destroy();
    res.send('로그아웃!');
}

export default {
    join,
    login,
    logout,
    loginCheck
}