"use strict"
import './src/config/loadEnv.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import calendarRoute from './src/routes/calendar/index.js';
import authRoute from './src/routes/auth/index.js';
import bobRoute from './src/routes/bob_friend/index.js'
import passportConfig from './src/passport/index.js';
import './src/middleware/cron.js';

const app = express();
passportConfig();

app.use(
  cors({
      origin: [
          "",
          "",
          "",
          "",
      ],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('/src/public'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'connect.sid'
}));
app.use(morgan('tiny'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/calendar', calendarRoute);
app.use('/auth', authRoute);
app.use('/bob', bobRoute);

app.use((err, req, res, next) => {
    res.status(404).send('Error : not-found');
})

export default app;