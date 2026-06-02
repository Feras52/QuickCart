import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useState, useEffect,type ReactNode} from "react";
import {auth} from "../config/firebase";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({children}:{children: ReactNode}) => {
    const [user,setUser] = useState <User | null> (null);
    const [loading,setLoading] = useState(true);

    // ask firebase for the user when page loading
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,(currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        }
    },[]);

    return (
        //braodcast the user and loading value to the whole app
        <AuthContext.Provider value={{user,loading}} >
            {!loading && children}
        </AuthContext.Provider>
    );

}

// shortcut other pages can use to get the user value & loading status
export const useAuth = () => useContext(AuthContext);