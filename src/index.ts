import { Request, Response, NextFunction } from "express-serve-static-core";
import express, { json } from "express";
import router from "./routes";
import cookieParser from "cookie-parser";

const app=express();
app.use(cookieParser("helloworld"));
app.use(json())
const PORT= process.env.PORT || 3010



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
app.use(router)

app.get('/', (req:Request,res:Response, next:NextFunction) => {
  res.status(201).send({ message: "hello1"});
})

app.listen(PORT, () => {
  console.log(`server listen at port ${PORT}`);
})
