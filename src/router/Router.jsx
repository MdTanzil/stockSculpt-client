import ManageOrder from "@/pages/deshboard/ManageOrder";
import { createBrowserRouter } from "react-router-dom";
import AdminDashBoard from "../layouts/AdminDashBoard";
import DashBoard from "../layouts/DashBoard";
import Main from "../layouts/Main";
import AdminHome from "../pages/Admin/AdminHome";
import ManageUsers from "../pages/Admin/ManageUsers";
import MenageShop from "../pages/Admin/MenageShop";
import CreateShop from "../pages/createShop/CreateShop";
import CheckOut from "../pages/deshboard/CheckOut";
import DashboardHome from "../pages/deshboard/DashBoardHome";
import ManageProduct from "../pages/deshboard/ManageProduct";
import UpdateProduct from "../pages/deshboard/UpdateProduct";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/login/Login";
import Payment from "../pages/Payment";
import Register from "../pages/register/Register";
import Subscription from "../pages/Subscription";
import Watch from "../pages/Watch";
import PrivateRouter from "./PrivateRouter";

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
        path: "/create-store-account",
        element: (
          <PrivateRouter>
            <CreateShop />
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
        element: (
          <PrivateRouter>
            <DashboardHome />
          </PrivateRouter>
        ),
      },
      {
        path: "products",
        element: (
          <PrivateRouter>
            <ManageProduct></ManageProduct>,
          </PrivateRouter>
        ),
      },
      {
        path: "orders",
        element: (
          <PrivateRouter>
            {" "}
            <ManageOrder />
          </PrivateRouter>
        ),
      },
      {
        path: "update-product/:id",
        element: (
          <PrivateRouter>
            <UpdateProduct></UpdateProduct>,
          </PrivateRouter>
        ),
      },
      {
        path: "checkout",
        element: (
          <PrivateRouter>
            <CheckOut></CheckOut>,
          </PrivateRouter>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashBoard></AdminDashBoard>,
    errorElement: <Error></Error>,
    children: [
      {
        path: "",
        element: (
          <PrivateRouter>
            <AdminHome></AdminHome>,
          </PrivateRouter>
        ),
      },
      {
        path: "manageProduct",
        element: (
          <PrivateRouter>
            <MenageShop></MenageShop>,
          </PrivateRouter>
        ),
      },

      {
        path: "users",
        element: (
          <PrivateRouter>
            {" "}
            <ManageUsers></ManageUsers>
          </PrivateRouter>
        ),
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
