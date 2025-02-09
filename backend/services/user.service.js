import userModal from '../modals/user.js';

export const createUser = async({email , password})=>{
    

    if(!email || !password){
        throw new Error('Email and password  are required');
    }

    const hashPassword =  await userModal.hashPassword(password);
    const user = await userModal.create({
        email,  
        password : hashPassword
    })

    return user ;

}


export const getAllUser = async ({userId})=>{
    const users = await  userModal.find({
        _id: {$ne: userId}
    });
    return users;
}