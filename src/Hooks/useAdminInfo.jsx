import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useAdminInfo = () => {
    const axiosSecure= useAxiosSecure();
    const {user}= useContext(AuthContext);
    const {data: adminInfo= {}}= useQuery({
        queryKey: ['adminInfo', user?.email],
       
        
        queryFn: async ()=>{
            const res= await axiosSecure.get(`/user/adminInfo/${user.email}`);
            // console.log(res.data);
            return res.data;
        }
    })
    return [adminInfo];
};

export default useAdminInfo;