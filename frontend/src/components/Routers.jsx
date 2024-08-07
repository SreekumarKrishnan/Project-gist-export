
import{Routes, Route} from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import Project from './Project'

const routers = ({login}) => {
  return (
    <Routes>
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/login' element={<Login login={login}/>} />
      <Route path='/projects/:id' element={<Project/>} />
    </Routes>

  )
}

export default routers