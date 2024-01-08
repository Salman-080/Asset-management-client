import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useContext } from "react";
import { AuthContext } from "../../Provider/Provider";
import useCurrentEmployeersAdmin from "../../Hooks/useCurrentEmployeersAdmin";
import { Helmet } from "react-helmet-async";
import useIsEmployee from "../../Hooks/useIsEmployee";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
const image_hosting_key = import.meta.env.VITE_IMAGE_API;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`

const MakeCustomRequest = () => {
    const { user } = useContext(AuthContext);
    const [hisEmail] = useCurrentEmployeersAdmin();
    const axiosPublic=useAxiosPublic();
    console.log(hisEmail);
    const [isEmployee] = useIsEmployee();
    const axiosSecure = useAxiosSecure();
    const handleCustomRequest = async (e) => {
        e.preventDefault();

        const imageFile = {
            image: e.target.assetImage.files[0],

        }

        const result = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });

        if (result.data.success) {
            const requestedDateTime = new Date()
            const customRequestedAsset = {
                assetName: e.target.assetName.value,
                assetPrice: e.target.assetPrice.value,
                assetType: e.target.assetType.value,
                assetImage: result.data.data.display_url,
                whyNeed: e.target.whyNeed.value,
                additionalInfo: e.target.additionalInfo.value,
                requesterName: user?.displayName,
                requesterEmail: user?.email,
                adminEmail: hisEmail,
                requestedDateTime


            }

            console.log(customRequestedAsset);

            const res = await axiosSecure.post("/makeCustomRequest", customRequestedAsset);
            console.log(res.data);

            if (res.data?.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: "Successfully Custom Request Done",

                });
            }
        }


    }
    return (
        <div className="max-w-screen-xl mx-auto">
            <Helmet>
                <title>Custom Request</title>
            </Helmet>

            {
                isEmployee ? (
                    <div className="">
                        <form onSubmit={handleCustomRequest} className=" space-y-9 mt-12 mx-auto p-16 bg-slate-100 md:w-[600px] lg:w-[900px]">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-1">
                                    <h2>Asset Name</h2>
                                    <input className="w-full px-1 py-1 rounded-md" type="text" name="assetName" id="" />
                                </div>
                                <div className="space-y-1">
                                    <h2>Price</h2>
                                    <input className="w-full px-1 py-1 rounded-md" type="number" name="assetPrice" id="" />
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
                                    <h2>Asset Image</h2>
                                    <input className="w-full px-1 py-1 rounded-md" type="file" name="assetImage" id="" />
                                </div>

                                <div className="space-y-1">
                                    <h2>Why You Need This?</h2>
                                    <textarea className="w-full px-1 py-1 rounded-md" name="whyNeed" id="" cols="30" rows="10"></textarea>
                                </div>
                                <div className="space-y-1">
                                    <h2>Additional Information</h2>
                                    <textarea className="w-full px-1 py-1 rounded-md" name="additionalInfo" id="" cols="30" rows="10"></textarea>
                                </div>
                            </div>
                            <br />

                            <div className="text-center">
                                <button className="btn bg-green-500 text-white">Request Asset</button>
                            </div>
                        </form>
                    </div>
                )
                    :
                    <h2 className="text-4xl text-center font-bold text-red-600 mt-8">Contact With Your HR/Admin!</h2>
            }


        </div>
    );
};

export default MakeCustomRequest;