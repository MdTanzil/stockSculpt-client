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
import Subscription from "../pages/Subscription";
import Payment from "../pages/Payment";
import AdminDashBoard from "../layouts/AdminDashBoard";
import MenageShop from "../pages/Admin/MenageShop";
import AdminHome from "../pages/Admin/AdminHome";
import ManageUsers from "../pages/Admin/ManageUsers";
import Watch from "../pages/Watch";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "create-store",
        element: (
          <PrivateRouter>
            {" "}
            <CreateShop></CreateShop>{" "}
          </PrivateRouter>
        ),
      },
      {
        path: "/subscription",
        element: (
          <PrivateRouter>
            <Subscription></Subscription>
          </PrivateRouter>
        ),
      },
      {
        path: "/payment",
        element: (
          <PrivateRouter>
            <Payment></Payment>
          </PrivateRouter>
        ),
      },
      {
        path: "/watch",
        element: <Watch></Watch>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashBoard></DashBoard>,
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <PrivateRouter><DeshboardHome></DeshboardHome>,</PrivateRouter>
      },
      {
        path: "manage-product",
        element: <PrivateRouter><ManageProduct></ManageProduct>,</PrivateRouter>
      },
      {
        path: "add-product",
        element:<PrivateRouter> <AddProduct></AddProduct>,</PrivateRouter>
      },
      {
        path: "update-product/:id",
        element: <PrivateRouter><UpdateProduct></UpdateProduct>,</PrivateRouter>
      },
      {
        path: "checkout",
        element: <PrivateRouter><CheckOut></CheckOut>,</PrivateRouter>
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashBoard></AdminDashBoard>,
    errorElement:<Error></Error>,
    children: [
      {
        path: "",
        element:<PrivateRouter><AdminHome></AdminHome>,</PrivateRouter> 
      },
      {
        path: "manageProduct",
        element: <PrivateRouter><MenageShop></MenageShop>,</PrivateRouter>
      },

      {
        path: "users",
        element:<PrivateRouter> <ManageUsers></ManageUsers></PrivateRouter>
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
]);

export default router;
