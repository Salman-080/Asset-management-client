import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
    const axiosSecure= useAxiosSecure();
    const {user}= useContext(AuthContext);
    const {data: isAdmin, refetch}= useQuery({
        queryKey: ['isAdmin', user?.email],
       
        
        queryFn: async ()=>{
            const res= await axiosSecure.get(`/user/admin/${user.email}`);
            // console.log(res.data)
            return res.data.isAdmin;
        },
      
    })
    return [isAdmin, refetch];
};

export default useAdmin;