import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import MyProfile from "./components/MyProfile"; 
import UpdateProfile from "./components/UpdateProfile";

function App() {
  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/home" element={<Login />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
