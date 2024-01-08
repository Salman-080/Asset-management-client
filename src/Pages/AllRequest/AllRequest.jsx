import { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { format } from 'date-fns';
import { Helmet } from "react-helmet-async";


const AllRequest = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [allRequest, setAllRequest] = useState([]);

    const { data: allRequestData = [], refetch } = useQuery({
        queryKey: ['allRequestData', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/allRequest/${user.email}`);
            console.log(res.data);
            setAllRequest(res.data);
            return res.data;
        },

    })
    // console.log(allRequest);

    const handleApprove = async (assetId, assetId2) => {


        const res = await axiosSecure.patch(`/approveAssetRequest/${assetId}/${assetId2}`);

        // console.log(res.data);
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

    const handleSearch = async (e) => {
        e.preventDefault();

        const searchValue = e.target.searchField.value;
        // console.log(searchValue);

        const res = await axiosSecure.get(`/allRequests/searchOperation/${user.email}?searching=${searchValue}`);

        // console.log(res.data);

        setAllRequest(res.data);
    }


    return (
        <div className="max-w-screen-xl mx-auto mt-4">
            <Helmet>
                    <title>All Pending Requests</title>
                </Helmet>
            <div className="flex justify-center">
                <form className="flex" onSubmit={handleSearch}>
                    <input name="searchField" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    <button className="btn bg-blue-950 text-white">Search</button>
                </form>
            </div>
            <div className="overflow-x-auto mt-12"><table className="table table-zebra">
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Asset Name</th>

                        <th>Asset Type</th>
                        <th>Requester Name</th>
                        <th>Requester Email</th>
                        <th>Requested Date & Time</th>
                        <th>Addiotional Notes</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        allRequest?.map((requestedAsset, idx) => (
                            <tr key={requestedAsset._id}>
                                <th>{idx + 1}</th>
                                <td>
                                    {requestedAsset.assetName}

                                </td>

                                <td>
                                    {requestedAsset?.assetType}
                                </td>
                                <td>
                                    {requestedAsset.requesterName}
                                </td>
                                <td>
                                    {requestedAsset.requesterEmail}
                                </td>
                                
                                <td>
                                    {format(new Date(requestedAsset.requestedDateTime), 'yyyy-MM-dd hh:mm a')}
                                </td>
                                <td>
                                    {requestedAsset?.additionalInfo}
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
                                        <div>
                                            <button onClick={() => handleApprove(requestedAsset.requestedAssetId, requestedAsset._id)} className="btn bg-green-500 btn-sm text-white">Approve</button>
                                            <button onClick={() => handleReject(requestedAsset._id)} className="btn bg-red-600 btn-sm text-white">Reject</button>
                                        </div>

                                    }

                                </td>


                            </tr>


                            // <div key={requestedAsset._id} className="card bg-base-100 shadow-xl">
                            //     <div className="card-body space-y-3">
                            //         <div className="mx-auto"><h2 className="card-title text-2xl font-semibold">{requestedAsset.assetName}</h2></div>
                            //         <div className="flex space-x-6">
                            //             <div>

                            //                 <p><span>Product Type: </span>{requestedAsset.assetType}</p>

                            //                 <p><span>Requester Name: </span>{requestedAsset.requesterName}</p>
                            //                 <p><span>Requester Email: </span>{requestedAsset.requesterEmail}</p>
                            //                 <p><span>Requested Date: </span>{format (new Date(requestedAsset.requestedDateTime), 'yyyy-MM-dd hh:mm a')}</p>
                            //                 <p><span>Additional Notes of Requester: </span>{requestedAsset.additionalInfo}</p>
                            //             </div>

                            //             <div className="text-right">
                            //                 <h2 className="text-center"><span>Status: </span>

                            //                     {requestedAsset?.status == "Approved" && "Approved"}
                            //                     {!requestedAsset?.status && "Pending"}
                            //                     {requestedAsset?.status == "Rejected" && "Rejected"}

                            //                 </h2>
                            //             </div>
                            //         </div>




                            //         <div className="card-actions">
                            //             {
                            //                 !requestedAsset.status &&
                            //                 <div>
                            //                     <button onClick={() => handleApprove(requestedAsset.requestedAssetId, requestedAsset._id)} className="btn bg-green-500 w-full text-white">Approve</button>
                            //                     <button onClick={() => handleReject(requestedAsset._id)} className="btn bg-red-600 w-full text-white">Reject</button>
                            //                 </div>

                            //             }

                            //         </div>
                            //     </div>
                            // </div>
                        ))
                    }
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default AllRequest;