import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/admin">
        <MyProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Main />} />
          </Routes>
        </MyProvider>
      </BrowserRouter>
    );
  }
}

export default App;
