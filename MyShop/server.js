const express = require('express');
const handlebarsConfig = require('./configs/HandlebarsConfig');
const httpsConfig = require('./configs/HttpsConfig');
const bodyParser = require('body-parser');
const cookieparser = require("cookie-parser");
const passportConfig = require('./configs/PassportConfig');
const errorLogin = require('./middlewares/errorLogin');
const sessionConfig = require('./configs/SesssionConfig');
require('dotenv').config();
const port = process.env.AUTH_PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieparser());
sessionConfig(app);
handlebarsConfig(app);
passportConfig(app);
const httpsServer = httpsConfig(app, __dirname);
app.use(errorLogin);

const accountRoutes = require('./routes/account.r');
const userRoutes = require('./routes/user.r');

app.use("/", accountRoutes);
app.use('/user',userRoutes);


httpsServer.listen(port, () => {
  console.log(`Server Auth is running on https://localhost:${port}`);
});
