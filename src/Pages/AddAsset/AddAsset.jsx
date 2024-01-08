import { useContext } from "react";
import useAdminInfo from "../../Hooks/useAdminInfo";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/Provider";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
const image_hosting_key = import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`
const AddAsset = () => {
    const [adminInfo] = useAdminInfo();
    console.log(adminInfo)
    const axiosSecure = useAxiosSecure();
    const axiosPublic=useAxiosPublic();
    const { user } = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageFile = {
            image: e.target.assetImage.files[0],

        }
        console.log(e.target.assetImage.files);

        const result = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        if(result.data.success){
            const assetName = e.target.assetName.value;
            const assetImage = result.data.data.display_url;
            const assetType = e.target.assetType.value;
            const assetQuantity = e.target.assetQuantity.value;
    
            console.log(assetName, assetQuantity, assetType, assetImage);
    
            const assetAddedDate = new Date();
            const productsInfo = {
                userName: adminInfo?.name,
                email: user?.email,
                companyName: adminInfo?.companyName,
                companyLogo: adminInfo?.companyLogo,
                assetName,
                assetImage,
                assetQuantity,
                assetType,
                assetAddedDate
            }
            console.log(productsInfo)
            const res = await axiosSecure.post("/productsAdd", productsInfo);
            console.log(res.data);
    
            if(res.data?.insertedId){
                Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: "Successfully Added Asset",
    
                });
            }
        }
    
    }
    return (
        <div className="max-w-screen-xl mx-auto">
            <Helmet>
                <title>Add Assets</title>
            </Helmet>
            <form onSubmit={handleSubmit} className=" space-y-9 mt-12 mx-auto  p-16 bg-slate-100 md:w-[500px] lg:w-[800px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-1">
                        <h2 className="">Asset Name</h2>
                        <input className="w-full px-1 py-1 rounded-md" type="text" name="assetName" id="" />
                    </div>
                    <div className="space-y-1">
                        <h2>Asset Image</h2>
                        <input className="w-full px-1 py-1 rounded-md" type="file" name="assetImage" id="" />
                    </div>
                    <div className="space-y-1">
                        <h2>Asset Type</h2>
                        <select name="assetType" className="select select-bordered w-full">
                            <option disabled selected>Product Type</option>
                            <option>Returnable</option>
                            <option>Non-returnable</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <h2>Asset Quantity</h2>
                        <input className="w-full px-1 py-1 rounded-md" type="number" name="assetQuantity" id="" required />
                    </div>
                </div>

        <div className="text-center">
        <button className="btn bg-green-500 text-white ">Add Product</button>
        </div>
                
            </form>
        </div>
    );
};

export default AddAsset;