import passport from 'passport';
import local from './localStrategy.js';
import authStorage from "../models/authStorage.js";

export default function () {
    passport.serializeUser((user, done) => {
        //console.log(`그냥 user : ${user} ~~`)
        //console.log(`user[0] : ${user[0]} ~~`)
        done(null, user[0].m_id); // 세션에 user의 id만 저장, .id 붙여야하는지 아닌지 확인필요
    });

    passport.deserializeUser((id, done) => {
        authStorage.getUserId(id)
            .then(user => done(null, user[0])) // req.user, req.isAuthenticated()
            .catch(err => done(err));
    });

    local();

}