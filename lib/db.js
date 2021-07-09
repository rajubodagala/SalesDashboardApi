// module.exports = {
//   database:
//     "mongodb://cosmosdg:kEoPntzWwky0AoUAZEV0XlZ2LvPDPj5d3Do4kRtcn9EhrHVWApdEBrlybuC7fe2ftAZGWhw4bD24EnQD9PWKNA==@cosmosdg.mongo.cosmos.azure.com:10255/DARDLEA?ssl=true"
// };

var mysql = require('mysql');

const database = mysql.createConnection({
  // host: "172.31.35.10",
  // host: process.env.MYSQL_HOST || "dev.store.kwikbasket.com",
  // user: process.env.MYSQL_USER || "root",
  // password: process.env.MYSQL_PASSWORD || "Touchmen0t!",
  // database: process.env.MYSQL_DATABASE || "kwikbasket",
  // port: "3306",
  // port: '/var/run/mysqld/mysqld.sock'
  // socketPath: '/var/run/mysqld/mysqld.sock'


    host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "Raju@123",
  database: process.env.MYSQL_DATABASE || "sales",
});

database.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});

module.exports = database;