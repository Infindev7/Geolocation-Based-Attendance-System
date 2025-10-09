import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import User from './components/user/User';
import AdminLogin from './components/admin/AdminLogin';
import Admin from './components/admin/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path='/adminLogin' element={<AdminLogin/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
