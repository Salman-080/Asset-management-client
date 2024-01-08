import { useContext } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Provider/Provider";
import { useQuery } from "@tanstack/react-query";

const useCurrentEmployeersAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const { data: hisEmail= "", refetch } = useQuery({
        queryKey: ['hisEmail', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/employeersAdmin/hisEmail/${user.email}`);
            // console.log(res.data)
            return res.data.adminEmail || "";
        },
      
    })
    return [hisEmail, refetch];
};

export default useCurrentEmployeersAdmin;