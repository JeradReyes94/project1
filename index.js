const mysql =require('mysql');
const express = require('express');
var app = express();
const ejs = require('ejs');
const bodyparser = require('body-parser');
const { response } = require('express');


app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'password',
    database: 'inventory',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('Database connection success.');
    else
    console.log('Database connection failed. \n Error: ' + JSON.stringify(err,undefined,2));
})

app.listen(3000,()=>console.log('Express server is running at port no : 3000'));

//Get all items
app.get('/items', (req,res)=>{
    mysqlConnection.query('SELECT * FROM items', (err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});

//Get an item
app.get('/items/:id', (req,res)=>{
    mysqlConnection.query('SELECT * FROM items WHERE id = ?',[req.params.id], (err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});

//Delete an item
app.delete('/items/:id', (req,res)=>{
    mysqlConnection.query('DELETE FROM items WHERE id = ?',[req.params.id], (err, rows, fields)=>{
        if(!err)
        res.send('Deleted Succesfully');
        else
        console.log(err);
    })
});

//Insert an item
app.post('/items', (req,res)=>{
    let itm = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @qty =?;SET @amount = ?;\
    CALL ItemAddOrEdit(@id,@name,@qty,@amount);";
    mysqlConnection.query(sql,[itm.id, itm.name, itm.qty, itm.amount],(err, rows, fields)=>{
        if(!err)
        rows.forEach(element => {
            if(element.constructor == Array)
            response.send('Inserted id : ' +element[0].id); 
        });
        else
        console.log(err);
    })
});

//Update an item
app.put('/items', (req,res)=>{
    let itm = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @qty =?;SET @amount = ?;\
    CALL ItemAddOrEdit(@id,@name,@qty,@amount);";
    mysqlConnection.query(sql,[itm.id, itm.name, itm.qty, itm.amount],(err, rows, fields)=>{
        if(!err)
        response.send('Updated Successfully.');
        else
        console.log(err);
    })
});