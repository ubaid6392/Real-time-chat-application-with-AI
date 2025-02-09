import mongoose from "mongoose";
import Project from "../modals/project.modal.js";

export const  creatProject =  async({name, userId})=>{

    if(!name){
        throw new Error('Name is required')
        
    }
    if(!userId){
        throw new Error('user is required')
    }
 console.log(userId)
    const project = await Project.create({
        name, 
        users: [userId]
        
        

    })
    console.log(project);
     return project;

}

export const getAllProjectByUserId = async({userId})=>{
    if(!userId){
        throw new Error('userId is required')
    }
    console.log(userId)

    const allUserProject = await Project.find({
        users: userId
    })
    console.log(allUserProject)
    return allUserProject;

}

export const addUserToProject = async({projectId, users ,userId})=>{
    if(!projectId){
        throw new Error('projectId is required')
        
    }
     if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid projectId')
     }


    if(!users){
        throw new Error('users is required')
    }

    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId)))
        {
            throw new Error('Invalid usersId in users array')
         }
     if(!userId){
            throw new Error('user is required')
        }    
        if(!mongoose.Types.ObjectId.isValid(userId)){
            throw new Error('Invalid userId')
         }   


    const project = await Project.findOne({
        _id:projectId,
        users: userId
    })

    if(!project){
        throw new Error('user not belong to this project')
    }

    const updateproject = await Project.findByIdAndUpdate({_id :projectId},{
        $addToSet:{
            users:{
                $each:users
            }
        }},
    {
        new:true

    })
    return updateproject;
    
    

}

export const getProjectById = async({projectId})=>{
    if(!projectId){
        throw new Error('projectId is required')
        
    }
     if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid projectId')
     }
     const project = await Project.findOne({
        _id:projectId
     }).populate('users')
     return project;

}

export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await Project.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })

    return project;
}

