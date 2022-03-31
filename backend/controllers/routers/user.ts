import express from 'express'
import { cabinetList, userList, userInfo } from '../../models/user'
import { createLentLog, createLent, getLentUser, getUser, activateExtension } from '../../models/query'

export const userRouter = express.Router();

userRouter.post('/api/cabinet', (req: any, res: any) => {
    if (!cabinetList) {
        res.status(400).send({ error: 'no cabinet information' });
    } else {
        res.send(cabinetList);
    }
});
userRouter.post('/api/lent_info', async (req: any, res: any) => {
    try {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            res.status(400).send({ error: 'Permission Denied' });
            return ;
        }
        const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
        if (idx === -1) {
            res.status(400).send({ error: 'Permission Denied' });
            return;
        }
        getLentUser().then((resp: any) => {
            const isLent = resp.lentInfo.findIndex((cabinet: any) => (cabinet.lent_user_id == req.session.passport.user.user_id));
            res.send({ lentInfo: resp.lentInfo, isLent: isLent });
        });
    } catch (err: any) {
        console.log(err);
        res.status(400);
        throw err;
    };
});
userRouter.post('/api/lent', async (req: any, res: any) => {
    let errno: number;
    try {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            res.status(400).send({ error: 'Permission Denied' });
            return ;
        }
        const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
        if (idx === -1) {
            res.status(400).send({ error: 'Permission Denied' });
            return;
        }
        await getUser(userList[idx]).then(async (resp: any) => {
            if (resp.lent_id === -1) {
                await createLent(req.body.cabinet_id, req.session.passport.user).then((response: any) => {
                    if (response && response.errno === -1) {
                        errno = -2;
                    } else {
                        errno = req.body.cabinet_id;
                    }
                });
                res.send({ cabinet_id: errno });
            } else {
                res.send({ cabinet_id: -1 });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({ cabinet_id: req.cabinet_id });
        throw err;
    }
});
userRouter.post('/api/return_info', async (req: any, res: any) => {
    try {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            res.status(400).send({ error: 'Permission Denied' });
            return ;
        }
        const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
        if (idx === -1) {
            res.status(400).send({ error: 'Permission Denied' });
            return;
        }
        getUser(userList[idx]).then((resp: any) => {
            res.send(resp);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
        throw err;
    }
});
userRouter.post('/api/return', (req: any, res: any) => {
    try {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            res.status(400).send({ error: 'Permission Denied' });
            return ;
        }
        const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
        if (idx === -1) {
            res.status(400).send({ error: 'Permission Denied' });
            return;
        }
        createLentLog(userList[idx]).then((resp: any) => {
            res.sendStatus(200);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
        throw err;
    }
});
userRouter.post('/api/check', async (req: any, res: any) => {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        res.status(400).send({ error: 'Permission Denied' });
    } else {
        const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
        if (idx === -1) {
            res.status(400).send({ error: 'Permission Denied' });
            return;
        }
        else
            await res.send({user: userList[idx]});
    }
});
userRouter.post('/api/extension', async (req: any, res: any) => {
    try {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            res.status(400).send({ error: 'Permission Denied' });
            return ;
        }
        const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
        if (idx === -1) {
            res.status(400).send({ error: 'Permission Denied' });
            return;
        }
        activateExtension(userList[idx]).then((resp:any)=>{
            res.sendStatus(200);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
        throw err;
    } 
});
