import { Router, Request, Response, NextFunction } from "express";

const productsRouter = Router();

productsRouter.get('/api/products', (req:Request,res:Response, next:NextFunction) => {
  console.log(req.headers.cookie); 
  console.log(req.cookies); //after installing cookie-parser
  console.log(req.signedCookies); // after setting 1- signed: true, 2- app.use(cookieParser("helloworld"));
  console.log(req.signedCookies.hello); // after setting 1- signed: true, 2- app.use(cookieParser("helloworld"));
  // if(req.cookies.hello && req.cookies.hello === 'world'){
  if(req.signedCookies.hello && req.signedCookies.hello === 'world'){
    res.send([
      {name: 'chicken'},
      {name: 'chicken1'},
      {name: 'chicken2'}
    ])
  }
  
  return res.status(403).json({message:'You are not allowed to see this data, please set cookies by calling GET {{url}}/api/users?filter=name&value=Qas2 '})

})


export default productsRouter;
