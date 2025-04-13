import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

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
import store, { persistor } from "./redux/store"; // <-- make sure this matches your file structure
import axios from "axios";
import { setRequests } from "./redux/requestSlice";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";  
import { useEffect } from "react";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/request/receiverAllConnectionReq",
          { withCredentials: true }
        );
        // Update to use the correct key 'receiveRequest'
        dispatch(setRequests(res?.data?.receiveRequest || []));
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    };
  
    fetchRequests(); // Fetch once globally after login
  }, [dispatch]);
  
  return (
    <div
      className="App bg-gradient-to-r from-[#205781] via-[#4F959D] to-[#98D2C0]"
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet /> {/* This will render the routes nested inside the AppLayout */}
      </div>
      <Footer />
    </div>
  );
};

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Use App component for all the routes that follow
    children: [
      {
        path: "/",
        element: <ProtectedRoute />, // Protected route wrapper
        children: [
          { path: "/connections", element: <Connections /> },
          { path: "/myprofile", element: <MyProfile /> },
          { path: "/updateprofile", element: <UpdateProfile /> },
          { path: "/receive-requests", element: <ReceiveRequests /> },
          { path: "/friends", element: <Friends /> },
          { path: "/friendProfile/:id", element: <FriendProfile /> },
        ],
      },
      { path: "/login", element: <Login /> },
    ],
  },
]);

function AppRoot() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={Router} />
      </PersistGate>
    </Provider>
  );
}

export default AppRoot;
