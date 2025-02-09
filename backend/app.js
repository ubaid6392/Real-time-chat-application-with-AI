import  'dotenv/config';
import router from './router/user.router.js'
import projectroute from './router/project.router.js';
import aiRoutes from './router/ai.route.js';

import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Project from './modals/project.modal.js';
import { generateResult } from './services/ai.service.js';

import { Server  } from 'socket.io'



connect();
const app  =  express();
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port =  process.env.PORT || 4000;

app.get("/" , (req , res)=>{
    res.send('hello world')
})
app.use(cookieParser());

app.use('/users',router);
app.use('/projects',projectroute)
app.use('/ai', aiRoutes)




// socket io connection


const server = http.createServer(app);
const io =  new Server(server, {
    cors:{
        origin:'*'
    }
});

io.use(async (socket, next) => {
 try {
   const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
   const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }


        socket.project = await Project.findById(projectId);

        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }


        socket.user = decoded;

        next();

    } catch (error) {
        next(error)
    }

})


io.on('connection',(socket) =>{
    socket.roomId = socket.project._id.toString()


    console.log('a user connected');
    socket.join(socket.roomId);

    socket.on('project-message', async (data) => {

        const message = data.message;

        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if (aiIsPresentInMessage) {


            const prompt = message.replace('@ai', '');

            const result = await generateResult(prompt);


            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            })


            return
        }


    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.roomId)
    });
});


    server.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);



 })
export default app ;