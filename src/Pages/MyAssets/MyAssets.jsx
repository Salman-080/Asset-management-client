import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Provider/Provider";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

import { Document, PDFDownloadLink, PDFViewer, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import PDFPage from "../PDFPage/PDFPage";
import { Helmet } from "react-helmet-async";
import useIsEmployee from "../../Hooks/useIsEmployee";
import { format } from "date-fns";
import useEmployeeInfo from "../../Hooks/useEmployeeInfo";


const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});



const MyAssets = () => {

    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [returned, setReturned] = useState([]);
    const [isEmployee] = useIsEmployee();
    const [EmployeeInfo, refetch] = useEmployeeInfo();

    const [myAssets, setMyAssets] = useState([]);

    useEffect(() => {
        refetch();
    }, [EmployeeInfo])

    const { data: myAssetss = [], refetch: refetchData } = useQuery({
        queryKey: ['myAssetss', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/myAssets/${user.email}`);
            console.log(res.data);
            setMyAssets(res.data);
            return res.data;
        }
    })
    console.log(myAssets);

    const handleReturn = async (assetId, assetObjectId) => {

        const res = await axiosSecure.patch(`/returnQuantityInc/${assetId}/${assetObjectId}`);
        console.log(res.data)

        if (res.data.result1.modifiedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Returned Asset",

            });

            const newArrWithId = [...returned, assetObjectId];
            setReturned(newArrWithId);
            console.log(returned);

            refetchData();
        }
    }


    const handleCancelRequest = async (assetId) => {

        const res = await axiosSecure.delete(`/cancelRequest/${assetId}`);

        console.log(res.data)
        if (res.data.deletedCount > 0) {
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: "Successfully Canceled Request",

            });

            refetchData()
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        const searchValue = e.target.searchField.value;
        console.log(searchValue);

        const res = await axiosSecure.get(`/myAssetsSearchOperation/${user.email}?searching=${searchValue}`);

        console.log(res.data);
        setMyAssets(res.data);

    }

    const handleFilter = async (filterData) => {
        const res = await axiosSecure.get(`/myAssetsFilteringOperation/${user.email}?filtering=${filterData}`);

        console.log(res.data);

        setMyAssets(res.data);
    }

    return (
        <div className="max-w-screen-xl mx-auto ">
            <Helmet>
                <title>My Assets</title>
            </Helmet>
            <div className="flex justify-between space-x-8">
                <div>
                    <div className="dropdown dropdown-bottom">
                        <div tabIndex={0} role="button" className="btn m-1">Filter</div>
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><button onClick={() => handleFilter("Returnable")}>Returnable</button></li>
                            <li><button onClick={() => handleFilter("Non-returnable")}>Non-returnable</button></li>
                            <li><button onClick={() => handleFilter("Approved")}>Approved</button></li>
                            <li><button onClick={() => handleFilter("Pending")}>Pending</button></li>

                        </ul>
                    </div>
                </div>

                <div>
                    <form className="flex" onSubmit={handleSearch}>
                        <input name="searchField" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                        <button className="btn bg-blue-950 text-white">Search</button>
                    </form>
                </div>
            </div>


            {
                isEmployee ? (
                    <div className="overflow-x-auto"><table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>SL</th>
                                <th>Asset Name</th>

                                <th>Asset Type</th>
                                <th>Request Date</th>
                                <th>Approval Date</th>
                                <th>Status</th>
                                <th>Action</th>

                            </tr>
                        </thead>

                        <tbody >

                            {
                                myAssets?.map((myAsset, idx) => (


                                    <tr key={myAsset._id}>
                                        <th>{idx + 1}</th>
                                        <td>
                                            {myAsset?.assetName}

                                        </td>

                                        <td>
                                            {myAsset?.assetType}
                                        </td>
                                        <td>
                                            {format(new Date(myAsset?.requestedDateTime), 'yyyy-MM-dd hh:mm a')}
                                        </td>
                                        <td>
                                            {
                                                myAsset && myAsset.approvedDate && (
                                                    <p>{format(new Date(myAsset?.approvedDate), 'yyyy-MM-dd hh:mm a')}</p>
                                                )
                                            }

                                        </td>
                                        <td>
                                            {
                                                myAsset?.status == "Approved" && <h2>Approved</h2>
                                            }
                                            {
                                                myAsset?.status == "Rejected" && <h2>Rejected</h2>
                                            }

                                            {
                                                !myAsset?.status && <h2>Pending</h2>
                                            }


                                        </td>


                                        <td >
                                            {
                                                !myAsset.status && <button onClick={() => handleCancelRequest(myAsset._id)} className="btn bg-yellow-400">Cancel</button>
                                            }

                                            {
                                                myAsset?.status == "Approved" && myAsset?.assetType !== "Returnable" &&

                                                <PDFDownloadLink
                                                    document={
                                                        <PDFPage asseToPrint={myAsset} EmployeeInfo={EmployeeInfo}></PDFPage>
                                                    }
                                                    fileName={`Printed_Request_${myAsset._id}.pdf`}
                                                >
                                                    {({ loading }) =>
                                                        loading ? (
                                                            "Loading"
                                                        ) : (

                                                            <button className="btn bg-green-500">Print</button>
                                                        )
                                                    }
                                                </PDFDownloadLink>

                                            }

                                            {
                                                myAsset?.status == "Approved" && myAsset?.assetType == "Returnable" &&
                                                <div><button disabled={returned.includes(myAsset._id)} onClick={() => handleReturn(myAsset.requestedAssetId, myAsset._id)} className="btn bg-green-500">Return</button></div>
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
                    <h2 className="text-4xl text-center font-bold text-red-600 mt-8">Contact With Your HR/Admin!</h2>
            }

        </div>
    );
};

export default MyAssets;