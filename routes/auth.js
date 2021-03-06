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
    let today = new Date(req.body.saleDate).toISOString().slice(0, 10)
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
router.get("/api/customer", async (req, res) => {
    dbConn.query('select * from customer order by customername', function (err, rows) {
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
router.get("/api/item", async (req, res) => {
    dbConn.query('select * from items order by itemname', function (err, rows) {
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
router.post("/api/register/:regid", async (req, res) => {
    var oldDateObj = new Date(req.body.saledate);
var newDateObj = new Date(req.body.saledate);
newDateObj.setTime(oldDateObj.getTime() + (30 * 60 * 1000));

    let today = new Date(newDateObj).toISOString().slice(0, 19).replace('T', ' ');
    console.log(today);
    dbConn.query('INSERT INTO transactions (UserId, ItemId, CustomerId,Qunatity,Rate,Billed,Green,Yellow,Red,TransactionDate)'+'VALUES ("'+req.params.regid+'", "'+req.body.item+'", "'+req.body.customer+'","'+req.body.quantity+'","'+req.body.rate+'","'+req.body.billed+'","'+req.body.green+'","'+req.body.yellow+'","'+req.body.red+'","'+today+'")', function (err, rows) {
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

