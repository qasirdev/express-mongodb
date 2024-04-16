import { Router, Request, Response, NextFunction } from "express";
import session from "express-session";

const productsRouter = Router();

productsRouter.get('/api/products', (req:Request,res:Response, next:NextFunction) => {
  console.log(req.headers.cookie); 
  console.log(req.cookies); //after installing cookie-parser
  console.log(req.signedCookies); // after setting 1- signed: true, 2- app.use(cookieParser("helloworld"));
  console.log(req.signedCookies.hello); // after setting 1- signed: true, 2- app.use(cookieParser("helloworld"));
  // if(req.cookies.hello && req.cookies.hello === 'world'){
  if(req.signedCookies.hello && req.signedCookies.hello === 'world'){
    res.send([
      {id: 1,name: 'chicken'},
      {id: 2,name: 'chicken1'},
      {id: 4,name: 'chicken2'}
    ])
  }
  
  return res.status(403).json({message:'You are not allowed to see this data, please set cookies by calling GET {{url}}/api/users?filter=name&value=Qas2 '})

})

productsRouter.get('/api/products/2', (req:Request,res:Response, next:NextFunction) => {
  // console.log(req.session);
  // console.log(req.session.id);
  // console.log(req.session.cookie);

  req.session.visited = true
  // console.log( typeof req.session.visited);
  console.log(req.session);
  const id =parseInt(req.params.id);
  if(!isNaN(id)){
    return res.status(404).json({message:'Not found'});
  }else{
    return res.json({id:'2', name:"Chicken Burger"});
  }
})

export default productsRouter;
