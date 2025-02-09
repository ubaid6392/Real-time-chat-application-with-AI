import {Router} from 'express';
import { body } from 'express-validator';
import * as projectController from '../controller/project.js';
import * as authmiddleware from '../middleware/auth.js'

const router=  Router();

router.post('/create',  authmiddleware.authUser,
    body('name').isString().withMessage('name is required'),projectController.creatProject)
    
router.get('/all',  authmiddleware.authUser,
    projectController.getAllProject) 

router.put('/add-user',  authmiddleware.authUser,
    body('projectId').isString().withMessage('project id is required'),
    body('users').isArray({min:1}).withMessage('User must be an array').bail()
    .custom((users)=>users.every(user => typeof user === 'string')).withMessage('Each user must be a String'),
        projectController.addUserToProject)   
        
router.get('/get-project/:projectId',  authmiddleware.authUser,
            projectController.getProjectById)  
            
          router.put('/update-file-tree',
                authmiddleware.authUser,
                body('projectId').isString().withMessage('Project ID is required'),
                body('fileTree').isObject().withMessage('File tree is required'),
                projectController.updateFileTree
            )
                        

export default router;