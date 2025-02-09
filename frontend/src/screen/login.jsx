
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';
import { useState , useContext } from 'react';
import{UserContext} from '../context/user.context.jsx'


const Login = () => {

  const[email,  setemail] = useState('');
  const [password, setpassword] = useState('');

  const {setUser} = useContext(UserContext)
  const  navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    axios.post( '/users/login', {
      email,
      password
    }).then((res)=>{
      console.log(res.data)
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user)
      navigate('/')
    }).catch((err)=>{
      console.log(err.response.data)
    })

  }



  return ( 
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-8">Login</h1>
        <form  
        onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <input
              onChange={(e)=>setemail(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="password">
              Password
            </label>
            <input
              onChange={(e)=>setpassword(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 rounded"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-4">
          <Link to="/register" className="text-blue-500 hover:underline">
            Don't have an account? Create one.
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};


export default Login;
