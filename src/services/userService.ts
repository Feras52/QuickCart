import {doc, getDoc, collection, query, where, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";

export const getUserInformation = async (userId: string) => {
    const userPointer = doc(db, "users", userId); // pointer to the document containing the users getUserInformation
    
    const userInfo = await getDoc (userPointer);

    if (!userInfo.exists()){
        return null;
    }

    return userInfo.data();
}

export const getUserOrders = async (userId: string ) => {
    const ordersPointer = collection(db,"orders");
    const ordersQuery = query(ordersPointer,where("userId", "==",userId));

    const ordersInformation = await getDocs(ordersQuery); // it return meta info about the query(cache, number of docs, and 
                                                         // the data itself) thats why we use .docs to get just the docs

    return ordersInformation.docs.map((doc) => ({id:doc.id, ...doc.data(),}));

}