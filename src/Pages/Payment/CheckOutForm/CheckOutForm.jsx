import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Provider/Provider";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import usePackageExists from "../../../Hooks/usePackageExists";

import Swal from "sweetalert2";

const CheckOutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useContext(AuthContext);
    const [err, setErr] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [transactionId, setTransactionId] = useState('');
    const axiosSecure = useAxiosSecure();

    const [loading, setLoading] = useState(false);

    const [packageExists, refetch] = usePackageExists();


    const { packageInfo } = useContext(AuthContext);
    // const [price, setPrice]= useState(0);
    // console.log(packageInfo);
    const navigate = useNavigate();
    const price = packageInfo?.package?.split(" ")[3].split("$")[1];






    // reload marle
    useEffect(() => {
        if (Object.keys(packageInfo).length === 0 || !packageInfo.package) {

                navigate("/increasePackageLimit");
        
            
        }


    }, [packageInfo])

    useEffect(() => {
        if (price > 0) {
            axiosSecure.post("/create-payment-intent", { price: price })
                .then(res => {
                    console.log(res.data);
                    setClientSecret(res.data.clientSecret);
                })

        }

    }, [axiosSecure, price])




    // console.log(price)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setTransactionId('');


        setLoading(true);




        if (!stripe || !elements) {

            return;
        }

        const card = elements.getElement(CardElement);

        if (card == null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            // console.log('failed. error', error);
            setErr(error.message);
        }
        else {
            console.log('payment successful', paymentMethod);
        }


        const { paymentIntent, error: paymentConfirmError } = await stripe.confirmCardPayment(clientSecret, {

            payment_method: {
                card: card,
                billing_details: {
                    name: user?.displayName || "Anonymous",
                    email: user?.email || "Anonymous",
                }
            }
        })

        if (paymentConfirmError) {
            setLoading(false);
            console.log("payment confirm error", paymentConfirmError);

            setErr(paymentConfirmError.message);
        }
        else {
            console.log("payment Confirm Success", paymentIntent);

            if (paymentIntent.status == "succeeded") {
                setTransactionId(paymentIntent.id);

                const result = await axiosSecure.patch(`/addPackage/${user?.email}`, packageInfo)

                if (result.data.modifiedCount > 0) {
                    refetch();

                    setLoading(false);



                    Swal.fire({
                        icon: "success",
                        title: "Successful",
                        text: "Successfully Bought Package",

                    });
                }

            }
        }


    }



    return (
        <div className="mt-8">
            <form onSubmit={handleSubmit} >

                {
                    loading && <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>
                }
                <div className="md:w-[600px] bg-slate-100 mx-auto h-[200px] grid items-center space-y-4   md:px-14">
                    <CardElement className=" "
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                        backgroundColor: "white",


                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />

                    <div className="text-center">
                        <button className=" btn bg-green-400 text-white" type="submit" disabled={!stripe || !clientSecret}>
                            Pay
                        </button>
                    </div>



                </div>
                <div className="text-center text-red-600">
                    <h2>{err}</h2>
                </div>

                {
                    transactionId && (
                        <div className="text-center" >
                            <h2> Your Transaction Id: <span className=" text-green-600"> {transactionId}</span> </h2>
                        </div>
                    )
                }



            </form>
        </div>
    );
};

export default CheckOutForm;