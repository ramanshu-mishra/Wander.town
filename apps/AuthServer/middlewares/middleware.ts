import type { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if ( req.isAuthenticated()) { 
        console.log(req.user);
        return next();
    }
    res.redirect("/unAuthorized-session");
}
