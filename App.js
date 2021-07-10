
var express = require("express");
var cors = require("cors");
const bodyParser = require('body-parser')
const path = require('path')
var app = express();
const DataBase = require("./lib/db")
const router = express.Router();

var authRouter = require('./routes/auth');

app.use(cors());

// var corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200, // For legacy browser support
//     methods: "GET, POST"
// }

// var whitelist = ['http://localhost:3000']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept,x-auth-token,x-refresh-token"
//     );
//     next();
//   });
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept,x-auth-token,x-refresh-token"
//     );
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
//     next();
//   });


app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use("/", authRouter);

app.listen("5557", () => {
    console.log("Connected");
})