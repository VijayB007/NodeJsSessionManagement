const express=require('express');

const session =require('express-session');
const app=express();
const path =require('path');
const pool = require('./db')
const hbs= require('hbs');
app.set('view engine', hbs)
app.set('views',path.join(__dirname,'views'));


app.use (express.json());

app.use(express.urlencoded({extended:false}));

app.use(session({

     secret:'your_security_key',

     resave:true,

     saveUninitialized:true,

     cookie:{maxAge:60000}

}))



app.get('/',(req,res)=>{
    res.render(path.join(__dirname,'views','login.hbs'))
})

app.post('/login',(req,res)=>{
    const{username, password}=req.body;
    console.log('username',username);
    console.log('pass',password);

     pool.query('SELECT count(*)FROM users WHERE username=$1 AND password=$2',[username,password],(error,results)=>{
        if(error) throw error;
        responcedata=results.rows;
        console.log("responcedata",responcedata);
        console.log("count",responcedata[0].count)
      
        if(responcedata[0].count==1){
            data ={
                username:username
            }
            req.session.isLoggedIn=true;
            req.session.username=username;
            res.render(path.join(__dirname,'views','dashboard.hbs'),{data:data})
           }else{
            data ={
                errormessage:"username or pass wrong"
            }
               res.render(path.join(__dirname,'views','login.hbs'),{data:data})
           }
        

        
    })
   
    app.get('/login',(req,res)=>{
        console.log("/login started")
        const isLoggedIn=req.session.isLoggedIn;
        const username =req.session.username;   
        data ={
            username:username
        }
        if(isLoggedIn){
            res.render(path.join(__dirname,'views','dashboard.hbs'),{data:data});
        }else {
            res.render(path.join(__dirname,'views','login.hbs'));
        }

    })


    

    app.get('/dashboard',(req,res)=>{
        const isLoggedIn=req.session.isLoggedIn;
        const username =req.session.username;   
        data ={
            username:username
        }
        if(isLoggedIn){
            res.render(path.join(__dirname,'views','dashboard.hbs'),{data:data});
        }else {
            res.render(path.join(__dirname,'views','login.hbs'));
        }

    })

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){ 
            console.log(err);
        }else{
            res.render(path.join(__dirname,'views','login.hbs'))
        }
    })
})


})

app.listen(8000,()=>{
    console.log('server started at 8000');
})