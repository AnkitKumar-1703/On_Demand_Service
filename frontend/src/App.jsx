import "./App.css";
import LandingPage from "./Pages/LandingPage/LandingPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SignIn from "./Pages/SignIn/SignIn.jsx";
import SignInCustomer from "./Pages/SignIn/SignInCustomer.jsx";
import SignInTradesman from "./Pages/SignIn/SignInTradesman.jsx";

import SignUp from "./Pages/SignUp/SignUp.jsx";
import SignUpCustomer from "./Pages/SignUp/SignUpCustomer.jsx";
import SignUpTradesman from "./Pages/SignUp/SignUpTradesman.jsx";

import UserDashboard from "./Pages/UserDashboard/UserDashboard.jsx";
import WorkerDashboard from "./Pages/WorkerDashboard/WorkerDashboard.jsx";

import History from "./Pages/History/History.jsx";


import Favorites from "./Pages/Favorites/Favorites.jsx";
import CustomerProfile from "./Pages/Profile/Profile.jsx";

import WorkerProfile from "./Pages/WorkerProfile/WorkerProfile.jsx"
import WorkerChatPage from "./Pages/WorkerChatPage/WorkerChatPage.jsx";


import ReportBugUser from "./Pages/ReportBugUser/ReportBugUser.jsx";
import ReportBugWorker from "./Pages/ReportBugWorker/ReportBugWorker.jsx";

import AdminPage from "./Admin/AdminPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  { path: "/signupcustomer", 
    element: <SignUpCustomer /> 
  },
  {
    path: "/signuptradesman",
    element: <SignUpTradesman />,
  },
  { path: "/signup", 
    element: <SignUp /> 
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  { path: "/signincustomer", 
    element: <SignInCustomer /> 
  },
  {
    path: "/signintradesman",
    element: <SignInTradesman />,
  },
  {
    path: "/customer/dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/customer/dashboard/history",
    element: <History />,
  },
  {
    path : "/customer/dashboard/favorites",
    element: <Favorites />
  },
  {
    path : "/customer/dashboard/profile",
    element: <CustomerProfile />
  },

  {
    path : "/provider/dashboard",
    element: <WorkerDashboard />
  },
  {
    path:"/provider/dashboard/updateprofile",
    element:<WorkerProfile/>
  },
  {
    path : "/provider/dashboard/ChatWithCustomer",
    element: <WorkerChatPage />
  },
  {
    path : "/customer/dashboard/reportbug",
    element: <ReportBugUser />
  },
  {
    path : "/provider/dashboard/reportbug",
    element: <ReportBugWorker />
  },
  {
    path : "/admin",
    element: <AdminPage />
  },
]);

const App = () => {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
};

export default App;
