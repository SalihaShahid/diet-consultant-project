var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
var mysql = require("mysql");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require("nodemailer");
let testAccount = nodemailer.createTestAccount();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/*const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'aracely.abbott@ethereal.email',
        pass: 'Necb1YySt9vuzZ9spV'
    }
});*/

var transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'f200147@cfd.nu.edu.pk',
    pass:'Sal@1047'
  }

});


var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dietconsultant",
});

conn.connect(function (err) {
  if (err) throw err;

  console.log("Connection Successful");
});



app.post("/registerUser",function(req,res){
var fname=req.body.ufname;
var lname=req.body.ulname;
var email=req.body.uemail;
var password=req.body.upass;
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);
console.log(hash);
const isMatch = bcrypt.compareSync(password, hash);
console.log(isMatch);
const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
console.log(verificationCode);

var sql=`INSERT INTO user(fname, lname, email, password, code, verified) VALUES ('${fname}','${lname}','${email}','${hash}','${verificationCode}','0')`;

var mailOptions={
 from:'f200147@cfd.nu.edu.pk',
 to:email,
 subject:'Verify Your Rations Account',
 text:"Verification Code: "+verificationCode+"\n"
};
transporter.sendMail(mailOptions,function(error,info){
  if(error)
  console.log(error);
  else
  console.log("email sent");
});
/*let info = transporter.sendMail({
  from: '"Rations" <salihashahid1102@gmail.com>', // sender address
  to: email, // list of receivers
  subject: "Verify Your Rations Account", // Subject line
  text: "Verification Code: "+verificationCode+"\n", // plain text body
  
});*/
conn.query(sql, function (err, results) {
  if (err) throw err;

  res.send("<h1>Data Inserted.</h1>");
});

});

app.post("/registerDietitian",function(req,res){
  var fname=req.body.fname;
  var lname=req.body.lname;
  var email=req.body.email;
  var password=req.body.pass;
  var location=req.body.location;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log(hash);
  const isMatch = bcrypt.compareSync(password, hash);
  console.log(isMatch);
  const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  console.log(verificationCode);
  
  var sql=`INSERT INTO dietitian(fname, lname, email, password, code, verified, location) VALUES ('${fname}','${lname}','${email}','${hash}','${verificationCode}','0','${location}')`;
  /*let info = transporter.sendMail({
    from: '"Rations" <salihashahid1102@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Verify Your Rations Account", // Subject line
    text: "Verification Code: "+verificationCode+"\n", // plain text body
    
  });*/

  var mailOptions={
    from:'f200147@cfd.nu.edu.pk',
    to:email,
    subject:'Verify Your Rations Account',
    text:"Verification Code: "+verificationCode+"\n"
   };
   transporter.sendMail(mailOptions,function(error,info){
     if(error)
     console.log(error);
     else
     console.log("email sent");
   });

  
  conn.query(sql, function (err, results) {
    if (err) throw err;
  
    res.send("<h1>Data Inserted.</h1>");
  });
  
  });

  app.put("/updateUserStatus",function(req,res){
    var email=req.body.email;
    var sql=`UPDATE user SET verified='1' WHERE email = '${email}'`;
    conn.query(sql, function (err, results) {
      if (err) throw err;
    
      res.send("<h1>Verified</h1>");
    });
  });
  app.put("/updateDietitianStatus",function(req,res){
    var email=req.body.email;
    var sql=`UPDATE dietitian SET verified='1' WHERE email = '${email}'`;
    conn.query(sql, function (err, results) {
      if (err) throw err;
    
      res.send("<h1>Verified</h1>");
    });
  });
  
  app.get("/getUserStatus/:email",function(req,res){
    var email=req.params.email;
   // console.log(email);
    var sql=`SELECT code from user where email = '${email}'`;
    conn.query(sql, function (err, results) {
      if (err) throw err;
    
      console.log(results);
      res.send(results);
    });
  });
  app.get("/getDietitianStatus/:email",function(req,res){
    var email=req.params.email;
    var sql=`SELECT code from dietitian where email = '${email}'`;
    conn.query(sql, function (err, results) {
      if (err) throw err;
    console.log(results);
      res.send(results);
    });
  });
  app.get("/loginUser/:email/:password",function(req,res){
    var email=req.params.email;
    var pass=req.params.password;
   console.log(pass);
    var sql=`SELECT * from user where email = '${email}'`;
    conn.query(sql, function (err, results,fields) {
      if (err) throw err;
      
      console.log(results[0].password);
      if(bcrypt.compareSync(pass,results[0].password)){
        console.log("true");
        results[0].password=pass;
      }
      else
      {
        console.log("false");
      }
      res.send(results);
    });
  });
  app.get("/loginDietitian/:email/:password",function(req,res){
    var email=req.params.email;
    var pass=req.params.password;
   console.log(pass);
    var sql=`SELECT * from dietitian where email = '${email}'`;
    conn.query(sql, function (err, results,fields) {
      if (err) throw err;
      
      console.log(results[0].password);
      if(bcrypt.compareSync(pass,results[0].password)){
        console.log("true");
        results[0].password=pass;
      }
      else
      {
        console.log("false");
      }
      res.send(results);
    });
  });
  app.put("/updateUserInfo",function(req,res){
    var email=req.body.email;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var image=req.body.image;
    console.log(lname);
    console.log(email);
    console.log(image);
    var sql=`UPDATE user SET fname='${fname}', lname='${lname}', email='${email}', profilepic='${image}' where email = '${email}'`;
    conn.query(sql, function (err, results) {
      if (err) throw err;
    
      res.send("<h1>Verified</h1>");
    });
  });
  app.put("/updateDietitianInfo",function(req,res){
    var email=req.body.email;
    var fname=req.body.fname;
    var lname=req.body.lname;
    var image=req.body.image;
    var loc=req.body.loc;
    var des=req.body.des;
    console.log(lname);
    console.log(email);
    console.log(image);
    var sql=`UPDATE dietitian SET fname='${fname}', lname='${lname}', email='${email}', profilepic='${image}', location = '${loc}',descrp='${des}' where email = '${email}'`;
    conn.query(sql, function (err, results) {
      if (err) throw err;
    
      res.send("<h1>Verified</h1>");
    });
  });



  app.get("/findDietitian",function(req,res){
    
    var sql=`SELECT * from dietitian`;
    conn.query(sql, function (err, results,fields) {
      if (err) throw err;
      
      
      res.send(results);
    });
  });
