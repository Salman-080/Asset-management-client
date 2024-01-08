import { useContext } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Provider/Provider";
import { useQuery } from "@tanstack/react-query";

const useIsEmployee = () => {
    const axiosSecure= useAxiosSecure();
    const {user}= useContext(AuthContext);
    const {data: isEmployee, refetch}= useQuery({
        queryKey: ['isEmployee', user?.email],
       
        
        queryFn: async ()=>{
            const res= await axiosSecure.get(`/user/employee/${user.email}`);
            // console.log(res.data)
            return res.data.isEmployee;
        },
     
    })
    return [isEmployee, refetch];
};

export default useIsEmployee;