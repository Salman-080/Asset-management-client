import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/Provider";
import useIsEmployee from "../../Hooks/useIsEmployee";
import { Helmet } from "react-helmet-async";
import useAxiosPublic from "../../Hooks/useAxiosPublic";


const Login = () => {
    const { signInUser, googleSignIn } = useContext(AuthContext);
    const [isEmployee, refetch] = useIsEmployee();
    const axiosPublic= useAxiosPublic();

    const navigate = useNavigate();
    console.log(isEmployee)
    const handleLogin = e => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const loginEmail = form.get('email');
        const loginPassword = form.get('password');

        signInUser(loginEmail, loginPassword)
            .then((res) => {
                // Signed in 
                console.log(res.user);
                // ...
                refetch();
                navigate("/");

            })
            .catch((error) => {
                console.log(error)
            });
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
                <title>Login</title>
            </Helmet>
            <div className="w-full md:w-[500px] flex flex-col justify-center items-center ">
                <div className="text-center lg:text-left">
                    <br />
                </div>
                <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
                    <h1 className="text-2xl md:text-4xl font-bold text-center mt-2">Login Now</h1>
                    <form onSubmit={handleLogin} className="card-body">

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
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        {/* <p>New User? <Link to="/register"><span className="text-blue-600">Register</span></Link></p> */}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Login</button>
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
           

        </div>
    );
};

export default Login;