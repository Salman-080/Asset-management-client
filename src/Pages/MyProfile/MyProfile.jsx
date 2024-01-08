import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../Provider/Provider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const MyProfile = () => {

    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [imageValue, setImageValue]=useState("");

    const { data: userProfileData={}, refetch } = useQuery({
        queryKey: ["userProfileData", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/myProfileData/${user.email}`);
            console.log(res.data);
            setImageValue(res.data.image);
            return res.data;

        }
    })

    console.log(userProfileData);
    console.log(imageValue);

    const handleUpdate =async(e)=>{
        e.preventDefault();

        const name= e.target.name.value;
        const birthDate= e.target.birthDate.value;
        console.log(name, birthDate);

        const myProfileDatas= {
            name: name,
            birthDate: birthDate,
            // image: imageValue
           
        }
        console.log(myProfileDatas)

        const res= await axiosSecure.patch(`/upDatingMyProfileData/${user.email}`,myProfileDatas);
        console.log(res.data);

        if(res.data.modifiedCount>0){
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
                    <title>My Profile</title>
                </Helmet>
            <form onSubmit={handleUpdate} className="bg-gray-300 w-[450px] mx-auto mt-12 px-5 py-7 space-y-8">
                <div className="flex gap-3">
                    <h2 className="text-lg">Full Name: </h2>

                    <input className="px-2 rounded-md" defaultValue={userProfileData?.name} type="text" name="name" id="" />
                </div>
                {/* <div className="flex gap-3">
                    <h2 className="text-lg">Image: </h2>

                    <input className="px-2 rounded-md" defaultValue={userProfileData?.image} type="file" name="image" id="" />
                </div> */}

                <div className="flex gap-3">
                    <h2 className="text-lg">Email: </h2>

                    <input className="bg-gray-200 px-2 rounded-md cursor-not-allowed" defaultValue={userProfileData?.email} readOnly type="text" name="" id="" />
                </div>

                <div className="flex gap-3">
                    <h2 className="text-lg">Date of Birth: </h2>



                    <input className="px-2 rounded-md"  defaultValue={userProfileData?.birthDate} type="date" name="birthDate" id="" />
                </div>

                <br />
                <div className="text-center">
                    <button className="btn bg-green-600 text-white ">Update</button>
                </div>

            </form>

        </div>
    );
};

export default MyProfile;