import { useContext, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Provider/Provider";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import useIsEmployee from "../../Hooks/useIsEmployee";
import useCurrentEmployeersAdmin from "../../Hooks/useCurrentEmployeersAdmin";

const RequestAssets = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [isEmployee] = useIsEmployee();
    // const [adminInfo] = useAdminInfo();
    // console.log(adminInfo)
    const [hisEmail]= useCurrentEmployeersAdmin();

    const [assets, setAssets]=useState([]);
    const { data: rqstingAssets = [], refetch } = useQuery({
        queryKey: ['rqstingAssets', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/requestAssets/${user.email}`);
            console.log(res.data);
            setAssets(res.data);
            return res.data;
        }
    })
    console.log(assets);

    const handleRequestAsset = async (asset, e) => {
        e.preventDefault();
        console.log(asset)

        const additionalNotes = e.target.additionalNotes.value;
        console.log(additionalNotes)

        const requestedDateTime = new Date();

        const requestedAssetInfo = {
            requestedAssetId: asset._id,
            assetName: asset.assetName,
            assetImage: asset.assetImage,
            assetType: asset.assetType,
            assetQuantity: asset.assetQuantity,
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            requesterImage: user?.photoURL,
            additionalInfo: additionalNotes,
            requestedDateTime,
            adminEmail: asset.email
        }


        const res = await axiosSecure.post("/assetRequesting", requestedAssetInfo);
        console.log(res.data)

        if (res.data.insertedId) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully requested",

            });
        }

    }

    const handleSearch = async (e) => {
        e.preventDefault();

        const searchValue= e.target.searchField.value;
        console.log(searchValue);

        const res = await axiosSecure.get(`/employeRqstAsstsSearchOperation/${hisEmail}?searching=${searchValue}`);

        console.log(res.data);

        setAssets(res.data);
    }

    const handleFilter = async (availability) => {
        const res = await axiosSecure.get(`/employeeRqstAsstsfilterOperation/${hisEmail}?filtering=${availability}`);

        console.log(res.data);

        setAssets(res.data);
    }

    return (
        <div className="max-w-screen-xl mx-auto">

            <Helmet>
                <title>Request Asset</title>
            </Helmet>

            <div className="flex justify-around mt-6 mb-6">
                <div>
                    <div className="dropdown dropdown-bottom">
                        <div tabIndex={0} role="button" className="btn m-1">Filter</div>
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><button onClick={() => handleFilter("available")}>Available Asset</button></li>
                            <li><button onClick={() => handleFilter("stockOut")}>Stock Out</button></li>

                        </ul>
                    </div>
                </div>
                <form className="flex" onSubmit={handleSearch}>
                    <input name="searchField" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    <button className="btn bg-blue-950 text-white">Search</button>
                </form>

            </div>

            {
                isEmployee ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        {
                            assets.map(asset => (
                                <div key={asset._id} className="card bg-base-100 shadow-xl text-center">
                                    <div className="card-body">
                                        <div className="w-full h-[150px]">
                                            <img className="w-full h-full" src={asset.assetImage} alt="" />
                                        </div>
                                        <h2><span>Asset Name: </span>{asset.assetName}</h2>
                                        <h2><span>Asset Type: </span>{asset.assetType}</h2>
                                        <h2>Product Availability: <span>{

                                            asset.assetQuantity > 0 ? 'Available' : 'Out of Stock'

                                        }</span></h2>
                                        <div className="card-actions mx-auto">
                                            {/* <button onClick={() => handleRequestAsset()} className="btn btn-primary">Request</button> */}




                                            {/* Open the modal using document.getElementById('ID').showModal() method */}
                                            <button disabled={asset.assetQuantity < 1} className="btn bg-green-500 text-white" onClick={() => document.getElementById(`my_modal_5${asset._id}`).showModal()}>Request</button>
                                            <dialog id={`my_modal_5${asset._id}`} className="modal modal-bottom sm:modal-middle">
                                                <div className="modal-box">

                                                    <form className="space-x-3" onSubmit={(e) => handleRequestAsset(asset, e)} >
                                                        <input type="text" placeholder="Additional Notes" className="input input-bordered input-lg w-full max-w-xs" name="additionalNotes" />


                                                        <button className="btn btn-primary ">Request</button>
                                                    </form>
                                                    <div className="modal-action">

                                                        <form method="dialog">
                                                  
                                                            <button className="btn">Close</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>





                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
                    :
                    <h2 className="text-4xl text-center font-bold text-red-600 mt-8">Contact With Your HR/Admin!</h2>
            }


        </div>
    );
};

export default RequestAssets;