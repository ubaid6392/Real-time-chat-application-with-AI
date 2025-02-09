import React from 'react';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import Login from '../screen/login';
import Register from '../screen/ragister';
import Home from '../screen/home';
import Project from '../screen/project';
import UserAuth from '../auth/UserAuth';

export const AppRoute = () => {
  return (
    <BrowserRouter>
        <Routes>
        <Route path='/' element={<UserAuth><Home/></UserAuth>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/project' element={<UserAuth><Project/></UserAuth>}/>



        </Routes>
    </BrowserRouter>
  )
}
export default AppRoute;