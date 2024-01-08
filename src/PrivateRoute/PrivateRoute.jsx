import { useContext } from "react";
import { AuthContext } from "../Provider/Provider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {
    const {user,loading}= useContext(AuthContext);

    if(loading){

        return <div>Its Loading</div>
    }

    if(user){

        return children;
    }

    return <Navigate to="/login"></Navigate>
};

export default PrivateRoute;