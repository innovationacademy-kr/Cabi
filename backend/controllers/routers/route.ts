import passport from 'passport'
import authCheck from '../middleware/auth'
import { userList, userInfo } from '../../models/user'
import { checkUser } from '../../models/query'
import { userRouter } from './user'

export const router = userRouter;

router.get('/auth/login', passport.authenticate('42'));
router.post('/', authCheck, (req: any, res: any) => {
    res.json({ test: req.user });
});
router.get(
    '/auth/login/callback',
    passport.authenticate('42', {
        failureMessage: 'LOGIN FAILED :(',
        failureRedirect: '/',
    }),
    async (req: any, res: any) => {
        const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
				
		if (idx === -1) {
			res.status(400).send({ error: 'Permission Denied' });
			return;
		}
        try {
            await checkUser(req.session.passport.user).then((resp: any) => {
                if (!resp) {
                    res.status(400).send({ error: 'Permission Denied' });
                    return;
                }
                if (resp.lent_id !== -1) {
                    res.redirect('/return');
                } else {
                    res.redirect('/lent');
                }
            });
        } catch (err) {
            //console.log(err);
            //res.status(400).json({ error: err });
            res.status(400).send({error: err});
        }
    }
);
router.post('/auth/logout', (req: any, res: any) => {
    const idx = userList.findIndex((user: userInfo) => user.access === req.session.passport.user.access);
    if (idx !== -1) {
        userList.splice(idx, 1);
    } else {
        res.status(400).send({ error: 'Permission Denied' });
        return;
    }
    req.logout();
    req.session = null;
    res.send({ result: 'success' });
});
