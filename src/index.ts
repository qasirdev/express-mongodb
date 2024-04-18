import { Request, Response, NextFunction } from "express-serve-static-core";
import express, { json } from "express";
import router from "./routes";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants";
import passport from "passport";
import "./strategies/local-strategy";

const PORT= process.env.PORT || 3010

const app=express();
app.use(cookieParser("helloworld"));
app.use(json())

//GET
//POST
//PUT - update entire user, include every single filed in the requst body even not update it
//PATCH - update partial data,eg. only update name.
//DELETE

const loggingMiddleware = (req:Request,res:Response, next:NextFunction) => {
  console.log(`${req.method} - ${req.url}`);
  next();
}
app.use(loggingMiddleware);
app.use(session({
  secret:"qasirDev",
  resave:false,
  saveUninitialized:false,
  cookie: {
    maxAge: 60000 * 60
  }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(router)


app.listen(PORT, () => {
  console.log(`server listen at port ${PORT}`);
})


app.get('/', (req:Request,res:Response, next:NextFunction) => {
  console.log('req.session.id:',req.session.id);
  req.session.visited = true;
  res.cookie('hello','world',{maxAge: 30000, signed: true});
  res.status(201).send({message:'Hello'});
})

app.post('/api/auth',(req:Request,res:Response, next:NextFunction) => {
  const {body: {username, password}} = req;
  console.log(username,password);
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password) 
    return res.status(401).send({message: 'BAD request'});

  req.session.user = findUser;
  return  res.status(200).send(findUser);
})

app.get('/api/auth/status', (req:Request,res:Response, next:NextFunction) => {
  req.sessionStore.get(req.sessionID,(err,user)=>{ 
    console.log('user:',user);
   })
  return req.session.user ? 
    res.status(200).send(req.session.user) : 
    res.status(401).send({message: 'Not Authenticated'})
})

app.post('/api/cart', (req:Request,res:Response, next:NextFunction) => {
  if(!req.session.user) return res.sendStatus(401);

  const {body: item} = req;
  const {cart} = req.session;
  if(cart) {
    cart.push(item)
  } else {
    req.session.cart=[];
    req.session.cart.push(item);
  }

  return res.status(200).send(item);
})

app.get('/api/cart', (req:Request,res:Response, next:NextFunction) => {
  if(!req.session.user) return res.sendStatus(401);

  return res.status(200).send(req.session.cart)
})

app.post('/api/authwithpassport',passport.authenticate('local'),(req:Request,res:Response, next:NextFunction) => {
  return res.sendStatus(200);
})

app.get('/api/authwithpassport/status', (req:Request,res:Response, next:NextFunction) => {
  console.log('inside api/auth/with/passport/status');
  console.log(req.user);
  console.log(req.session);

  return req.user ? res.send(req.user) : res.sendStatus(401);
})

app.post('/api/authwithpassport/logout', (req:Request,res:Response, next:NextFunction) => {
  if(!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if(err) return res.sendStatus(400);
    return res.status(200);
  })
})

