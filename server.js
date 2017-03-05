'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const localStorage = require('localStorage');

const app = express();
app.use(express.static(__dirname));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());
//app.use('/photos',express.static(path.join(__dirname, '/photos')));
//app.use('/css',express.static(path.join(__dirname, '/css/style.css')));

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'mico',
  database : 'farm_monitoring'
});

connection.connect()

app.get('/', function(req,res){
	res.sendFile(__dirname + '/views/Login.html');
});

app.get('/login_check', function(req,res){
	console.log(req.query);
	var data = {
	 username: req.query.username,
	 password: req.query.password
	}

	var query ='SELECT * from user WHERE username = ? and password = ?'
	connection.query(query, [data.username,data.password], (err,result) => {
	if(err){
		return res.status(500).send(err);
		//console.log("Wrong username/password");		
	}
	else if (!result.length){
		return res.status(404).send({message: "Wrong username/password"});
	}
	else{
		localStorage.username = result[0].username;
		localStorage.password = result[0].password;
		return res.send({message: "Success"});
	}
	});
});

app.get('/homepage', function(req,res){
	if(localStorage.length == 0){
		res.redirect('/');
	}else{
	res.sendFile(__dirname + '/views/home.html');	
	}
});

//FARM ACTIVITY
app.get('/view_activities', function(req,res){
	if(localStorage.length == 0){
		res.redirect('/');
	}else{
	res.sendFile(__dirname + '/views/FarmActivities.html');
	}
});

app.get('/farm1/activityview', function(req,res){
	connection.query("SELECT * from farmActivity",function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

app.get('/farm1/activityview/:activityName', function(req,res){
	connection.query("SELECT * from farmActivity WHERE activityName like ?", '%' + req.params.activityName + '%',function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

app.get('/viewprofile', function(req,res){
	if(localStorage.length == 0){
		res.redirect('/');
	}else{
	res.sendFile(__dirname + '/views/profile.html');
	}
});


//PLOT INFORMATION
app.get('/view_plotinformation', function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	res.sendFile(__dirname + '/views/PlotInformation.html');
});

app.get('/farm1/plotview', function(req,res){
	connection.query("SELECT * from plot",function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

app.get('/farm1/plotview/:plotId', function(req,res){
	connection.query("SELECT * from plot WHERE plotId like ?", '%' + req.params.plotId + '%',function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

//FARM ACTIVITY
app.get('/view_personnel', function(req,res){
	if(localStorage.length == 0){
		res.redirect('/');
	}else{
	res.sendFile(__dirname + '/views/FarmPersonnels.html');
	}
});

app.get('/farm1/personnelview', function(req,res){
	connection.query("SELECT * from user where type='Personnel'",function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

app.get('/farm1/personnelview/:name', function(req,res){
	connection.query("SELECT * from user WHERE name like ?", '%' + req.params.name + '%',function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

//FOR REQUESTS
app.get('/view_request', function(req,res){
	if(localStorage.length == 0){
		res.redirect('/');
	}else{
	res.sendFile(__dirname + '/views/ActivityRequests.html');
	}
});

app.get('/farm1/requestview', function(req,res){
	connection.query("SELECT * from request",function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

app.get('/farm1/requestview/:requestNo', function(req,res){
	connection.query("SELECT * from request WHERE requestNo like ?", '%' + req.params.requestNo + '%',function(err,rows,fields){
	if(!err){
		res.send(rows);
	}
	});
});

//MODAL FOR ADDING
app.post('/add/farmactivity/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var farmActivity1 = {
	    activityName: req.body.activityName,
        activityStatus: req.body.activityStatus,
        startDate: req.body.startDate,
        dueDate: req.body.dueDate,
        requestNo: req.body.requestNo
	}
	connection.query("INSERT into farmActivity set ?",farmActivity1,function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Successfully Added: " + farmActivity1.activityName)
	}
	});
});

app.post('/add/request/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var farmRequest = {
        requestDate: req.body.requestDate,
        username: req.body.username,
        requestDefinition: req.body.requestDefinition
	}
	connection.query("INSERT into request set ?",farmRequest,function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Successfully Added: " + farmRequest.requestNo)
	}
	});
});

app.post('/add/plotinformation/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var plotinfo = {
        plotId: req.body.plotId,
        area: req.body.area,
        capacity: req.body.capacity,
        plotStatus: req.body.plotStatus,
        username: req.body.username
	}
	connection.query("INSERT into plot set ?",plotinfo,function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Successfully Added: " + plotinfo.plotId)
	}
	});
});

app.post('/add/personnel/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var farmperson = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        birthday: req.body.birthday,
        age: req.body.age,
        type: req.body.type
 	}
	connection.query("INSERT into user set ?",farmperson,function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Successfully Added: " + farmperson.username)
	}
	});
});


app.post('/edit/farmactivity/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var farmActivity1 = {
        activityStatus: req.body.activityStatus,
        startDate: req.body.startDate,
        dueDate: req.body.dueDate
	}
	var checker = {
		activityName: req.body.activityName
	}

	connection.query("UPDATE farmActivity set ? where ?",[farmActivity1,checker],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Update Complete!")
	}
	});
});

app.post('/edit/Personnel/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var personnel1 = {
	    password: req.body.password,
        birthday: req.body.birthday,
        age: req.body.age
    }
    var checker1 = {
    	username: req.body.username
    }
	connection.query("UPDATE user set ? where ?",[personnel1,checker1],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Successfully Updated: " + personnel1.name)
	}
	});
});

app.post('/edit/plotinfo/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var plot1 = {
		area: req.body.area,
		capacity: req.body.capacity,
		plotStatus: req.body.plotStatus	    
    }
    var checker2 = {
    	plotId: req.body.plotId
    }
	connection.query("UPDATE plot set ? where ?",[plot1,checker2],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Update Complete!")
	}
	});
});

app.post('/edit/request/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
	var request1 = {
		requestDate: req.body.requestDate,
		requestDefinition: req.body.requestDefinition,
    }
    var checker3 = {
    	requestNo: req.body.requestNo
    }
	connection.query("UPDATE request set ? where ?",[request1,checker3],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Update Complete!")
	}
	});
});

app.post('/delete/request/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
    var remove1 = {
    	requestNo: req.body.requestNo
    }
	connection.query("DELETE from request where ?",[remove1],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Update Complete!")
	}
	});
});

app.post('/delete/Personnel/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
    var remove2 = {
    	username: req.body.username
    }
	connection.query("DELETE from user where ?",[remove2],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Update Complete!")
	}
	});
});

app.post('/delete/activity/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
    var remove3 = {
    	activityName: req.body.activityName
    }
	connection.query("DELETE from farmActivity where ?",[remove3],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Update Complete!")
	}
	});
});


app.post('/delete/plot/',function(req,res){
	if(localStorage.length==0){
		res.redirect('/');
	}
	console.log(req.body)
    var remove4 = {
    	plotId: req.body.plotId
    }
	connection.query("DELETE from plot where ?",[remove4],function(err,rows,fields){
	if(err){
		console.log(err)
	}
	else{
		res.send("Update Complete!")
	}
	});
});







app.post('/login', function(req,res){
	res.send('login')
});

app.get('/logout', function(req,res){
	localStorage.clear();
	res.redirect('/')
});

app.get('/styles', function(req, res){
	res.sendFile(__dirname + 'css/style.css')
})

app.get('/scripts', function(req, res){
	res.sendFile(__dirname + '/style.js')
})


app.listen(3000, () => {
	console.log('Server listening on PORT 3000');
});
