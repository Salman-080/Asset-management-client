// import useAxiosSecure from "./useAxiosSecure";

import { useContext } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Provider/Provider";
import { useQuery } from "@tanstack/react-query";

const usePackageExists = () => {
    const { user } = useContext(AuthContext);
  

    const axiosSecure = useAxiosSecure();
  const { data: packageExists=true, refetch } = useQuery({
        queryKey: ['packageExists', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/packageExistCheck/${user.email}`);
            // console.log(res.data);
           
            return res.data.packageExists;
        }
    })

  

    return [packageExists,refetch];
};

export default usePackageExists;