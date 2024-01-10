import React, { useContext } from 'react';
import useAdmin from '../../Hooks/useAdmin';
import { AuthContext } from '../../Provider/Provider';
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({children}) => {
    const {isAdmin}= useAdmin();
    const {loading}=useContext(AuthContext);

    if(loading){

        return <div>Its Loading</div>
    }

    if(isAdmin){

        return children;
    }

    return <Navigate to="/login"></Navigate>
};

export default AdminPrivateRoute;