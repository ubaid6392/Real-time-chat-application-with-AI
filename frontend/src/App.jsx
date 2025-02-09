
import AppRoute from './route/AppRoute'
import './App.css';
import {UserProvider} from './context/user.context'


function App() {
 return (
  
  <UserProvider>
  <AppRoute/>
  </UserProvider>
   

)
}

export default App;
