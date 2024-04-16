import * as express from "express-serve-static-core";
declare global {
	namespace Express {
		interface Request {
			userIndex?: number;
      // session: {
      //   visited?: boolean;
      // }
      session: session.Session & Partial<session.SessionData> & {
        visited?: string;
        cart?: []
      }
      // session?: Session & Partial<SessionData>;
    }
    // interface Session { 
    //   visited1?: string;
    //   cart?: []
    // }

	}
}
