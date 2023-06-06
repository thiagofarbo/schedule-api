import {Router} from 'express'
import {UserController} from '../controllers/UserController';
import { upload } from '../config/multer';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

class UserRoutes{

    private router: Router;
    private userController: UserController;
    private authMiddleware:  AuthMiddleware;

    constructor(){
        this.router = Router();
        this.userController = new UserController();
        this.authMiddleware = new AuthMiddleware();
    }

getRoutes(){
    this.router.post(
    '/', 
    this.authMiddleware.auth.bind(this.authMiddleware),
    this.userController.store.bind(this.userController),
    ); 
    this.router.put
    ('/',
     upload.single('avatar'),
     this.authMiddleware.auth.bind(this.authMiddleware),
     this.userController.update.bind(this.userController),
    );

    this.router.post('/auth', this.userController.auth.bind(this.userController));

    this.router.post('/refreshToken', this.userController.refreshToken.bind(this.userController));
    
    return this.router;
    
}
}

export {UserRoutes}