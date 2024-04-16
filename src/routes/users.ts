/// <reference path="../../types/index.d.ts" />
// add above code in a single file OR
//"files": ["types/index.d.ts"] in tsconfig.json

import { Router, Request, Response, NextFunction } from "express";
import { validationResult, query, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants";
import { createUserValidationSchema } from "../utils/validationSchemas";
import { User } from "../utils/user";
import { resolveIndexByUserId } from "../utils/middlewares";

const usersRouter = Router();

usersRouter.get('/api/users',
  query('filter')
  .isString().withMessage("filter should be string")
  .notEmpty().withMessage("filter should be not empty")
  .isLength({min: 3, max: 10}).withMessage("Minmum 3 and maximum 10 characters"),
  query("value")
  .isString().withMessage("value should be string"),
  (req:Request<{query:{filter:string, value: string}}>,res:Response, next:NextFunction) => {    
    
  console.log(req.session);
  console.log('req.session.id:',req.session.id);
  req.sessionStore.get(req.session.id, (err:any, sessionData:any) => {
    if(err) {
      console.log(err);
      return res.status(500)
        .send(`Error while getting user data ${err}`);
    } else {
      console.log('sessionData:',sessionData);
    }
  });
  
  res.cookie('hello','world',{maxAge: 60000 * 60 ,httpOnly:true, signed: true}); // set http only
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

usersRouter.get('/api/users/:id', resolveIndexByUserId,(req:Request<{id: string}>,res:Response, next:NextFunction) => {
  const userIndex = req.userIndex as number;

  const findUser = mockUsers[userIndex];
  if(!findUser) {
    return res.sendStatus(404);
  }
  res.send(findUser);
})
// userRouter.get('/api/users/:id', (req:Request<{id: string}>,res:Response, next:NextFunction) => {
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

usersRouter.post('/api/users',
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

// userRouter.post('/api/users',[
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

usersRouter.put('/api/users/:id',resolveIndexByUserId, (req:Request,res:Response) => {
  const userIndex = req.userIndex as number;
  const body = req.body;
  mockUsers[userIndex] = {...body,id:mockUsers[userIndex].id}
  return res.status(200).json(mockUsers);
})
// userRouter.put('/api/users/:id', (req:Request<{id: string}, ObjectWithId, User>,res:Response, next:NextFunction) => {
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

usersRouter.patch('/api/users/:id', resolveIndexByUserId,(req:Request<{id: string}, ObjectWithId, User>,res:Response, next:NextFunction) => {
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

usersRouter.delete('/api/users/:id',resolveIndexByUserId, (req:Request<{id: string}, {}, {}>,res:Response, next:NextFunction) => {
  const userIndex = req.userIndex as number;
  mockUsers.splice(userIndex,1);
  res.sendStatus(200);


})
// userRouter.delete('/api/users/:id', (req:Request<{id: string}, {}, {}>,res:Response, next:NextFunction) => {
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
export default usersRouter;
