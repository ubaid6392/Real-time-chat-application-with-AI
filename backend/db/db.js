import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

function connect(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to mongodb")
    })
    .catch((error)=>{
        console.log(`error aa rha ${error}`)


    })
    
}
 export default connect;