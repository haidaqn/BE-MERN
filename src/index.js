const express = require('express');
require('dotenv').config();
const initRoutes = require('./router/index');
const db = require('./config/db/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
        methods: ['POST', 'GET', 'PUT', 'DELETE']
    })
);
db.connect();

const port = process.env.PORT || 8081;
app.use(express.urlencoded({ extended: true }));
// method
initRoutes(app);
app.listen(port, () => {
    console.log(`server in running ${port}`);
});

// create -> post, put -> body
// get + delete -> query
