const express = require('express');
const path = require('path');
const body = require('body-parser');
//const app = express();
const mysql = require('mysql');

var fs = require('fs');
var http = require('http');
var https = require('https');
//var privateKey  = fs.readFileSync(path.resolve('server/key.pem', 'utf8'));
var privateKey  = fs.readFileSync(__dirname + '/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const app = express();

var httpsServer = https.createServer(credentials, app);

app.use(body());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const db = mysql.createConnection({
    host: '172.25.240.1',
    user: 'oat',
    password: '1212312121',
    database: 'oat-dataserver'
});
// show data
app.get('/data', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT * ,`Regis-by` as `Regisby` FROM `users` JOIN `province` ON users.province = province.provinceId JOIN `district` ON users.district = district.districtId JOIN `subdistrict` ON users.subdistrict = subdistrict.subdistrictId JOIN village ON users.village = village.villageId ORDER BY `users`.`id` ASC;';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show province
app.get('/provinces', function(req,res){
    let sql = 'SELECT * FROM `province`';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show district with province
app.get('/districts', function(req,res){
    let sql = 'SELECT * FROM `district` WHERE provinceId = ?';
    db.query(sql, [req.query.provinceId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show subdistrict with district
app.get('/subdistricts', function(req,res){
    let sql = 'SELECT * FROM `subdistrict` WHERE districtId = ?';
    db.query(sql, [req.query.districtId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show village with subdistrict
app.get('/villages', function(req,res){
    let sql = 'SELECT * FROM `village` WHERE subdistrictId = ?';
    db.query(sql, [req.query.subdistrictId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

//delete
app.put('/delete', function(req, res) {
    var sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql,[req.body.id],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//edit
app.put('/data', function(req, res) {
    var sql = 'UPDATE users SET firstname = ? , lastname = ?, phonenum = ?, province = ?, district = ?, subdistrict = ?, village = ? WHERE id = ?';
    db.query(sql,[
        req.body.firstname,
        req.body.lastname,
        req.body.phonenum,
        req.body.province,
        req.body.district,
        req.body.subdistrict,
        req.body.village,
        req.body.id
    ],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//insert
app.post('/data', function(req, res){
    console.log(req.body);
    let data = {
        // id:req.body.user_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenum: req.body.phonenum,
        'Regis-by':req.body['Regis-by'],
        province: req.body.province,
        district: req.body.district,
        subdistrict: req.body.subdistrict,
        village: req.body.village
    };
    let sql = 'INSERT INTO users SET ?';
    db.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            console.log("ID is Primarykey!!!!!");
            console.log("Enter the id again..");
        }else{
            console.log(result);
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});




//module.exports = app;
module.exports = httpsServer;
