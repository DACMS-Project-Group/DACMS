import express from 'express';
import UserController from '../controllers/UserController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
    '/create', 
    UserController.createUser.bind(UserController)
);

router.post(
    '/login', 
    UserController.login.bind(UserController)
);

router.post(
    '/logout', 
    UserController.logout.bind(UserController)
);

router.get(
    '/fetch/:id', 
    authenticate, 
    UserController.getUserById.bind(UserController)
);

router.get(
    '/perms', 
    authenticate, 
    UserController.checkUserPerms.bind(UserController)
);


export default router;