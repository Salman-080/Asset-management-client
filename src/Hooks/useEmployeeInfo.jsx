import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useEmployeeInfo = () => {
    const axiosSecure= useAxiosSecure();
    const {user}= useContext(AuthContext);
    const {data: EmployeeInfo= {}, refetch}= useQuery({
        queryKey: ['EmployeeInfo', user?.email],
       
        
        queryFn: async ()=>{
            const res= await axiosSecure.get(`/employeeInfo/${user.email}`);
            // console.log(res.data)
            return res.data;
        }
    })
    return [EmployeeInfo, refetch];
};

export default useEmployeeInfo;