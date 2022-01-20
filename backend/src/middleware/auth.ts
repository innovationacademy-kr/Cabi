export default function authCheck(req:any, res:any, next:any){
    if (req.user){
        console.log("success auth");
        next();
    }
    else{
        console.log("failed to auth");
        res.status(401).json({
            authenticated: false,
            message: "User has not been authenticated"
        });
    }
};
