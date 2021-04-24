const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql')
app.use(express.static('www'));
app.use(express.json())

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'test'
  });
   


connection.connect();
function  insertApi(api, callback){
    let str = "select * from api where api='"+api + "'"
    connection.query(str, function (error, results, fields) {
        if(results[0]){
            let str2 = 'UPDATE api  SET num='+(results[0].num+1)+" WHERE api='"+api+"'"
            console.log(str2)
            connection.query(str2 , function (error, results) {
                if(typeof callback=='function') callback();
            });
        }else{
            var  addSql = 'INSERT INTO api(api,num) VALUES(?,?)';
            var  addSqlParams = [api,1];
            connection.query(addSql,addSqlParams , function (error, results) {
                if(typeof callback=='function') callback();
            });
        }
    });
    
    
}
// 1.admin login
app.post('/admin/login', (req, res)=>{
    insertApi('/admin/login');
    
    let str = "select * from admin where name='"+req.body.name + "' and " + "pwd='"+req.body.pwd+"'"
    connection.query(str, function (error, results, fields) {
        // if (error) throw error;
        // console.log('The solution is: ', results);
        res.json({
            result: error?null : (results[0] || null)
        })
    });
})
// 2.user register
app.post('/user/register', (req, res)=>{
    insertApi('/user/register');
    var  addSql = 'INSERT INTO user(name,password) VALUES(?,?)';
    var  addSqlParams = [req.body.name,req.body.pwd];
    // console.log(addSqlParams)
    connection.query(addSql,addSqlParams , function (error, results) {
        res.json({
            result: error?null : (results || null)
        })
    });
})
// 3.user login
app.post('/user/login', (req, res)=>{
    insertApi('/user/login');
    let str = "select * from user where name='"+req.body.name + "' and " + "password='"+req.body.pwd+"'"
    connection.query(str, function (error, results, fields) {
        // if (error) throw error;
        // console.log('The solution is: ', results);
        res.json({
            result: error?null : (results[0] || null)
        })
    });
})
// 7.
app.put('/user/update', (req, res)=>{
    console.log(req.body)
    insertApi('/user/update');
    let str = "select * from user where name='"+req.body.name + "' and " + "password='"+req.body.pwd+"'"
    console.log(str)
    connection.query(str, function (error, results) {
        console.log(results)
        if(!error && results[0]){
            let str2 = 'UPDATE user  SET password='+(req.body.pwd2)+" where name='"+req.body.name + "' and " + "password='"+req.body.pwd+"'"
            console.log(str2)
            connection.query(str2 , function (error2, results) {
                // if(typeof callback=='function') callback();
                res.json({
                    result: error2?null : (results || null)
                })
            });
        }else{
            res.json({
                result: null
            })
        }
    });

   
})
// 4.get all user
app.get('/user/get', function(req,res){
    insertApi('/user/get');
    let str = "select * from user";
    connection.query(str, function (error, results, fields) {
       
        res.json({
            result: error?null : (results || null)
        })
    });
})
// 5.delete user of id
app.delete('/user/delete/:id', function(req, res){
    insertApi('/user/delete',()=>{
        let str = 'DELETE FROM user WHERE id='+req.params.id
        connection.query(str, function (error, results) {
            res.json({
                result: error?null : (results || null)
            })
        });
    });
    // console.log(req.params.id)
    
})
// 6.get all user
app.get('/api/get', function(req,res){
    insertApi('/api/get', ()=>{
        let str = "select * from api";
        connection.query(str, function (error, results, fields) {
           
            res.json({
                result: error?null : (results || null)
            })
        });

    });
   
})
app.listen(3000, ()=>{
    console.log("server running......")
})