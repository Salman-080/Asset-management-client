import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Provider/Provider";
import useAdmin from "../../Hooks/useAdmin";
import useIsEmployee from "../../Hooks/useIsEmployee";
import useEmployeeInfo from "../../Hooks/useEmployeeInfo";
import useAdminInfo from "../../Hooks/useAdminInfo";


const Navbar = () => {
    const { user, logOut, googleSignIn } = useContext(AuthContext);
    const [isAdmin] = useAdmin();
    const [isEmployee, refetch] = useIsEmployee();
    // const [employeeInfoRender, setRender]= useState(false);
    // console.log(isAdmin);

    const [EmployeeInfo, refetching] = useEmployeeInfo();
    const [adminInfo] = useAdminInfo();
    // console.log(EmployeeInfo);
    // console.log(adminInfo);
    const navigate = useNavigate();



    const handleLogOut = () => {

        logOut()
            .then(() => {
                // Sign-out successful.
                navigate("/login");
            }).catch((error) => {
                // An error happened.
            });
    }
    const navLinks = <>

        {
            !user && <>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/employeeRegister">Join As Employee</NavLink></li>
                <li><NavLink to="/adminRegister">Join As HR/Admin</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
            </>
        }



        {

            user && isAdmin && <>

                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/assetList">Asset List</NavLink></li>
                <li><NavLink to="/addAnAsset">Add An Asset</NavLink></li>
                <li><NavLink to="/allRequest">All Requests</NavLink></li>
                <li><NavLink to="/customRequestList">Custom Request List</NavLink></li>
                <li><NavLink to="/myEmployees">My Employee List</NavLink></li>
                <li><NavLink to="/addAnEmployee">Add an Employee</NavLink></li>
                <li><NavLink to="/myProfile">My Profile</NavLink></li>
            </>
        }

        {


            user && !isAdmin && <>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/myAssets">My Assest</NavLink></li>
                <li><NavLink to="/myTeam">My Team</NavLink></li>
                <li><NavLink to="/requestAssets">Request For An Asset</NavLink></li>
                <li><NavLink to="/makeCustomRequest">Custom Request</NavLink></li>
                <li><NavLink to="/employeeMyProfilePage">My Profile</NavLink></li>

            </>
        }







    </>
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">

                        {navLinks}
                    </ul>
                </div>
                <div>
                    <div className="w-[55px] h-[55px]">
                        {
                            user && isEmployee && <img className="w-full h-full rounded-full" src={EmployeeInfo?.companyLogo} alt="" />
                        }
                        {
                            user && isAdmin && <img className="w-full h-full rounded-full" src={adminInfo?.companyLogo} alt="" />
                        }
                        {
                            !user && !isEmployee && !isAdmin && <img className="w-full h-full rounded-full" src="/assetManagement.png" alt="" />
                        }
                    </div>

                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks}
                </ul>

                {/* {
                    user && (
                        <div>
                            <div>
                                <p><span className="text-green-500">CurrentLy SignedIn: </span> <span>{user?.displayName}</span></p>
                            </div>
                            <div>
                                <p><span className="text-green-500">Email: </span> <span>{user?.email}</span></p>
                            </div>
                        </div>
                    )
                } */}

            </div>
            {/* <div className="navbar-end space-x-4">
                {
                    user && !isAdmin && (
                        <div>
                            <img className="w-[45px] h-[45px] rounded-full" src={user?.photoURL} alt="" />
                        </div>
                    )
                }
                {
                    user && isAdmin && !isEmployee && (
                        <div>
                            <img className="w-[45px] h-[45px] rounded-full" src={adminInfo?.image} alt="" />
                        </div>
                    )
                }

                {
                    user && <div>
                        <button className="btn bg-slate-200" onClick={handleLogOut}>LogOut</button>
                    </div>
                }


            </div> */}


            <div className="navbar-end">
                {/* <div className="mr-6">
                    <button onClick={handleTheme}>{
                        theme == "darkTheme" ? <img className="w-[30px] h-[30px]" src="/toggleDark.png" alt="" /> :
                            <img className="w-[30px] h-[30px]" src="/toggleLight.png" alt="" />
                    }</button>
                </div> */}
                <div className="dropdown dropdown-end dropDown_zIndex relative">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">

                            {
                                user && !isAdmin && (
                                    <div>
                                        <img className="w-[45px] h-[45px] rounded-full" src={user?.photoURL} alt="" />
                                    </div>
                                )
                            }
                            {
                                user && isAdmin && !isEmployee && (
                                    <div>
                                        <img className="w-[45px] h-[45px] rounded-full" src={adminInfo?.image} alt="" />
                                    </div>
                                )
                            }
                            {/* {user ? <img src={user?.photoURL ? user.photoURL : "https://i.ibb.co/4t3SVXP/man-avatar-profile-picture-vector-illustration-268834-538.jpg"} />
                                :
                                <img src="https://i.ibb.co/4t3SVXP/man-avatar-profile-picture-vector-illustration-268834-538.jpg" />
                            } */}
                            {
                                !user && (
                                    <img src="https://i.ibb.co/4t3SVXP/man-avatar-profile-picture-vector-illustration-268834-538.jpg" />
                                )
                            }
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 z-50 p-4 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-[200px] md:w-[300px] mr-2">

                        {
                            user ?
                                <div className="space-y-6">
                                    <p className="text-center text-xl font-semibold "><span className="text-orange-400">Logged as </span> <br /> <span className="text-base"> {user?.displayName}</span></p>
                                    <p className="text-center text-sm font-thin "><span className="text-base font-normal">Email:</span> <span className="text-sm"> {user?.email}</span></p>

                                    <hr />
                                    <div className="text-center">
                                        <button onClick={handleLogOut} className="btn bg-orange-500 text-white w-full">Log Out</button>
                                    </div>
                                </div>
                                :
                                <div className="space-y-6">
                                    <Link to="/login"><li className="text-lg hover:bg-orange-300 hover:text-white hover:py-[6px] hover:px-2 hover:rounded text-orange-400 font-medium">Login</li></Link>
                                    <br />
                                    <Link to="/register"> <li className="text-lg hover:bg-orange-300 hover:text-white hover:py-[6px] hover:px-2 hover:rounded text-orange-400 font-medium">Register</li></Link>
                                    <hr />
                                    <div className=" text-center">
                                        <button onClick={googleSignIn} className="bg-orange-800 px-3 py-2 text-white rounded-xl font-semibold hover:bg-orange-300">Log In with Google</button>
                                    </div>
                                </div>

                        }


                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Navbar;