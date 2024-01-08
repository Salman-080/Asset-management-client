import { useContext } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Provider/Provider";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const CustomRequestList = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const { data: customRequestedAssets = [], refetch } = useQuery({
        queryKey: ['customRequestedAssets', user?.email],


        queryFn: async () => {
            const res = await axiosSecure.get(`/customRequestedAssets/${user.email}`);
            console.log(res.data)
            return res.data;
        },

    })

    // console.log(customRequestedAssets);


    const handleApprove = async (assetId) => {


        const res = await axiosSecure.patch(`/approveCustomAssetRequest/${assetId}`);

        // console.log(res.data);
        if (res.data.modifiedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Approved Request",

            });

            refetch();
        }

    }

    const handleReject=async(assetId)=>{
        const res = await axiosSecure.patch(`/rejectCustomAssetRequest/${assetId}`);

        console.log(res.data);
        if (res.data.modifiedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Rejected Request",

            });

            refetch();
        }
    }


    return (
        <div className="max-w-screen-xl mx-auto">
            <Helmet>
                    <title>Custom Request</title>
                </Helmet>
            <div className="overflow-x-auto"><table className="table table-zebra">

                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Asset Image</th>
                        <th>Asset Name</th>
                        <th>Asset Price</th>
                        
                        <th>Asset Type</th>
                        <th>Reason of Need</th>
                        <th>Additional Info</th>

                      
                        <th>Status</th>
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>
                {
                    customRequestedAssets.map((requestedAsset, idx) => (

                        <tr key={requestedAsset._id}>
                            <th>{idx + 1}</th>
                            <td>
                                <img className="w-[35px] h-[35px] rounded-full" src={requestedAsset?.assetImage} alt="" />
                            </td>
                            <td>
                                {requestedAsset?.assetName}

                            </td>
                            <td>
                                ${requestedAsset?.assetPrice}

                            </td>

                            <td>
                                {requestedAsset?.assetType}
                            </td>
                            <td>
                                {requestedAsset?.whyNeed}
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
                                    <div className="space-x-5">



                                        <button onClick={() => handleApprove(requestedAsset._id)} className="btn bg-green-500 btn-sm  text-white">Approve</button>
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
        </div>
    );
};

export default CustomRequestList;