import "./index.css";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UpdateProfile from "./components/UpdateProfile";
import MyProfile from "./components/MyProfile";
import Login from "./components/Login";
import GetAllRequests from "./components/GetAllRequests";

function AppLayout() {
  return (
    <div
      className="App bg-gradient-to-r from-[#205781] via-[#4F959D] to-[#98D2C0]"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

const Router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/home",
        element: <Login />,
      },
      {
        path: "/myprofile",
        element: <MyProfile />,
      },
      {
        path: "/update-profile",
        element: <UpdateProfile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "request",
        element: <GetAllRequests/>
      }
     
    ],
  },
]);

function App() {
  return <RouterProvider router={Router}></RouterProvider>;
}

export default App;