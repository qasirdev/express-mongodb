/// <reference path="../types/index.d.ts" />
// add above code in a single file OR
//"files": ["types/index.d.ts"] in tsconfig.json

import { Request, Response, NextFunction } from "express-serve-static-core";
import express, { json } from "express";
import {body, checkSchema, matchedData, query, validationResult} from "express-validator"
import { createUserValidationSchema } from "./utils/validationSchemas";

const app=express();
app.use(json())
const PORT= process.env.PORT || 3010

type User ={
  id: number,
  name: string,
  displayName: string
}
const mockUsers: User[] = [
  {id: 1, name: 'Qas1', displayName: 'Qasi1'},
  {id: 2, name: 'Qas2', displayName: 'Qasi2'},
  {id: 3, name: 'Qas3', displayName: 'Qasi3'},
];
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

const resolveIndexByUserId = (req:Request,res:Response, next:NextFunction) => {
  const {
    params: {id}
  } = req

  const parsedId = parseInt(id);
  
  if(isNaN(parsedId)) return res.sendStatus(400);

  const userIndex = mockUsers.findIndex((user) => user.id === parsedId);
  
  if (userIndex === -1) return res.sendStatus(404);
  req.userIndex = userIndex;
  next();
}
app.get('/', (req:Request,res:Response, next:NextFunction) => {
  res.status(201).send({ message: "hello1"});
})

app.get('/api/users',
  query('filter')
  .isString().withMessage("filter should be string")
  .notEmpty().withMessage("filter should be not empty")
  .isLength({min: 3, max: 10}).withMessage("Minmum 3 and maximum 10 characters"),
  query("value")
  .isString().withMessage("value should be string"),
  (req:Request<{query:{filter:string, value: string}}>,res:Response, next:NextFunction) => {
  
  const result = validationResult(req);
  console.log(result);
  
  if (!result.isEmpty()) return res.status(400).json({errors: result.array()});

  const {
    query: {filter, value}
  }  = req;

  if(!filter && !value){
    return res.send(mockUsers);
  }
  
  if(filter && value) {
    return res.send(mockUsers.filter((user) => (user[filter as keyof User] as string).includes(value as string)))
  }
  res.send(mockUsers);
})
app.get('/api/users/:id', resolveIndexByUserId,(req:Request<{id: string}>,res:Response, next:NextFunction) => {
  const userIndex = req.userIndex as number;

  const findUser = mockUsers[userIndex];
  if(!findUser) {
    return res.sendStatus(404);
  }
  res.send(findUser);
})
// app.get('/api/users/:id', (req:Request<{id: string}>,res:Response, next:NextFunction) => {
//   const parsedId = parseInt(req.params.id);
//   if(isNaN(parsedId)) {
//     return res.status(400).json({messaage: 'Bad request. Invalid Id'})
//   }
//   const findUser = mockUsers.find(user => user.id === parsedId);
//   if(!findUser) {
//     return res.sendStatus(404);
//   }
//   res.send(findUser);
// })

type ObjectWithId = {
  id: string
}
app.post('/api/users',
checkSchema(createUserValidationSchema),
(req:Request<{}, ObjectWithId, User>,res:Response, next:NextFunction) => {
  const result = validationResult(req);
  console.log(result);

  if (!result.isEmpty()) return res.status(400).json({errors: result.array()});

  const body = matchedData(req)  as User;
  console.log(body);
  // const {body} = req;
  const newUser: User = {...body, id: mockUsers[mockUsers.length - 1].id + 1};
  mockUsers.push(newUser);
  res.status(201).json({id: newUser.id});;
})
// app.post('/api/users',[
//   body("name")
//   .notEmpty().withMessage('Name is required')
//   .isLength({min: 2, max:8}).withMessage("name shuld beminimum 2, maximum 8"),
//   body("displayName")
//   .notEmpty().withMessage('display name is required'),
//   ], (req:Request<{}, ObjectWithId, User>,res:Response, next:NextFunction) => {
//   const result = validationResult(req);
//   console.log(result);

//   if (!result.isEmpty()) return res.status(400).json({errors: result.array()});

//   const body = matchedData(req)  as User;
//   console.log(body);
//   // const {body} = req;
//   const newUser: User = {...body, id: mockUsers[mockUsers.length - 1].id + 1};
//   mockUsers.push(newUser);
//   res.status(201).json({id: newUser.id});;
// })

app.put('/api/users/:id',resolveIndexByUserId, (req:Request,res:Response) => {
  const userIndex = req.userIndex as number;
  const body = req.body;
  mockUsers[userIndex] = {...body,id:mockUsers[userIndex].id}
  return res.status(200).json(mockUsers);
})
// app.put('/api/users/:id', (req:Request<{id: string}, ObjectWithId, User>,res:Response, next:NextFunction) => {
//   const {
//     params: {id},
//     body
//   } = req

//   const parsedId = parseInt(id);
  
//   if(isNaN(parsedId)) return res.sendStatus(400);

//   const userIndex = mockUsers.findIndex((user) => user.id === parsedId);
  
//   if (userIndex === -1) return res.sendStatus(404);

//   mockUsers[userIndex] = {...body,id:parsedId}
//   return res.status(200).json(mockUsers);
// })

app.patch('/api/users/:id', resolveIndexByUserId,(req:Request<{id: string}, ObjectWithId, User>,res:Response, next:NextFunction) => {
  const userIndex = req.userIndex as number;
  const body = req.body;
  mockUsers[userIndex] = {...mockUsers[userIndex], ...body}
  return res.status(200).json(mockUsers);
})
// app.patch('/api/users/:id', (req:Request<{id: string}, ObjectWithId, User>,res:Response, next:NextFunction) => {
//   const {
//     params: {id},
//     body
//   } = req

//   const parsedId = parseInt(id);

//   if(isNaN(parsedId)) return res.sendStatus(400);

//   const userIndex = mockUsers.findIndex((user) => user.id === parsedId);
  
//   if (userIndex === -1) return res.sendStatus(404);

//   mockUsers[userIndex] = {...mockUsers[userIndex], ...body}
//   return res.status(200).json(mockUsers);
// })

app.delete('/api/users/:id',resolveIndexByUserId, (req:Request<{id: string}, {}, {}>,res:Response, next:NextFunction) => {
  const userIndex = req.userIndex as number;
  mockUsers.splice(userIndex,1);
  res.sendStatus(200);


})
// app.delete('/api/users/:id', (req:Request<{id: string}, {}, {}>,res:Response, next:NextFunction) => {
//   const {
//     params: {id}
//   } = req;
//   const parsedId = parseInt(id);

//   if(isNaN(parsedId)) return res.sendStatus(400);

//   const userIndex = mockUsers.findIndex((user) => user.id === parsedId);

//   if(userIndex === -1) return res.sendStatus(404);
  
//   mockUsers.splice(userIndex,1);
//   res.sendStatus(200);


// })

app.get('/api/products', (req:Request,res:Response, next:NextFunction) => {
  res.send([
    {name: 'chicken'},
    {name: 'chicken1'},
    {name: 'chicken2'}
  ])
})

app.listen(PORT, () => {
  console.log(`server listen at port ${PORT}`);
})