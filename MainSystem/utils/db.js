require('dotenv').config;
const fs = require('fs');
const url = require('url');

const pgp=require('pg-promise')({
    capSQL:true
 });

 const cn={
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DBNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUBzmtSm+2sOigikgSqGaFvrCaDxgwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZTZjOTE4NzMtMDE5Ni00YmJkLTlhZTgtOTFhNzMyZjdh
YjIyIFByb2plY3QgQ0EwHhcNMjQwMTEwMDM1NjA2WhcNMzQwMTA3MDM1NjA2WjA6
MTgwNgYDVQQDDC9lNmM5MTg3My0wMTk2LTRiYmQtOWFlOC05MWE3MzJmN2FiMjIg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMZYxfj7
+OjXb16U/7Q/jm3ZTz7jv6EmkEWwKCzrrNpX7jkIgiVxJWAX3o0NJ1n4pJMG+wk2
th5TxOK3mdlfanm+/u5sQc7z5HvdKACOJbjDEO+iRHYQ2ixWqpxqL7GVTR0oIsul
WUp703N3PWZOiLbjb2BfdwPDuSquB7S04gQLw3UtCQ6+AtgCA+bcxbEHPiYgoqtO
WLvi1pNcPUX5HeOUCfRMnxK73SG5L90RHTrJ3zWRkgbVd3+5JjN33uQeFON7rr/y
RmhcHCaZMEtzHjtjdAGyVWuAxn56nnrc5sMCXfUnnWn/Ty/8Qag9SGoDzQuuhE0e
J+rAP55YEcwuEFaSfDeKuZivPvyJlIzzWnYwa0bWY3QcOd+byLcUdtoEZWgyCdro
lcgWVnzAp/xW2qRBH3FX/BPLdIfr0tW4g11Ap1B0K4WxFXaQEdj3+DAhVpI/RhwV
klTGMhuTSI6jtfWvWP+WN8S9+ESrDS5UcqNu7KqwuK0iZOT64G3Yw8FHGwIDAQAB
oz8wPTAdBgNVHQ4EFgQUwDD0xK5pcEPjm1mXlI2xjp/JjvIwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAGmhjhA3fcLb+mVe
CrgqSZJNoi/VoMgfmHRMJ5f0jxy+8xoAny+Ueo+N9OPFHlK3hqF3AB3zE10acaY/
42OEWRJwwKtLe2ccQvjGfw1djWiTr1+S8pjwCTj3lWIbmAWq5pkcMCLjFf5cAUPX
WvrmcGLN5hiKMo6v1GKV/PropeIEiMk1B+Xu67U74L/3rv8y0YMXGEER5HykwXPi
KESkrWaQuJQKvisuWQ19h5SZiHPUDekkYQS2KuZJjFWDxurSL6+3I4a79kyE8WRc
xbYiOp18XLgoV9mxLbknwZnzkxzFpeZgPOtNdrPf2yacfRizDFsccapXYjzglbW3
5t39dEqlq97tjppJg602K6y7R6OPxYrEAH3pGcB1BTnq2cfe02xb8XKu/gxq9e95
tfpelmdBUNAV9EN0o+djL1rBUgd2WTbCSlTPKZtjx8BdSFIQMEe9o/Svrcz+i9Su
qXS/Otfr0EQbCkrePNLlpoZK7NviwQryfnbSmo4zFQkfD1eGfQ==
-----END CERTIFICATE-----`,
    },
};



const db=pgp(cn);

module.exports={
    getAll: async ()=>{
        let dbcn=null;
            try{
                dbcn=await db.connect();
                console.log("Connect database successfully");
                const tbName="Category";
                const data=await dbcn.any(`SELECT * FROM $1:name`,tbName);
                return data;
            } catch (error){
                throw error;
            } finally{
                dbcn.done();
            }
    },
}