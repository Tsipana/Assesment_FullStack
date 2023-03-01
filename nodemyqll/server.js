const express = require('express')
const bodyParser = require('body-parser')
const mysql = require("mysql");
const server = express();
server.use(bodyParser.json());

//Create the database connection
const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "dbfullstass",
});

db.connect(function (error){
    if(error){
        console.log("Error Connecting to DB");
    } else {
        console.log("successfully Connected to DB");
    }
});

//Create the database connection

server.listen(3306, function check(error) {
    if(error){
        console.log("Error Connecting to DB");
    }else{
        console.log("Started......!!!!!!");
    }
});

server.post("/api/tbleadays/add", (req, res) => {
    let details = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        leave_start: new Date(req.body.leave_start),
        leave_end: new Date(req.body.leave_end),
        leave_type: req.body.leave_type,
        reason: req.body.reason   
    };
    let sql = "INSERT INTO tbleadays SET ?";
    console.log('Details:', details);
    console.log('SQL query:', sql);
    db.query(sql, details, (error) => {
        if(error){
            res.send({ status: false, message: "Student created Failed"});
        } else {
            res.send({ status: true, message: "Student created successfully"});
        }
    });
});

//Get all information
server.get("/api/tbleadays", (req, res) => {
    var sql = "SELECT * FROM tbleadays";
    db.query(sql, function (error, result) {
        if(error){
            console.log("Error Connecting");
        }else {
            res.send({status: true, data: result});
        }
    });
});