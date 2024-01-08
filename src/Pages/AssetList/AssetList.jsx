import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/Provider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AssetList = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [assetsList, setAssetList] = useState([]);

    const { data: assetsLists, refetch } = useQuery({
        queryKey: ['assetsLists', user?.email],

        queryFn: async () => {
            const res = await axiosSecure.get(`/assetsList/${user.email}`);
            console.log(res.data);
            setAssetList(res.data)

            return res.data;
        },

    })


    const handleSort = async (sortOrderValue) => {
        console.log(sortOrderValue)
        const res = await axiosSecure.get(`/sortOperation/${user.email}?sorting=${sortOrderValue}`);

        console.log(res.data);

        setAssetList(res.data);




    }

    const handleFilter = async (availability) => {
        const res = await axiosSecure.get(`/filterOperation/${user.email}?filtering=${availability}`);

        console.log(res.data);

        setAssetList(res.data);
    }


    const handleSearch = async (e) => {
        e.preventDefault();

        const searchValue= e.target.searchField.value;
        console.log(searchValue);

        const res = await axiosSecure.get(`/searchOperation/${user.email}?searching=${searchValue}`);

        console.log(res.data);

        setAssetList(res.data);
    }

    console.log(assetsList)


   const handleDelete=async(assetId)=>{

    const res= await axiosSecure.delete(`/assetDataDelete/${assetId}`);
    console.log(res.data);

    if(res.data?.deletedCount){
        Swal.fire({
            icon: "success",
            title: "Successful",
            text: "Asset Successfully Deleted",

        });

        refetch();
    }
   }

    return (
        <div className="max-w-screen-xl mx-auto mt-2">
            <Helmet>
                    <title>Assets | List</title>
                </Helmet>
            <div>
                <h2 className="text-4xl font-bold text-center">Asset List</h2>
                <div className="flex justify-around mt-8">
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

                    <div>
                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button" className="btn m-1">Sort by Quantity</div>
                            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li><button onClick={() => handleSort("asc")}>Low to High</button></li>
                                <li><button onClick={() => handleSort("dsc")}>High to Low</button></li>

                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-12">
                    {
                        assetsList?.map(asset => (
                            <div key={asset._id} className="card w-96 bg-base-100 shadow-xl text-center">
                                <div className="card-body">
                                    <div className="w-full h-[200px]">
                                        <img className="w-full h-full" src={asset.assetImage} alt="" />
                                    </div>
                                    <h2><span>Asset Name: </span>{asset.assetName}</h2>
                                    <h2><span>Asset Type: </span>{asset.assetType}</h2>
                                    <h2><span>Product Quantity: </span>{asset.assetQuantity}</h2>

                                    <h2><span>Asset added: </span>{format(new Date(asset.assetAddedDate), 'yyyy-MM-dd hh:mm a')}</h2>
                                    <div className="card-actions mx-auto">
                                     <Link to={`/assetAddedUpdate/${asset._id}`}><button className="btn btn-primary">Update</button></Link>   
                                        <button onClick={()=>handleDelete(asset._id)} className="btn btn-secondary">Delete</button>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div>

            </div>
        </div>
    );
};

export default AssetList;