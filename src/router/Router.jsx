import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home";
import DashBoard from "../layouts/DashBoard";
import Error from "../pages/Error";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import PrivateRouter from "./PrivateRouter";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      errorElement: <Error></Error>,
      children:[
        {
           index:true,
           element: <Home></Home> 
        },
        {
          path: "create-store",
          element: <PrivateRouter>  <h1>store</h1></PrivateRouter>
        
        }
      ]
    },
    {
      path: "/dashboard",
      element: <DashBoard></DashBoard>,
      errorElement: <Error></Error>,
      children:[
        {
          path:'home',
          element: <h2> home</h2>
        }
      ]

    },
    {
      path: "/login",
      element:<Login></Login>
    }
    ,
    {
      path: "/register",
      element:<Register></Register>
    }

  ]);


export default router;
