import { createBrowserRouter } from "react-router-dom";
import AdminDashBoard from "../layouts/AdminDashBoard";
import DashBoard from "../layouts/DashBoard";
import Main from "../layouts/Main";
import AdminHome from "../pages/Admin/AdminHome";
import ManageUsers from "../pages/Admin/ManageUsers";
import ManagePlans from "../pages/Admin/ManagePlans";
import MenageShop from "../pages/Admin/MenageShop";
import About from "../pages/About";
import Services from "../pages/Services";
import CreateShop from "../pages/createShop/CreateShop";
import CheckOut from "../pages/deshboard/CheckOut";
import DashboardHome from "../pages/deshboard/DashBoardHome";
import ManageOrder from "../pages/deshboard/ManageOrder";
import ManageProduct from "../pages/deshboard/ManageProduct";
import ManagePurchaseOrders from "../pages/deshboard/ManagePurchaseOrders";
import Reports from "../pages/deshboard/Reports";
import ManageStaff from "../pages/deshboard/ManageStaff";
import POS from "../pages/deshboard/POS";
import Scan from "../pages/deshboard/Scan";
import ManageSuppliers from "../pages/deshboard/ManageSuppliers";
import Settings from "../pages/deshboard/Settings";
import UpdateProduct from "../pages/deshboard/UpdateProduct";
import Error from "../pages/Error";
import Home from "../pages/Home";
import Login from "../pages/login/Login";
import Payment from "../pages/Payment";
import Register from "../pages/register/Register";
import Subscription from "../pages/Subscription";
import Watch from "../pages/Watch";
import AdminRouter from "./AdminRouter";
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
        path: "/about",
        element: <About></About>,
      },
      {
        path: "/services",
        element: <Services></Services>,
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
            <ManageProduct></ManageProduct>
          </PrivateRouter>
        ),
      },
      {
        path: "orders",
        element: (
          <PrivateRouter>
            <ManageOrder />
          </PrivateRouter>
        ),
      },
      {
        path: "suppliers",
        element: (
          <PrivateRouter>
            <ManageSuppliers />
          </PrivateRouter>
        ),
      },
      {
        path: "purchase-orders",
        element: (
          <PrivateRouter>
            <ManagePurchaseOrders />
          </PrivateRouter>
        ),
      },
      {
        path: "reports",
        element: (
          <PrivateRouter>
            <Reports />
          </PrivateRouter>
        ),
      },
      {
        path: "staff",
        element: (
          <PrivateRouter>
            <ManageStaff />
          </PrivateRouter>
        ),
      },
      {
        path: "pos",
        element: (
          <PrivateRouter>
            <POS />
          </PrivateRouter>
        ),
      },
      {
        path: "scan",
        element: (
          <PrivateRouter>
            <Scan />
          </PrivateRouter>
        ),
      },
      {
        path: "update-product/:id",
        element: (
          <PrivateRouter>
            <UpdateProduct></UpdateProduct>
          </PrivateRouter>
        ),
      },
      {
        path: "checkout",
        element: (
          <PrivateRouter>
            <CheckOut></CheckOut>
          </PrivateRouter>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRouter>
            <Settings></Settings>
          </PrivateRouter>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRouter>
        <AdminDashBoard></AdminDashBoard>
      </AdminRouter>
    ),
    errorElement: <Error></Error>,
    children: [
      {
        path: "",
        element: <AdminHome></AdminHome>,
      },
      {
        path: "manageProduct",
        element: <MenageShop></MenageShop>,
      },

      {
        path: "users",
        element: <ManageUsers></ManageUsers>,
      },
      {
        path: "plans",
        element: <ManagePlans></ManagePlans>,
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
  {
    path: "*",
    element: <Error></Error>,
  },
]);

export default router;
