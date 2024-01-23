import { useContext, useRef } from "react";
import { AuthContext } from "../../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Helmet } from "react-helmet-async";
import emailjs from '@emailjs/browser';

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const form = useRef();

    const COLORS = ['#0088FE', '#00C49F'];


    const { data: MostRequestItems = [], refetch } = useQuery({
        queryKey: ['MostRequestItems', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/mostRequestedItems/${user.email}`);
            console.log(res.data);
            return res.data;
        },

    })

    const { data: LimitedItems = [] } = useQuery({
        queryKey: ['LimitedItems', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/limitedStock/${user.email}`);
            console.log(res.data);
            return res.data;
        },

    })


    const { data: assetsTypeData = [] } = useQuery({
        queryKey: ['assetsTypeData', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/requestAssetsTypeData/${user.email}`);
            console.log(res.data);
            return res.data;
        },

    })

    const { data: pendingRqst = [] } = useQuery({
        queryKey: ['pendingRqst', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/maxFivePendingRqst/${user.email}`);
            console.log(res.data);
            return res.data;
        },

    })


    const handleApprove = async (assetId, assetId2) => {


        const res = await axiosSecure.patch(`/approveAssetRequest/${assetId}/${assetId2}`);

        console.log(res.data);
        if (res.data.result.modifiedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Approved Request",

            });

            refetch();
        }

    }

    const handleReject = async (assetId) => {
        const res = await axiosSecure.patch(`/rejectAssetRequest/${assetId}`);

        console.log(res.data);
        if (res.data.result.modifiedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Rejected Request",

            });

            refetch();
        }
    }


    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const data = assetsTypeData.map(data => {
        return { name: data?.assetType, value: data?.total };
    })

    const handleSubscribe = e => {
        e.preventDefault();
        const info = e.target.subscribe.value;

        if (info.length > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Thanks For Subscribing",

            });
        }
    }

    

    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs.sendForm('service_gug3opr', 'template_9lfza2b', form.current, '5yQgxZQ-Tsa1lps-i')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    };
    

    return (

        <div className="max-w-screen-xl mx-auto mt-7">
            <Helmet>
                <title>Admin Home</title>
            </Helmet>
            <div className="text-center  mb-5">
                <h2 className="text-3xl font-bold">Top 5 Pending request</h2>

                <div>
                    {
                        pendingRqst?.length > 0 ? (
                            <div className="overflow-x-auto"> <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Asset Name</th>

                                        <th>Asset Type</th>
                                        <th>Status</th>
                                        <th>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {
                                        pendingRqst?.map((requestedAsset, idx) => (

                                            <tr key={requestedAsset._id}>
                                                <th>{idx + 1}</th>
                                                <td>
                                                    {requestedAsset?.assetName}

                                                </td>

                                                <td>
                                                    {requestedAsset?.assetType}
                                                </td>
                                                <td>
                                                    {
                                                        requestedAsset?.status == "Approved" && <h2>Approved</h2>
                                                    }
                                                    {
                                                        requestedAsset?.status == "Rejected" && <h2>Rejected</h2>
                                                    }

                                                    {
                                                        !requestedAsset?.status && <h2>Pending</h2>
                                                    }


                                                </td>


                                                <td >
                                                    {
                                                        !requestedAsset.status &&
                                                        <div className="space-x-5">



                                                            <button onClick={() => handleApprove(requestedAsset.requestedAssetId, requestedAsset._id)} className="btn bg-green-500 btn-sm  text-white">Approve</button>
                                                            <button onClick={() => handleReject(requestedAsset._id)} className="btn bg-red-600 btn-sm text-white">Reject</button>
                                                        </div>

                                                    }
                                                </td>




                                            </tr>

                                        ))
                                    }


                                </tbody>
                            </table>
                            </div>
                        )
                            :
                            <div className="text-center">
                                <h2>No Pending requested items to Show</h2>
                            </div>
                    }
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-center text-3xl font-bold mb-5 ">Top most requested items</h2>


                <div>
                    {
                        MostRequestItems.length > 0 ?
                            <div className="overflow-x-auto"> <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Asset Name</th>

                                        <th>Asset Type</th>
                                        <th>Status</th>
                                        <th>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {
                                        MostRequestItems?.map((requestedAsset, idx) => (

                                            <tr key={requestedAsset._id}>
                                                <th>{idx + 1}</th>
                                                <td>
                                                    {requestedAsset?.assetName}

                                                </td>

                                                <td>
                                                    {requestedAsset?.assetType}
                                                </td>
                                                <td>
                                                    {
                                                        requestedAsset?.status == "Approved" && <h2>Approved</h2>
                                                    }
                                                    {
                                                        requestedAsset?.status == "Rejected" && <h2>Rejected</h2>
                                                    }

                                                    {
                                                        !requestedAsset?.status && <h2>Pending</h2>
                                                    }


                                                </td>


                                                <td >
                                                    {
                                                        !requestedAsset.status &&
                                                        <div className="space-x-5">



                                                            <button onClick={() => handleApprove(requestedAsset.requestedAssetId, requestedAsset._id)} className="btn bg-green-500 btn-sm  text-white">Approve</button>
                                                            <button onClick={() => handleReject(requestedAsset._id)} className="btn bg-red-600 btn-sm text-white">Reject</button>
                                                        </div>

                                                    }
                                                </td>




                                            </tr>

                                        ))
                                    }


                                </tbody>
                            </table>
                            </div>
                            :
                            <div className="text-center">
                                <h2>No Top most requested items to Show</h2>
                            </div>
                    }


                </div>

            </div>

            <div>
                <h2 className="text-center text-3xl font-bold mb-5 mt-16">Limited Stock items</h2>

                <div>
                    <div>
                        {
                            LimitedItems.length > 0 ? <div className="overflow-x-auto"> <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        
                                        <th>Asset Name</th>
                                        <th>Asset Quantity</th>
                                        <th>Asset Type</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        LimitedItems?.map((assetItem, idx) => (

                                            <tr key={assetItem._id}>
                                                <td>{idx + 1}</td>
                                               
                                                <td>
                                                    {assetItem.assetName}
                                                </td>
                                                <td>{assetItem.assetQuantity}</td>
                                                <th>
                                                    {assetItem.assetType}
                                                </th>
                                            </tr>

                                        ))
                                    }


                                </tbody>

                                {/* <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Job</th>
                                        <th>Favorite Color</th>
                                        <th></th>
                                    </tr>
                                </tfoot> */}
                            </table>
                            </div>
                                :
                                <div className="text-center">
                                    <h2>No Limited items to Show</h2>
                                </div>
                        }


                    </div>
                </div>
            </div>







            <div>
                <h2 className="mt-12 text-4xl font-bold text-center ">Observing Chart </h2>




                <div className="flex justify-center">
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend></Legend>
                    </PieChart>
                </div>



            </div>


            <div>
                <h2 className="text-4xl font-bold text-center mt-16">Contact Us</h2>

                <div className=" py-8 space-y-6`">

                    <div className=" flex justify-center ">
                        <form ref={form} onSubmit={sendEmail} className="w-[600px] md:w-[850px] bg-gray-300 px-6 py-7 space-y-4 ">

                            <div className="text-base space-y-2">
                                <h2>Your Name</h2>
                                <input className="w-full px-1 py-[5px]" type="text" name="name" id="" />
                            </div>

                            <div className="text-base space-y-2">
                                <h2>Email Address</h2>
                                <input className="w-full px-1 py-[5px]" type="text" name="email" id="" />
                            </div>
                            <div className="text-base space-y-2">
                                <h2>Phone No.</h2>
                                <input className="w-full px-1 py-[5px]" type="text" name="number" id="" />
                            </div>

                            <div className="text-base">
                                <h2>Query</h2>
                                <textarea className="w-full px-2 py-1" name="query" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="text-center"><button className="btn bg-yellow-700 border border-yellow-700 text-white"> Submit</button></div>
                        </form>
                    </div>

                </div>
            </div>



            <div className="bg-gray-200 px-1 py-7 space-y-6">
                <h2 className="text-center text-3xl font-bold">Subscribe for get Latest Update</h2>
                <form onSubmit={handleSubscribe} className="flex justify-center">
                    <input name="subscribe" type="email" placeholder="Your Email" className="input input-bordered w-full max-w-xs" />
                    <button className="btn btn-secondary text-white">Subscribe</button>
                </form>
            </div>

        </div>

    );
};

export default AdminHome;