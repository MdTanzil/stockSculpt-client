import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home";
import DashBoard from "../layouts/DashBoard";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      children:[
        {
           index:true,
           element: <Home></Home> 
        }
      ]
    },
    {
      path: "/dashboard",
      element: <DashBoard></DashBoard>,
    },

  ]);


export default router;
