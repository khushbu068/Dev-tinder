import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
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
import MyChat from "./components/MyChat";
import store from "./redux/store";
import { OnlineUsersProvider } from "./context/OnlineUsersContext";

// App layout wrapper
const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const showBackgroundImage = isHomePage || location.pathname === "/login";

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

// Define the router
const router = createBrowserRouter([
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
          { path: "myChat", element: <MyChat /> },
        ],
      },
      { path: "login", element: <Login /> },
    ],
  },
]);

// App component with Redux and Context wrapped
const AppWithProviders = () => {
  const { currentUser } = useSelector((state) => state.users);

  return (
    <OnlineUsersProvider currentUser={currentUser}>
      <RouterProvider router={router} />
    </OnlineUsersProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppWithProviders />
    </Provider>
  );
}

export default App;