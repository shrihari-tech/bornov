import React from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
function App() {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;