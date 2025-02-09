import Project from "../modals/project.modal.js";
import  * as projectService from '../services/peoject.service.js';
import {validationResult} from 'express-validator';
import userModal from '../modals/user.js'

//create project

export const creatProject = async(req,res)=>{
    
        const error = validationResult(req);
    
        if(!error.isEmpty()){
            return res.status(400).json({error:error.array()});
        }

        try {
            const email = req.user.email;
            const {name} =  req.body;
            const loggedin = await userModal.findOne({email});
            const userId = loggedin._id;
            
    
            const newproject = await projectService.creatProject({name, userId})
    
            res.status(201).json(newproject);
            
        } catch (error) {
            console.log(error);
            res.status(400).send(error.message);
            

        }
}

// getallproject
 export const getAllProject =  async(req ,  res)=>{

    try {
        const loggedInUser = await userModal.findOne({
            email:req.user.email
        })
        const getAllProject = await projectService.getAllProjectByUserId({
            userId : loggedInUser._id
        })
        return res.status(200).json({
            project: getAllProject,
        })


        
    } catch (err) {
        console.log(err)
        res.status(400).json({error : err.message})
        
    }
 }
 //add user to project

 export const addUserToProject = async(req,res)=>{
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }

    try {
        const {projectId , users} = req.body;
        const loggedInUser = await userModal.findOne({
            email: req.user.email
        })

        const project = await projectService.addUserToProject({
            projectId,
            users,
            userId : loggedInUser._id
        })
        return res.status(200).json({
            project
        })
        
    } catch (err) {
        
        console.log(err)
        res.status(400).json({error : err.message})
        

        
    }

 }

 //get projcect by id
 export const getProjectById = async(req,res)=>{
    const {projectId} = req.params;
    try {
        const project = await projectService.getProjectById({projectId})
    
        return res.status(200).json({
            project
        })
     } catch (err) {
        console.log(err)
        res.status(400).json({error : err.message})
        

        
    }
    
 }


// upadtetree
 export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}
