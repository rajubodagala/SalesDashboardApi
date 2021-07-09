var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
var mysql = require('mysql');
const jwt = require("jsonwebtoken");
const config = require("config");
/**************Login API*************/

const generateAuthToken = async function () {
    const token = jwt.sign(
        {
            user_id: this.user_id,
            firstname: this.firstname,
            lastname: this.lastname,
            username: this.username,
            email: this.email
        },
        config.get("jwtPrivateKey"),
        { expiresIn: config.get("tokenLife") }
    );

    const response = {
        token: token
    };
    return response;
};
// router.post("/api/login", async (req, res) => {

//     if (!req.body.password && !req.body.username) {
//         res.status(400).json({
//             success: false,
//             responseCode: 400,
//             msg: "Please enter Email/Username for login",
//         });
//     }
//     let sql = 'SELECT * FROM `hf7_user` WHERE username = ' + mysql.escape(req.body.username) +
//         'AND (password = SHA1(CONCAT(salt, SHA1(CONCAT(salt, SHA1(' + mysql.escape(req.body.password) + '))))))' +
//         'OR password = md5(' + mysql.escape(req.body.password) + ')';
//     dbConn.query(sql, function (err, rows) {

//         if (err) {
//             res.status(400).json({
//                 success: false,
//                 responseCode: 400,
//                 msg: "Please enter Email/Username for login"
//             });
//         } else {
//             generateAuthToken().then(JWT => {
//                 res.status(200).json({
//                     success: true,
//                     responseCode: 200,
//                     msg: "Logged Successfully",
//                     loginResult: { JWT, rows },
//                 });
//             });
//         }
//     });
// });

router.post("/api/login", async (req, res) => {

    if (!req.body.password && !req.body.username) {
        res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Please enter Email/Username for login",
        });
    }
let sql ='SELECT * FROM users where Password = md5('+ mysql.escape(req.body.password) +') and lower(username) = lower('+ mysql.escape(req.body.username) +')'

    dbConn.query(sql, function (err, rows) {

        if (err) {
            console.log(err)
            res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Please enter Email/Username for login"
            });
        } else {
            console.log(rows[0].RowDataPacket)
                res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Logged Successfully",
                    loginResult:  rows ,
                });       
        }
    });
});
router.post("/api/transactions", async (req, res) => {
    // let sql = 'SELECT 1 as ID, u.username, sum(t.qunatity) as Units,sum(t.billed) as Billed,'+
    // 'sum(t.green) as Green,sum(t.yellow) as Yellow,sum(red) as Red,  sum(t.qunatity*t.rate) as BGYR,'+ 
    // 'sum(t.billed*t.rate)as pBilled,sum(t.green*t.rate)as pGreen,sum(t.yellow*t.rate) as pYellow,'+
    // 'sum(t.red*t.rate) as pRed from transactions t join users u on u.userid=t.userid'+
    // ' join items i on i.itemid=t.itemid'+
    // ' join customer c on c.customerid=t.customerid'+
    // ' where u.path like "'+ userPath + '" group by t.userid';

    let today = new Date(req.body.saleDate).toISOString().slice(0, 10)
console.log(req.body.path)
    dbConn.query('CALL sp_transactions(?,?)',[req.body.path,today], function (err, rows) {
        if (err) {
            res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err
            });
        } else {           
                res.status(200).json({
                    success: true,
                    responseCode: 200,
                    result:  rows 
                });
        }
    });
});

module.exports = router;

