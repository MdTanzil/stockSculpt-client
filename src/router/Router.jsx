import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home";
import DashBoard from "../layouts/DashBoard";
import Error from "../pages/Error";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import PrivateRouter from "./PrivateRouter";
import CreateShop from "../pages/createShop/CreateShop";
import AddProduct from "../pages/deshboard/AddProduct";
import DeshboardHome from "../pages/deshboard/DeshboardHome";
import ManageProduct from "../pages/deshboard/ManageProduct";
import UpdateProduct from "../pages/deshboard/UpdateProduct";
import CheckOut from "../pages/deshboard/CheckOut";

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
          element: <PrivateRouter> <CreateShop></CreateShop> </PrivateRouter>
        
        },
        {
          path:'subscription',
          element: <p>subscription</p>
        }
      ]
    },
    {
      path: "/dashboard",
      element: <DashBoard></DashBoard>,
      errorElement: <Error></Error>,
      children:[
        {
          index: true,
          element: <DeshboardHome></DeshboardHome>
        }
        ,
        {
          path: 'manage-product',
          element: <ManageProduct></ManageProduct>
        }
        ,
        {
          path: 'add-product',
          element: <AddProduct></AddProduct>
        },
        {
          path: 'update-product/:id',
          element:  <UpdateProduct></UpdateProduct>
        }
        ,
        {
          path: 'checkout',
          element:  <CheckOut></CheckOut>
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
