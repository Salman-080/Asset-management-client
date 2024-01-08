
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Provider/Provider";
import { Helmet } from "react-helmet-async";

const Packages = () => {

    const [pkgs, setPackages] = useState([]);
    const {handleButPackage}= useContext(AuthContext);
    useEffect(() => {
        axios.get("packages.json")
            .then(res => {
                // console.log(res.data);
                setPackages(res.data);
            })
            .catch(err=>{
                console.log(err)
            })
    }, [])
    console.log(pkgs)
    return (
        <div className="max-w-screen-xl mx-auto">
            <Helmet>
                    <title>Package | List</title>
                </Helmet>
                <div>
                <h2 className="text-4xl font-bold text-center ">Packages</h2>
            </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:mt-8">
           
            {
                pkgs?.map(pkg=>(
                    <div key={pkg.id} className="card shadow-xl py-7 bg-green-100">

                    <div className="card-body items-center text-center space-y-5">
                        <h2 className="text-2xl font-bold ">{pkg.packageType}</h2>
                        <h2 className="card-title text-2xl">Price: {pkg.price}</h2>
                        <p className="text-xl">{pkg.members} Members</p>
                        <div className="card-actions">
                          <Link to="/payment"> <button onClick={()=>handleButPackage(pkg)} className="btn bg-yellow-500 text-white">Buy Now</button></Link> 
                        </div>
                    </div>
                </div>
                ))
            }
           </div>
        </div>
    );
};

export default Packages;