var server = app.listen(4000, function () {
  console.log("App running on port 4000");
});


app.get("/findUsers",function(req,res){
    
  var sql=`SELECT * from user`;
  conn.query(sql, function (err, results,fields) {
    if (err) throw err;
    
    
    res.send(results);
  });
});



app.post("/addAppointment",function(req,res){
  var demail=req.body.demail;
  var uemail=req.body.uemail;
  var date=req.body.date;
  var type=req.body.type;
  var sql=`INSERT INTO appointments(demail, uemail, date, type) VALUES ('${demail}','${uemail}','${date}','${type}')`;
  
  conn.query(sql, function (err, results) {
    if (err) throw err;
  
    res.send("<h1>Data Inserted.</h1>");
  });
  
  });

  app.get("/viewAppointments/:email",function(req,res){
    var email=req.params.email;
    
   
    var sql=`SELECT * from appointments where demail = '${email}'`;
    conn.query(sql, function (err, results,fields) {
      if (err) throw err;
      res.send(results);
    });
  });


  app.put("/approveAppointment",function(req,res){
    var demail=req.body.demail;
    var uemail=req.body.uemail;
    var time=req.body.time;
    var link=req.body.link;
    var fee=req.body.fee;
    var sql=`UPDATE appointments SET approved='1' , time = '${time}', link = '${link}', fee='${fee}' where demail = '${demail}' and uemail = '${uemail}'`;
    var mailOptions={
      from:'f200147@cfd.nu.edu.pk',
      to:umail,
      subject:'Appointment Approval Notification',
      text:"Dietitian: "+demail+"\n"+"Time: "+time+"\n"+"Link: "+link+"\n"
     };
     transporter.sendMail(mailOptions,function(error,info){
       if(error)
       console.log(error);
       else
       console.log("email sent");
     });
  
    
    conn.query(sql, function (err, results) {
      if (err) throw err;
    
      res.send("<h1>Verified</h1>");
    });
  });

  app.delete("/delUser", function (req, res) {
    var email = req.body.email;
  
    var sql = `delete from user where email = '${email}'`;
  
    conn.query(sql, function (err, results) {
      if (err) throw err;
  
      console.log(results);
      res.send(results);
    });
  });


  app.delete("/delDietitian", function (req, res) {
    var email = req.body.email;
  
    var sql = `delete from dietitian where email = '${email}'`;
  
    conn.query(sql, function (err, results) {
      if (err) throw err;
  
      console.log(results);
      res.send(results);
    });
  });


  app.get("/userAppointments/:email",function(req,res){
    var email=req.params.email;
    
   
    var sql=`SELECT * from appointments where uemail = '${email}'`;
    conn.query(sql, function (err, results,fields) {
      if (err) throw err;
      res.send(results);
    });
  });