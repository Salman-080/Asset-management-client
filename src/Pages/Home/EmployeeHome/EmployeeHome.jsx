import { useContext, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { AuthContext } from "../../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import Swal from "sweetalert2";


const EmployeeHome = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [notUpdate, setNotUpdate] = useState(true);
    const { data: myCustomRequests = [], refetch } = useQuery({
        queryKey: ['myCustomRequests', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/myCustomRequests/${user.email}`);
            console.log(res.data)
            return res.data;
        },

    })

    const { data: monthlyRequests = [] } = useQuery({
        queryKey: ['monthlyRequests', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/monthlyRequests/${user.email}`);
            console.log(res.data)
            return res.data;
        },

    })

    const { data: frequentlyRequests = [] } = useQuery({
        queryKey: ['frequentlyRequests', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/frequentlyRequested/${user.email}`);
            console.log(res.data);
            return res.data;
        },

    })

    const { data: employersPendingRequestsDatas = [] } = useQuery({
        queryKey: ['employersPendingRequestsDatas', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/employersPendingRqst/${user.email}`);
            console.log(res.data);
            return res.data;
        },

    })

    console.log(myCustomRequests);
    console.log(monthlyRequests);
    console.log(frequentlyRequests);

    const handleUpdate = () => {
        setNotUpdate(!notUpdate);

    }

    const handleCancel = () => {
        setNotUpdate(!notUpdate);
    }

    const handleSaveSubmit = async (e, assetId) => {
        e.preventDefault();

        console.log(assetId);
        const assetInfos = {
            assetName: e.target.assetName.value,
            assetImage: e.target.assetImage.value,
            assetPrice: e.target.assetPrice.value,
            assetType: e.target.assetType.value,
            whyNeed: e.target.whyNeed.value,
            additionalInfo: e.target.additionalInfo.value,

        }

        console.log(assetId, assetInfos);

        const res = await axiosSecure.put(`/customReqAssetUpdateSave/${assetId}`, assetInfos);
        console.log(res.data);

        if (res.data?.modifiedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Saved Successfully",


            });
            refetch();
        }


    }
    return (
        <div className=" max-w-screen-xl mx-auto">
            <Helmet>
                <title>Employee | Home</title>
            </Helmet>
            <div>
                {
                    myCustomRequests.length > 0 && <h2 className="text-3xl font-semibold text-center mb-4">My Custom Requests</h2>
                }


                <div className="">

                    {
                        myCustomRequests.length > 0 && <div className="overflow-x-auto"> <table className="table table-zebra">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Asset Name</th>
                                    <th>Price</th>
                                    <th>Asset Type</th>
                                    <th>Status</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                {
                                    myCustomRequests?.map((requestedAsset, idx) => (

                                        <tr key={requestedAsset._id}>
                                            <th>{idx + 1}</th>
                                            <td>
                                                {requestedAsset?.assetName}

                                            </td>
                                            <td>
                                                {requestedAsset?.assetPrice}
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
                                            <td><button className="btn" onClick={() => document.getElementById(`my_modal_1${requestedAsset._id}`).showModal()}>View Details</button>
                                                <dialog id={`my_modal_1${requestedAsset._id}`} className="modal modal-bottom sm:modal-middle">
                                                    <div className="modal-box space-y-2">

                                                        <form onSubmit={(e) => handleSaveSubmit(e, requestedAsset._id)}>
                                                            <div>
                                                                {notUpdate ? <img className="rounded-lg mx-auto mb-2 w-[300px] h-[300px]" src={requestedAsset?.assetImage} alt="" />
                                                                    :
                                                                    <div className="flex gap-1 mb-3">
                                                                        <p>Asset Image: </p> <input
                                                                            name="assetImage"
                                                                            className="border border-gray-400 rounded-md px-1 py-1" type="text" defaultValue={requestedAsset.assetImage} />
                                                                    </div>

                                                                }

                                                            </div>
                                                            <h3 className=" mt-2">Asset Name: {notUpdate ?
                                                                requestedAsset.assetName :
                                                                <input className="border border-gray-400 rounded-md px-1 py-1" type="text" name="assetName" defaultValue={requestedAsset.assetName} />

                                                            } </h3>
                                                            <p className="py-4">Asset Price: ${notUpdate ?
                                                                requestedAsset?.assetPrice :
                                                                <input name="assetPrice" className="border border-gray-400 rounded-md px-1 py-1" type="number" defaultValue={requestedAsset.assetPrice} />

                                                            } </p>
                                                            <p className="py-4">Asset Type: {notUpdate ?
                                                                requestedAsset?.assetType :

                                                                <select name="assetType" className="select select-bordered ">
                                                                    <option disabled selected>{requestedAsset.assetType}</option>
                                                                    <option>Returnable</option>
                                                                    <option>Non-returnable</option>
                                                                </select>


                                                            }  </p>
                                                            <p className="py-4">Reason of Need: {notUpdate ?
                                                                requestedAsset?.whyNeed :
                                                                <input name="whyNeed" className="border border-gray-400 rounded-md px-1 py-1" type="text" defaultValue={requestedAsset.whyNeed} />

                                                            }
                                                            </p>
                                                            <p className="py-4">Additional Info: {notUpdate ?
                                                                requestedAsset?.additionalInfo :
                                                                <input name="additionalInfo" className="border border-gray-400 rounded-md px-1 py-1" type="text" defaultValue={requestedAsset?.additionalInfo} />

                                                            }</p>
                                                            <p className="py-4">Requested Time: {format(new Date(requestedAsset?.requestedDateTime), 'yyyy-MM-dd hh:mm a')}</p>
                                                            <div className="modal-action flex justify-center">
                                                                {
                                                                    !notUpdate ? <div className="space-x-6">
                                                                        <button className="btn ">Save</button>
                                                                        <button onClick={handleCancel} className="btn ">Cancel</button>

                                                                    </div>
                                                                        :
                                                                        <form className="space-x-6" method="dialog">
                                                                            {
                                                                                requestedAsset?.status == "Approved" || requestedAsset?.status == "Rejected" ? (
                                                                                    <button disabled className="btn ">Update</button>
                                                                                ) :
                                                                                    <button onClick={handleUpdate} className="btn ">Update</button>
                                                                            }

                                                                            <button className="btn ">Close</button>
                                                                        </form>
                                                                }



                                                            </div>
                                                        </form>

                                                    </div>
                                                </dialog>

                                            </td>
                                        </tr>

                                    ))
                                }


                            </tbody>
                        </table>
                        </div>

                    }



                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-3xl font-semibold text-center mb-4">My Pending Requests</h2>

                <div>
                    {
                        employersPendingRequestsDatas?.length > 0 ? (
                            <div className="overflow-x-auto"> <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Asset Name</th>

                                        <th>Asset Type</th>
                                        <th>Status</th>

                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        employersPendingRequestsDatas?.map((requestedAsset, idx) => (

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

                                            </tr>

                                        ))
                                    }


                                </tbody>
                            </table>
                            </div>
                        )
                            :
                            <div>
                                <h2 className="text-center">No Pending Requests to Show</h2>
                            </div>

                    }
                </div>
            </div>





            <div className="mt-8">
                <h2 className="text-3xl font-semibold text-center mb-4">My Monthly Requests</h2>

                <div>
                    {
                        monthlyRequests.length > 0 ? <div className="overflow-x-auto"> <table className="table table-zebra">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Asset Name</th>

                                    <th>Asset Type</th>
                                    <th>Status</th>

                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                {
                                    monthlyRequests?.map((requestedAsset, idx) => (

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

                                        </tr>

                                    ))
                                }


                            </tbody>
                        </table>
                        </div>
                            :
                            <div>
                                <h2 className="text-center">No Monthly Requests made</h2>
                            </div>
                    }

                </div>
            </div>



            <div className="mt-8">
                <h2 className="text-3xl font-semibold text-center mb-4">My Frequestly Requests</h2>

                <div>
                    {
                        frequentlyRequests.length > 0 ?
                            <div className="overflow-x-auto"> <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Asset Name</th>

                                        <th>Asset Type</th>
                                        <th>Status</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {
                                        frequentlyRequests?.map((requestedAsset, idx) => (

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

                                            </tr>

                                        ))
                                    }


                                </tbody>
                            </table>
                            </div>
                            :
                            <div>
                                <h2 className="text-center">No Frequestly Requests made</h2>
                            </div>
                    }

                </div>
            </div>



        </div>
    );
};

export default EmployeeHome;