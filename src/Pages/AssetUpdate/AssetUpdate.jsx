import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const AssetUpdate = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { id } = useParams();
    const { data: UpdatingAsset = {}, refetch } = useQuery({
        queryKey: ['UpdatingAsset', user?.email, id],


        queryFn: async () => {
            const res = await axiosSecure.get(`/getAssetInfo/${id}`);
            console.log(res.data);

            return res.data;
        },

    })
    console.log(UpdatingAsset);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedAssetDatas= {
            assetName: e.target.assetName.value,
            assetImage: e.target.assetImage.value,
            assetType: e.target.assetType.value,
            assetQuantity: e.target.assetQuantity.value
            

        }

        console.log(updatedAssetDatas);
        const res= await axiosSecure.put(`/updateAsset/${id}`, updatedAssetDatas);
        console.log(res.data);

        if(res.data?.modifiedCount> 0){
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Asset Successfully Deleted",
    
            });
            refetch();
        }



    }
    return (
        <div className="max-w-screen-xl mx-auto">
            <Helmet>
                <title> Asset | Update</title>
            </Helmet>
            <form onSubmit={handleSubmit} className=" space-y-9 mt-12 mx-auto  p-16 bg-slate-100 md:w-[500px] lg:w-[800px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-1">
                        <h2 className="">Asset Name</h2>
                        <input defaultValue={UpdatingAsset.assetName} className="w-full px-1 py-1 rounded-md" type="text" name="assetName" id="" />
                    </div>
                    <div className="space-y-1">
                        <h2>Asset Image</h2>
                        <input defaultValue={UpdatingAsset.assetImage} className="w-full px-1 py-1 rounded-md" type="text" name="assetImage" id="" />
                    </div>
                    <div className="space-y-1">
                        <h2>Asset Type</h2>
                        <select  name="assetType" className="select select-bordered w-full">
                            <option disabled selected>{UpdatingAsset.assetType}</option>
                            <option>Returnable</option>
                            <option>Non-returnable</option>
                        </select>
                    </div>
                    <div  className="space-y-1">
                        <h2>Asset Quantity</h2>
                        <input defaultValue={UpdatingAsset.assetQuantity} className="w-full px-1 py-1 rounded-md" type="number" name="assetQuantity" id="" required />
                    </div>
                </div>

                <div className="text-center">
                    <button className="btn bg-green-500 text-white ">Update Asset</button>
                </div>

            </form>
        </div>
    );
};

export default AssetUpdate;