import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/Provider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAdmin from "../../Hooks/useAdmin";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
const image_hosting_key = import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const AdminRegister = () => {
    const axiosPublic = useAxiosPublic();
    const [isAdmin, refetch] = useAdmin();



    const { setPackageInfo } = useContext(AuthContext);
    const { createUser, profileUpdate } = useContext(AuthContext);
    const navigate = useNavigate();



    const { data: packagesList } = useQuery({
        queryKey: ['packagesList'],


        queryFn: async () => {
            const res = await axios.get("packages.json");
            // console.log(res.data)
            return res.data;
        },

    })




    const handleRegister = async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const imageFile = {
            image: e.target.image.files[0],
            
        }
        // console.log(imageFile)
        const imageFile2 = {
            image: e.target.logo.files[0],
            
        }
        // console.log(imageFile)

        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        console.log(res.data);
        const result = await axiosPublic.post(image_hosting_api, imageFile2, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        console.log(result.data);

        if (res.data.success && result.data.success) {

            const registerName = form.get('name');
            const registerImage = res.data.data.display_url;
            const registerEmail = form.get('email');
            const registerPassword = form.get('password');
            const registerDateOfBirth = form.get('dateOfBirth');
            const registerPackage = form.get('package');
            const registerCompanyLogo = result.data.data.display_url;
            const registerCompanyName = form.get('companyName');

            console.log(registerDateOfBirth, registerEmail, registerName, registerPassword, registerCompanyLogo, registerPackage, registerImage)

            createUser(registerEmail, registerPassword)
                .then((res) => {
                    // Signed up 
                    // const user = userCredential.user;
                    console.log(res.user);

                    profileUpdate(registerName)
                        .then(() => {

                            //TODO: profile update then post to database

                        }).catch((error) => {
                            // An error occurred
                            // ...
                        });


                    const registerAdminInfo = {
                        name: registerName,
                        email: registerEmail,
                        image: registerImage,
                        birthDate: registerDateOfBirth,
                        companyLogo: registerCompanyLogo,
                        companyName: registerCompanyName,
                        currentPackageLimit: parseInt(0),


                        role: "Admin"
                    }



                    axiosPublic.post("/registerUsers", registerAdminInfo)
                        .then(res => {
                            console.log(res.data)
                            // post kore response asbe then ...
                            //for refetching check isAdmin

                            setPackageInfo({ package: registerPackage });
                            refetch();
                            navigate("/payment");

                        })

                    // refetch(); //for refetching check isAdmin
                    // navigate("/payment");


                    // ...
                })
                .catch((error) => {
                    console.log(error)
                    // ..
                });

        }





    }
    return (
        <div className="flex flex-col justify-center items-center min-h-screen ">
            <Helmet>
                <title>Admin | Register</title>
            </Helmet>
            <div className=" w-full md:w-[500px] flex flex-col justify-center items-center">
                <div className="text-center lg:text-left">
                    <br />
                </div>
                <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
                    <h1 className="text-2xl md:text-4xl font-bold text-center mt-2">Register Now As a HR/Admin</h1>
                    <form onSubmit={handleRegister} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>

                            <input name="name" type="text" placeholder="Your Name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Your Image</span>
                            </label>

                            <input name="image" type="file" placeholder="Your Image" className="" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Company Name</span>
                            </label>

                            <input name="companyName" type="text" placeholder="Company Name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Company Logo URL</span>
                            </label>

                            <input name="logo" type="file" placeholder="Logo" className=" " required />
                        </div>

                        <div className="form-control">

                            <label className="label">

                                <span className="label-text">Email</span>
                            </label>

                            <input name="email" type="email" placeholder="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input name="password" type="password" placeholder="password" className="input input-bordered" required />

                        </div>
                        <div className="form-control">

                            <label className="label">

                                <span className="label-text">Date of Birth</span>
                            </label>

                            <input name="dateOfBirth" type="date" id="" />


                        </div>
                        <div>
                            <select name="package" className="select select-bordered w-full max-w-xs">
                                <option disabled selected>Select A package</option>

                                {
                                    packagesList?.map(packageData => (
                                        <option key={packageData.id}>{packageData.package}</option>
                                    ))
                                }



                            </select>
                        </div>
                        <p>Already Have an Account? <Link to="/login"><span className="text-blue-600">Login</span></Link></p>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">SignUp</button>
                        </div>
                    </form>


                </div>
            </div>

        </div>
    );
};

export default AdminRegister;