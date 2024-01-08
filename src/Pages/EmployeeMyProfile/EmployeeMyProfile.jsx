import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

const EmployeeMyProfile = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: EmployeeUserProfileData = {}, refetch } = useQuery({
        queryKey: ["EmployeeUserProfileData", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/employeeMyProfileData/${user.email}`);
            console.log(res.data);

            return res.data;

        }
    })

    console.log(EmployeeUserProfileData);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const birthDate = e.target.birthDate.value;
        console.log(name, birthDate);

        const myProfileDatas = {
            name: name,
            birthDate: birthDate
        }

        const res = await axiosSecure.patch(`/employeeUpDatingMyProfileData/${user.email}`, myProfileDatas);
        console.log(res.data);

        if (res.data.modifiedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Updated",

            });
            refetch();
        }


    }

    return (
        <div>
            <Helmet>
                    <title>My | Profile</title>
                </Helmet>
            <form onSubmit={handleUpdate} className="bg-gray-300 w-[450px] mx-auto mt-12 px-5 py-7 space-y-8">
                <div className="flex gap-3">
                    <h2 className="text-lg">Full Name: </h2>

                    <input className="px-2 rounded-md" defaultValue={EmployeeUserProfileData?.registerName} type="text" name="name" id="" />
                </div>

                <div className="flex gap-3">
                    <h2 className="text-lg">Email: </h2>

                    <input className="bg-gray-200 px-2 rounded-md cursor-not-allowed" defaultValue={EmployeeUserProfileData?.registerEmail} readOnly type="text" name="" id="" />
                </div>

                <div className="flex gap-3">
                    <h2 className="text-lg">Date of Birth: </h2>



                    <input className="px-2 rounded-md" defaultValue={EmployeeUserProfileData?.registerDateOfBirth} type="date" name="birthDate" id="" />
                </div>

                <br />
                <div className="text-center">
                    <button className="btn bg-green-600 text-white ">Update</button>
                </div>

            </form>

        </div>
    );
};

export default EmployeeMyProfile;