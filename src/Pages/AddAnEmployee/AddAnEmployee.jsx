import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/Provider";
import useAdminInfo from "../../Hooks/useAdminInfo";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddAnEmployee = () => {
    const axiosSecure = useAxiosSecure();
    const { user: adminUser } = useContext(AuthContext);
    const [checkBoxId, setCheckBoxId] = useState([]);
    const [adminInfo] = useAdminInfo();
    // console.log(adminInfo);
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users', adminUser?.email],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            // console.log(res.data)
            return res.data;
        }
    })
    // console.log(users);


    const { data: currentPackageLimit, refetch: limitRefetch } = useQuery({
        queryKey: ['currentPackageLimit', adminUser?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/currentPackageLimit/${adminUser.email}`);
            // console.log(res.data?.currentPackageLimit);
            // setPackageLimit(currentPackageLimit);
            return res.data?.currentPackageLimit;
        }
    })

    // console.log(currentPackageLimit)


    const handleAddToTeam = async (user) => {

        if (currentPackageLimit > 0) {

            //updating the role in usersCollection of this user so that another HR/ADMIN can't hire or get this users info
            const resUpdateRole = await axiosSecure.patch(`/updateUserRole/${user?._id}`)
            if (resUpdateRole.data.modifiedCount > 0) {

                Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: "Successfully Added to Your Team",

                });


                refetch();
            }


            //then with role the full info will be stored to database myteam collections
            const teamUserInfo = {
                userId: user?._id,
                email: user?.registerEmail,
                name: user?.registerName,
                image: user?.registerImage,
                adminEmail: adminInfo?.email,
                birthDate: user?.registerDateOfBirth,
                companyName: adminInfo?.companyName,
                companyLogo: adminInfo?.companyLogo,
                role: "employee"

            }
            const res = await axiosSecure.post("/addToTeam", teamUserInfo);
            // console.log(res.data);


            const result = await axiosSecure.patch(`/decreasePackageLimit/${adminUser.email}`);
            // console.log(result.data);

            if (result.data.modifiedCount > 0) {
                limitRefetch();
            }


        }

        else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Buy Package. Package Limit Over",

            });
        }




    }

    const { data: productCount = {} } = useQuery({
        queryKey: ['productCount', adminUser?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/totalProductCount/${adminUser.email}`);
            // console.log(res.data);
            return res.data;
        }
    })
    // console.log(productCount);

    const handleCheckBox = async (userId) => {

        console.log(userId);

        if (checkBoxId.includes(userId)) {
            const filter = checkBoxId.filter(id => id !== userId);
            setCheckBoxId(filter);
        }
        else {
            const newIds = [...checkBoxId, userId];
            setCheckBoxId(newIds);
        }

    }

    const handleAddMarked = async () => {
        if (checkBoxId.length > 0) {

            if (checkBoxId.length <= currentPackageLimit) {
                const usersMarked = users?.filter(user => checkBoxId.includes(user._id));
                console.log(usersMarked);

                if (usersMarked.length > 0) {
                    const infoMembers = usersMarked?.reduce((accumulator, perUser) => {
                        accumulator[perUser?._id] = {
                            userId: perUser?._id,
                            email: perUser?.registerEmail,
                            name: perUser?.registerName,
                            image: perUser?.registerImage,
                            adminEmail: adminInfo?.email,
                            birthDate: perUser?.registerDateOfBirth,
                            companyName: adminInfo?.companyName,
                            companyLogo: adminInfo?.companyLogo,
                            role: "employee"

                        };
                        return accumulator;
                    }, {});

                    console.log(infoMembers);


                    const res = await axiosSecure.post("/addMarkedToTeam", infoMembers);
                    console.log(res.data);
                    if (res.data?.result2.insertedIds) {
                        Swal.fire({
                            icon: "success",
                            title: "Successful",
                            text: "Successfully Added To the Team",

                        });

                        const result = await axiosSecure.patch(`/markedDecreasePackageLimit/${adminUser.email}/${checkBoxId.length}`);
                        // console.log(result.data);

                        if (result.data.modifiedCount > 0) {
                            limitRefetch();
                        }

                        setCheckBoxId([]);

                        refetch();
                    }
                }

            }
            else {
                toast.error('Not Enough Package Limit', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

        }
        else {
            toast.error('Please Select Members First From the CheckBox', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    }

    console.log(checkBoxId);

    return (
        <div className="max-w-screen-xl mx-auto">
            <Helmet>
                <title>Add | Employee</title>
            </Helmet>

            <div className="flex justify-between mt-12 ">
                <div>
                    <h2 className="text-xl font-semibold">Total Product: {productCount.result}</h2>
                </div>
                <div className=" flex flex-col justify-center items-center space-y-2">
                    <h2 className="text-xl font-semibold">Package Limit/Remaining Members to Add: {currentPackageLimit}</h2>
                    <Link to="/increasePackageLimit"><button className="btn bg-green-600 text-white">Increase Limit</button></Link>
                </div>
            </div>

            <div className="overflow-x-auto mt-9">
                <table className="table">

                    <thead>
                        <tr>
                            <th>

                            </th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>  <div className="mt-8">
                                <button onClick={handleAddMarked} className=" bg-pink-700 text-white px-3 py-2 text-xs font-semibold rounded-xl">Add Marked <br /> To the Team</button>
                            </div></th>




                        </tr>
                    </thead>
                    <tbody>

                        {
                            users.map(user => (
                                <tr key={user._id}>
                                    <th>
                                        <label>
                                            <input onChange={() => handleCheckBox(user._id)} name="checkBox" type="checkbox" className="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img src={user?.registerImage} />
                                                </div>
                                            </div>
                                            <div>
                                                {/* <div className="font-bold">Hart Hagerty</div>
                                                <div className="text-sm opacity-50">United States</div> */}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {user?.registerName}

                                    </td>

                                    <th>
                                        <button onClick={() => handleAddToTeam(user)} className="btn btn-secondary btn-xs">Add to team</button>
                                    </th>
                                </tr>
                            ))
                        }




                    </tbody>


                </table>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default AddAnEmployee;