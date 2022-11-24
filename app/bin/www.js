"use strict"
import app from '../app.js'


const PORT = process.env.PORT || 2101;

app.listen(PORT, () => {
    console.log(`${PORT} 포트에서 서버 가동`);
});