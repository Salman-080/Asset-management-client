import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Root from './Layout/Root/Root.jsx';
import Home from './Pages/Home/Home.jsx';
import EmployeeRegister from './Pages/EmployeeRegister/EmployeeRegister.jsx';
import Provider from './Provider/Provider.jsx';
import Login from './Pages/Login/Login.jsx';
import AdminRegister from './Pages/AdminRegister/AdminRegister.jsx';
import Payment from './Pages/Payment/Payment.jsx';
import AddAsset from './Pages/AddAsset/AddAsset.jsx';
import AddAnEmployee from './Pages/AddAnEmployee/AddAnEmployee.jsx';
import AssetList from './Pages/AssetList/AssetList.jsx';
import RequestAssets from './Pages/RequestAssets/RequestAssets.jsx';
import AllRequest from './Pages/AllRequest/AllRequest.jsx';
import MakeCustomRequest from './Pages/MakeCustomRequest/MakeCustomRequest.jsx';
import CustomRequestList from './Pages/CustomRequestList/CustomRequestList.jsx';
// import EmployeeHome from './Pages/Home/EmployeeHome/EmployeeHome.jsx';
import MyAssets from './Pages/MyAssets/MyAssets.jsx';
import Packages from './Pages/PackageLimit/Packages.jsx';
import MyEmployeeList from './Pages/MyEmployeeList/MyEmployeeList.jsx';
import MyTeam from './Pages/MyTeam/MyTeam.jsx';
// import PrivateRoute from './PrivateRoute/PrivateRoute.jsx';
import ErrorPage from './Pages/ErrorPage/ErrorPage.jsx';
import MyProfile from './Pages/MyProfile/MyProfile.jsx';
import PackageExists from './Pages/PackageExistsCheck/PackageExists.jsx';
import EmployeeMyProfile from './Pages/EmployeeMyProfile/EmployeeMyProfile.jsx';
import { HelmetProvider } from 'react-helmet-async';
import AssetUpdate from './Pages/AssetUpdate/AssetUpdate.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/employeeRegister",
        element: <EmployeeRegister></EmployeeRegister>,
      },
      {
        path: "/adminRegister",
        element: <AdminRegister></AdminRegister>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },

      //payment page
      {
        path: "/payment",
        element: <Payment></Payment>,
      },
      // Add product by admin
      {
        path: "/addAnAsset",
        element: <PackageExists> <AddAsset></AddAsset></PackageExists>
      },

      // add employee
      {
        path: "/addAnEmployee",
        element: <PackageExists><AddAnEmployee></AddAnEmployee></PackageExists>,
      },
      //assetList
      {
        path: "/assetList",
        element: <PackageExists> <AssetList></AssetList></PackageExists>,
      },

      // request for an asset

      {
        path: "/requestAssets",
        element: <RequestAssets></RequestAssets>
      },

      //make custom request
      {
        path: "/makeCustomRequest",
        element: <MakeCustomRequest></MakeCustomRequest>,
      },

      // All request in admin side
      {
        path: "/allRequest",
        element: <PackageExists><AllRequest></AllRequest></PackageExists>,
      },

      //custom request list
      {
        path: "/customRequestList",
        element: <PackageExists><CustomRequestList></CustomRequestList></PackageExists>,
      },

      //employee home

      // {
      //   path: "/employeeHome",
      //   element: <EmployeeHome></EmployeeHome>
      // }

      {
        path: "/myAssets",
        element: <MyAssets></MyAssets>
      },

      //increasing package Limit
      {
        path: "/increasePackageLimit",
        element: <Packages></Packages>,
      },

      //admins employee list route
      {
        path: "/myEmployees",
        element: <PackageExists><MyEmployeeList></MyEmployeeList></PackageExists>,
      },

      //my team employee side
      {
        path: "/myTeam",
        element: <MyTeam></MyTeam>,
      },
      {
        path: "/myProfile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "/employeeMyProfilePage",
        element: <EmployeeMyProfile></EmployeeMyProfile>,
      },
      {
        path: "/assetAddedUpdate/:id",
        element: <AssetUpdate></AssetUpdate>,
      },


    ]
  },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>

      </Provider>
    </QueryClientProvider>


  </React.StrictMode>,
)
