import React ,{useContext, useState ,useEffect}  from 'react';
import{UserContext} from '../context/user.context.jsx';
import axios from '../config/axios.js';
import {useNavigate} from 'react-router-dom';

const Home = () => {
 const{user} = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const[project , setproject]= useState([])
  const navigate= useNavigate()

  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Project Name:', projectName);
    axios.post('/projects/create', {
      name : projectName,
    }).then((res)=>{
      console.log(res)
     setIsOpen(false);
  })
  .catch((err)=>{
    console.log(err)
  })
  };

  useEffect(()=>{
    axios.get('/projects/all').then((res)=>{
      console.log(res.data)
      setproject(res.data.project)
    }).catch((err)=>{
      console.log(err)
    })
  },[])

  return (
    
    <div>
    <div className='projects flex flex-wrap gap-3'>
    <button
        onClick={() => setIsOpen(true)}
        className= " border flex border-slate-500  m-4 text-black p-4 rounded-md h-[55px]"
      > Create Project
        <i className="ri-link pr-2"></i>
      </button>
      {
      project.map((project)=>(
        <div key={project._id}
        onClick={ ()=> {navigate(`/project`, {
          state:{project}
        })}}
         className='project  flex flex-col cursor-pointer gap-2 p-4
         border border-slate-500 text-black rounded-md  min-w-52 mt-4 hover:bg-slate-200 font-semibold'>
        {project.name}

        <div className='flex gap-2'>
        <p><i className="ri-user-line"></i>Collaborators :</p>
          {project.users.length}
        </div>

        </div>
      ))
      }
    </div>
      
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-50 w-full max-w-md  bg-gray-400 rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">New Project</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i class="ri-close-line"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label 
                    htmlFor="projectName" 
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Project Name
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full p-1 bg-gray-300"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 bg-gray-400 p-2 rounded-md mt-1  border border-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white mt-1 p-2 rounded-md pr-2"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};


export default Home;