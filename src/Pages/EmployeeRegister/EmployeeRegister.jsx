import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/Provider";

import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Helmet } from "react-helmet-async";
import useIsEmployee from "../../Hooks/useIsEmployee";
const image_hosting_key = import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const EmployeeRegister = () => {

    const {createUser, profileUpdate, logOut, googleSignIn}= useContext(AuthContext);
    const [isEmployee, refetch] = useIsEmployee();
    const axiosPublic= useAxiosPublic();

    const navigate= useNavigate();
    
    const handleRegister = async(e) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const imageFile = {
            image: e.target.image.files[0],
            
        }

        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });

        if(res.data.success){
            const registerName = form.get('name');
            const registerImage = res.data.data.display_url;
            const registerEmail = form.get('email');
            const registerPassword = form.get('password');
            const registerDateOfBirth = form.get('dateOfBirth');
    
            console.log(registerDateOfBirth,registerEmail,registerName,registerPassword, registerImage)
    
    
            createUser(registerEmail, registerPassword)
            .then((res) => {
                // Signed up 
                // const user = userCredential.user;
                console.log(res.user);
                // ...
    
                profileUpdate(registerName, registerImage)
                .then(async(res)=>{
                    console.log(res)
    
                    const employeeInfo= {
                        registerName, registerEmail, registerDateOfBirth, registerImage
                    }
    
                    const response= await axiosPublic.post("/employeeInfo", employeeInfo);
                    console.log(response.data);
               
    
                    navigate("/login");
    
                    logOut()
                    .then(res=>{
                        console.log(res)
                    })
                    .catch(error=>{
                        console.log(error)
                    })
    
    
                })
                .catch(error=>{
                    console.log(error)
                })
              })
              .catch((error) => {
               console.log(error)
                // ..
              });
        }

     
    }

    const handleGoogleLogIn=()=>{
        googleSignIn()
        .then(async(res)=>{
            console.log(res.user);
            
            const employeeInfo= {
                registerName: res.user?.displayName, 
                registerEmail: res.user?.email,           
                registerImage: res.user?.photoURL
            }

            const response= await axiosPublic.post("/employeeInfo", employeeInfo);
            console.log(response.data);
            refetch();
            navigate("/");
        })
        .catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen ">
            <Helmet>
                    <title>Employee | Register</title>
                </Helmet>
            <div className=" w-full md:w-[500px] flex flex-col justify-center items-center">
                <div className="text-center lg:text-left">
                    <br />
                </div>
                <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
                    <h1 className="text-2xl md:text-4xl font-bold text-center mt-2">Register Now As a Employee</h1>
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

                            <input name="image" type="file" placeholder="Your Image" className="" />
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
                        <p>Already Have an Account? <Link to="/login"><span className="text-blue-600">Login</span></Link></p>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">SignUp</button>
                        </div>
                    </form>

                    <div className="text-center mb-5 space-y-2">
                        <p className="text-gray-500">Or Sign in using</p>
                        <button onClick={handleGoogleLogIn} className="btn ">
                            <img className="w-[20px] h-[20px] rounded-full" src="/google.png" alt="" />
                            <p>Google</p>
                        </button>

                    </div>
                </div>
            </div>
            {/* <ToastContainer
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
            /> */}
        </div>
    );
};

export default EmployeeRegister;