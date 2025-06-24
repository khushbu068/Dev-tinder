import "./index.css";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UpdateProfile from "./components/UpdateProfile";
import MyProfile from "./components/MyProfile";
import Login from "./components/Login";
import Connections from "./components/Connections";
import ReceiveRequests from "./components/ReceiveRequests";
import Friends from "./components/Friends";
import ProtectedRoute from "./components/ProtectedRoute";
import FriendProfile from "./components/FriendProfile";
import Chat from "./components/Chat";

import store from "./redux/store";
import { setRequests } from "./redux/requestSlice";
import { setAuthenticated } from "./redux/userSlice"; // ✅ Added import

// App layout component
const AppLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const showBackgroundImage = isHomePage || location.pathname === "/login";

 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setAuthenticated(true)); // ✅ Dispatch setAuthenticated from redux
    }
  }, [dispatch]);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "relative",
        backgroundImage: showBackgroundImage
          ? "url('/developer background.jpg')"
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
      }}
    >
      {isHomePage && (
        <div className="absolute top-1/3 w-full text-center z-10 px-4">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg tracking-tight font-[Poppins]">
            Where Developers Connect,
            <br className="hidden md:block" />
            Collaborate & Code Together.
          </h1>
        </div>
      )}

      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// Define routes
const Router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          { path: "connections", element: <Connections /> },
          { path: "myprofile", element: <MyProfile /> },
          { path: "updateprofile", element: <UpdateProfile /> },
          { path: "receive-requests", element: <ReceiveRequests /> },
          { path: "friends", element: <Friends /> },
          { path: "friendProfile/:id", element: <FriendProfile /> },
          { path: "chat/:id", element: <Chat /> },
        ],
      },
      { path: "login", element: <Login /> },
    ],
  },
]);

// Root app component
function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={Router} />
    </Provider>
  );
}

export default App;
