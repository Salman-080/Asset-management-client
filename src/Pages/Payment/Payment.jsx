import { useContext } from "react";
import { AuthContext } from "../../Provider/Provider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "./CheckOutForm/CheckOutForm";
import { Helmet } from "react-helmet-async";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);
const Payment = () => {
    const { packageInfo } = useContext(AuthContext);
    // console.log(packageInfo);

 
   
    return (
        <div className="max-w-screen-xl mx-auto mt-12">
            <h2 className="text-center text-4xl font-bold">Payment</h2>

            <div>
            <Helmet>
                    <title>Payment</title>
                </Helmet>
                <Elements stripe={stripePromise}>
                    <CheckOutForm></CheckOutForm>
                </Elements>
            </div>
        </div>
    );
};

export default Payment;