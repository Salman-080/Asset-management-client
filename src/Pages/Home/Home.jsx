import { useContext } from "react";
import { AuthContext } from "../../Provider/Provider";
import useAdmin from "../../Hooks/useAdmin";
import useIsEmployee from "../../Hooks/useIsEmployee";
import EmployeeHome from "./EmployeeHome/EmployeeHome";
import AdminHome from "./AdminHome/AdminHome";
import PackageExists from "../PackageExistsCheck/PackageExists";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";

const Home = () => {
    const { user } = useContext(AuthContext);
    const [isAdmin] = useAdmin();
    const [isEmployee] = useIsEmployee();

    console.log(isEmployee);
    console.log(isAdmin);
    return (
        <div>






            {
                user && isEmployee && <EmployeeHome></EmployeeHome>
            }

            {
                user && isAdmin &&

                <PackageExists><AdminHome></AdminHome></PackageExists>



            }

            {
                user && !isEmployee && !isAdmin && (
                    <h2 className="text-red-500 font-bold text-4xl text-center mt-12">Contact With Your HR/Admin!</h2>
                )
            }

            {
                !user && !isEmployee && !isAdmin && (
                    <div className="">
                        <Helmet>
                            <title>Home</title>
                        </Helmet>

                        <div className="w-full mt-2">
                            <Swiper navigation={true} modules={[Navigation]} className="mySwiper">

                                <SwiperSlide>
                                    <div className="relative">
                                        <div className="h-[600px] w-full">
                                            <img className="h-full w-full" src="/banner1.jpg" alt="" />

                                        </div>
                                        <div>
                                            <Link to="/adminRegister"><button className="btn bg-orange-600 border border-orange-600 text-white absolute top-1/2 left-[45%]">Join As HR/Admin</button></Link>
                                        </div>
                                    </div>

                                </SwiperSlide>
                                <SwiperSlide>
                                    <div>
                                        <div className="h-[600px] w-full">
                                            <img className="h-full w-full" src="/banner2.jpg" alt="" />
                                        </div>
                                        <div>
                                            <Link to="/employeeRegister"><button className="btn bg-orange-600 border border-orange-600  text-white absolute top-1/2 left-[45%]">Join As Employee</button></Link>
                                        </div>
                                    </div>
                                </SwiperSlide>




                            </Swiper>
                        </div>

                        <div className="mt-16 max-w-screen-xl mx-auto">
                            <h2 className="text-center text-4xl font-bold">About Us</h2>
                            <p className="bg-slate-100 px-5 py-7 mt-2">

                                Welcome to AssetHarbor's Asset Management System, where we empower businesses to seamlessly oversee their valuable resources with efficiency and precision. At AssetHarbor, we understand the pivotal role that assets play in the daily operations of any organization, and we've crafted a robust web application tailored to meet the unique needs of modern enterprises.

                                Our Asset Management System is designed to provide HR and administrators with a comprehensive toolset for effortlessly monitoring and optimizing the utilization of company assets. Whether it's laptops, keyboards, chairs, or cell phones categorized as returnable assets, or essential office supplies like pens, pencils, paper, diaries, and tissue paper classified as non-returnable assets, our platform ensures a meticulous tracking process.

                                At AssetHarbor, we are committed to facilitating a transformative journey for businesses, enabling them to optimize their asset utilization, reduce operational costs, and ultimately elevate their productivity. Join us in revolutionizing the way organizations manage their assets and propel towards a future where efficiency meets innovation
                            </p>
                        </div>

                        <div className="mt-16 space-y-4 max-w-screen-xl mx-auto">
                            <div>
                                <h2 className="text-center text-4xl font-bold">Package Section</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div className="stats bg-green-500 text-primary-content flex flex-col py-4">
                                    <div>
                                        <p className="text-4xl font-bold mb-5">Basic</p>
                                    </div>
                                    <div className="w-[150px] mx-auto border border-black">
                                        <hr />
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title text-white">Members</div>
                                        <div className="stat-value ">5</div>

                                    </div>

                                    <div className="stat">
                                        <div className="stat-title text-white">Price</div>
                                        <div className="stat-value">$5</div>

                                    </div>

                                </div>
                                <div className="stats bg-orange-500 text-primary-content flex flex-col py-4">
                                    <div>
                                        <p className="text-4xl font-bold mb-5">Standard</p>
                                    </div>
                                    <div className="w-[150px] mx-auto border border-black">
                                        <hr />
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title text-white">Members</div>
                                        <div className="stat-value">10</div>

                                    </div>

                                    <div className="stat">
                                        <div className="stat-title text-white">Price</div>
                                        <div className="stat-value">$8</div>

                                    </div>

                                </div>
                                <div className="stats bg-primary text-primary-content flex flex-col py-4">
                                    <div>
                                        <p className="text-4xl font-bold mb-5">Premium</p>
                                    </div>
                                    <div className="w-[150px] mx-auto border border-black">
                                        <hr />
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title text-white">Members</div>
                                        <div className="stat-value">20</div>

                                    </div>

                                    <div className="stat">
                                        <div className="stat-title text-white">Price</div>
                                        <div className="stat-value">$15</div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>)
            }




        </div>
    );
};

export default Home;