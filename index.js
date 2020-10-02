const express=require("express");
const app=express();
let server=require("./server");
let middleware=require("./middleware");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospital';
let db
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log('Connected:${url}');
});
app.get('/Hospital', middleware.checkToken,(req,res)=>{
    console.log("hospital details");
    var data=db.collection('hospital_db').find().toArray().then(result=>res.json(result));
});
app.get('/Ventilators', middleware.checkToken,(req,res)=>{
    console.log("Ventilator details");
    var data=db.collection('ventilators_db').find().toArray().then(result=>res.json(result));
});
app.post('/searchventbystatus', middleware.checkToken,(req,res)=>{
    var status=req.query.status;
    console.log(status);
    var data=db.collection('ventilators_db').find({status:status}).toArray().then(result=>res.json(result));
});
app.post('/searchventbyname', middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('ventilators_db').find({"name":name}).toArray().then(result=>res.json(result));
});
app.post('/searchHospbyName', middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('hospital_db').find({name:name}).toArray().then(result=>res.json(result));
});
app.put('/updateventilator', middleware.checkToken,(req,res)=>{
    var vid={vid:req.query.vid};
    console.log(vid);
    var newvalues={$set :{ status: req.query.status } };
    db.collection('ventilators_db').updateOne(vid,newvalues,function(err,result){res.json('1 document updated');
    if (err) throw err;
});
});
app.post('/addventilator', middleware.checkToken,(req,res)=>{
    var hId=req.query.hId;
    var vid=req.query.vid;
    var status=req.query.status;
    var name=req.query.name;
    var item={
        hId:hId,vid:vid,status:status,name:name
    };
    db.collection('ventilators_db').insertOne(item,function(err,result){res.json('Item inserted');
    if (err) throw err;
});
});
app.delete('/delventbyvid', middleware.checkToken,(req,res)=>{
    var vid=req.query.vid;
    var myquery={vid:vid};
    console.log(vid);
    db.collection('ventilators_db').deleteOne(myquery,function(err,result){res.json('vid deleted');
    if (err) throw err;
});
});
app.listen(3500);