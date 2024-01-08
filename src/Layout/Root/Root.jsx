import { Outlet } from "react-router-dom";
import Navbar from "../../FixedComponents/Navbar/Navbar";
import Footer from "../../FixedComponents/Footer/Footer";

const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="min-h-screen md:min-h-[150vh] lg:min-h-[70vh]">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Root;