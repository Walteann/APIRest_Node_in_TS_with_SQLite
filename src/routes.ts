import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './configs/upload';
import OrphanagesController from './controllers/OrphanagesController';
import UsersController from './controllers/UsersController';

const routes = Router();
const upload = multer(uploadConfig)

routes.get('/orphanages', OrphanagesController.index);
routes.get('/orphanages/:id', OrphanagesController.show);
routes.post('/orphanages', upload.array('images'),OrphanagesController.create);

routes.post('/register', UsersController.create);
routes.delete('/register/:id', UsersController.delete);

routes.post('/autheticate', UsersController.auth);


export default routes;