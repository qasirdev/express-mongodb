import { Router } from "express";
import usersRouter from "./users";
import productsRouter from "./products";

const  router = Router();
router.use(usersRouter);
router.use(productsRouter);

export default router;
