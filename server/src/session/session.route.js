

import { Router } from "express";
import getSession from "./session.controller.js";

const SessionRouter = Router() ;


SessionRouter.get("/",getSession); 

export default SessionRouter;