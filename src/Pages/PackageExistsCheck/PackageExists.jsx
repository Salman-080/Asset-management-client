import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/Provider";
import { Navigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import usePackageExists from "../../Hooks/usePackageExists";

const PackageExists = ({ children }) => {

    // const [adminInfo] = useAdminInfo();
    // console.log(adminInfo)
    const { user } = useContext(AuthContext);


    const [packageExists, refetch]= usePackageExists();
    // console.log(packageExists);
  
    
    if (packageExists) {

        return children;
    }

    return <Navigate to="/payment"></Navigate>
};

export default PackageExists;