import "./index.css";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UpdateProfile from "./components/UpdateProfile";
import MyProfile from "./components/MyProfile";
import Login from "./components/Login";
import Connections from "./components/Connections";
import { Provider } from "react-redux";
import ReceiveRequests from "./components/ReceiveRequests";
import Friends from "./components/Friends";
import ProtectedRoute from "./components/ProtectedRoute";
import store from "../src/redux/store";

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
        path: "/",
        element: <ProtectedRoute />,
        children: [
          { path: "/connections", element: <Connections /> },
          { path: "/myprofile", element: <MyProfile /> },
          { path: "/updateprofile", element: <UpdateProfile /> },
          { path: "/receive-requests", element: <ReceiveRequests /> },
          { path: "/friends", element: <Friends /> },
        ],
      },
      { path: "/login", element: <Login /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={Router}></RouterProvider>
    </Provider>
  );
}

export default App;