import { Request, Response, NextFunction } from "express-serve-static-core";
import express, { json } from "express";

import { mockUsers } from "./constants";

export const resolveIndexByUserId = (req:Request,res:Response, next:NextFunction) => {
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
