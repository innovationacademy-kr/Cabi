import express from 'express';

export const router = express.Router();

router.post('/auth/login', (req:any, res:any, next:any)=>{
    console.log(req);
    // console.log(req.params);
    res.send({
        data: 'hi'
    })
    // console.log(req.body);
    // console.log(req.query);
});