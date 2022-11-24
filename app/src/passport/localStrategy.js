import passport from 'passport';
import LocalStrategy from 'passport-local/lib/strategy.js'
import authStorage from "../models/authStorage.js";
import sha256 from 'sha256'


export default function () {
    passport.use(new LocalStrategy({
            usernameField: 'id', // req.body.id
            passwordField: 'password', // req.body.password
        }, async (id, password, done) => {
            try {
                const User = await authStorage.getUserInfo(id);
                if (User[0].length === 1) { // 브라우저에서 입력한 아이디가 DB에 있을 때
                    const passwordInDb = await authStorage.getUserPassword(id)
                    if (sha256(password) === passwordInDb[0][0].m_password) {
                        //console.log(User[0][0].m_id);
                        done(null, User[0])
                    } else {
                        done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    }
                } else {
                    done(null, false, { message: '가입되지 않은 회원입니다.' });
                }
            } catch (error) {
                console.error(error);
                done(error);
            }
        }
    ));
}