import { createContext, useEffect, useState } from "react";
import app from "../Firebase/firebase.config";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export const AuthContext = createContext(null);

const Provider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [packageInfo, setPackageInfo] = useState({});

    const provider = new GoogleAuthProvider();
    // const [packageLoad, setPackageLoad]= useState(false);
    // const queryClient = useQueryClient();

    // const {data: packageInfo={}}= useQuery({
    //     queryKey: ["packageInfo", user?.email],
    //     queryFn: async ()=>{
    //         queryClient.setQueryData(["packageInfo", user?.email], pkg);
    //         // setPackageInfo()
    //     }
    // })

    const auth = getAuth(app);

    // console.log(packageInfo)


    const handleButPackage = (pkg) => {
        console.log(pkg);
        // queryClient.setQueryData(["packageInfo", user?.email], pkg);
        setPackageInfo({ package: pkg.package });

    }
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);

    }


    const googleSignIn = () => {

        return signInWithPopup(auth, provider);

    }

    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);

    }

    const profileUpdate = (userName, userImage) => {
        return updateProfile(auth.currentUser, {
            displayName: userName, photoURL: userImage
        })
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }



    const resetPass = (email) => {
        console.log(email)
        sendPasswordResetEmail(auth, email)
            .then((res) => {
                alert("please check your email")
                
            })
            .catch((error) => {
                
            });
    }





    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        }
    }, [])




    const authInfo = {
        createUser,
        signInUser,
        user,
        logOut,
        profileUpdate,
        handleButPackage,
        packageInfo,
        loading,
        setPackageInfo,
        googleSignIn,
        resetPass
        // setPackageLoad,
        // packageLoad,


    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default Provider;