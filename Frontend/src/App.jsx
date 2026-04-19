import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
 <BrowserRouter>
 <Routes>
  <Route path='/' element={<Login />}/>
  <Route path='/register' element={<Register />} />
  <Route path='/home' element={<ProtectedRoute>
    <Home />
  </ProtectedRoute>}/>
 </Routes>
 </BrowserRouter>
  )
}

export default App
