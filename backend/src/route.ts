import express, { response } from 'express';
import passport from 'passport';
import authCheck from './middleware/auth';
import { cabinetList, userList } from './user'
import { checkUser, createLentLog, createLent, getLentUser, getUser } from './db/query'

export const router = express.Router();

router.get('/auth/login', passport.authenticate('42'));
router.post('/', authCheck, function (req: any, res: any) {
    res.json({ test: req.user });
});

router.get(
    "/auth/login/callback",
    passport.authenticate("42", {
        failureMessage: "LOGIN FAILED :(",
        failureRedirect: "/",
    }),
    async function (req: any, res: any) {
        const idx = userList.findIndex((user) => user.access === req.session.passport.user.access)
if (idx === -1) {
            res.status(400).send({ error: "Permission Denied" });
            return;
        }
        try {
            await checkUser(req.session.passport.user).then((resp: any) => {
                if (!resp) {
                    res.status(400).send({ error: "Permission Denied" });
                    return;
                }
                if (resp.lent_id !== -1) {
                    res.redirect('/return');
                } else {
                    res.redirect('/lent');
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
);

router.post('/auth/logout', (req: any, res: any) => {
    const idx = userList.findIndex((user) => user.access === req.session.passport.user.access)
    if (idx !== -1) {
        userList.splice(idx, 1);
    }
    else {
        res.status(400).send({ error: "Permission Denied" });
        return;
    }
    req.logout();
    req.session = null;
    res.send({ result: 'success' });
});

router.post("/api/cabinet", (req: any, res: any) => {
    if (!cabinetList) {
        res.status(400).send({ error: "no cabinet information" });
    }
    else {
        res.send(cabinetList);
    }
})
<<<<<<< HEAD

router.post("/api/lent_info", async (req: any, res: any) => {
    try {
        const idx = userList.findIndex((user) => user.access === req.session.passport.user.access)
        if (idx === -1) {
            res.status(400).send({ error: "Permission Denied" });
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
})

router.post('/api/lent', async (req: any, res: any) => {
    const idx = userList.findIndex((user) => user.access === req.session.passport.user.access);
    let errno: number;
    try {
        if (idx === -1) {
            res.status(400).send({ error: "Permission Denied" });
            return;
        }
        await getUser(userList[idx]).then(async (resp: any) => {
            if (resp.lent_id === -1) {
                await createLent(req.body.cabinet_id, req.session.passport.user).then((response:any)=>{
                    console.log('response.err');
                    console.log(response);
                    if (response && response.errno === -1){
                        errno = -2;
                    }
                    else{
                        errno = req.body.cabinet_id;
                    }
                });
                res.send({ cabinet_id: errno });
            }
            else {
                res.send({ cabinet_id: -1 });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({ cabinet_id: req.cabinet_id });
    }
})

router.post("/api/return_info", async (req: any, res: any) => {
    try {
        const idx = userList.findIndex((user) => user.access === req.session.passport.user.access)
        if (idx === -1) {
            res.status(400).send({ error: "Permission Denied" });
            return;
        }
        getUser(userList[idx]).then((resp: any) => {
            res.send(resp);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
})

router.post("/api/return", (req: any, res: any) => {
    try {
        const idx = userList.findIndex((user) => user.access === req.session.passport.user.access)
        if (idx === -1) {
            res.status(400).send({ error: "Permission Denied" });
            return;
        }
        createLentLog(userList[idx]).then((resp:any) => {
            res.sendStatus(200);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
})

router.post("/api/check", (req: any, res: any) => {
    console.log('api check!!!');
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        console.log('fail');
        res.status(400).send({ result: 'failed' });
    } else {
        console.log('success');
        const idx = userList.findIndex((user) => user.access === req.session.passport.user.access)
        if (idx === -1) {
            res.status(400).send({ error: "Permission Denied" });
            return;
        }
        res.send(userList[idx]);
    }
});
