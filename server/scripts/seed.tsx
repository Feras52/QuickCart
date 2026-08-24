/* temp file for seeding product data from products.tsx file to firebase firestore 
import {data as products} from '../public/products';
import {collection, addDoc} from 'firebase/firestore';
import {db} from '../src/config/firebase.ts';

export async function remplir (){
    try{
        const collectionRef = collection(db,"products"); // define collection here so it doesnt iterate in every for loop iteration
        
        for (const prod of products){
            await addDoc(collectionRef,{name:prod.name,price:prod.price,category:prod.category,imageUrl:prod.imageUrl})
        }
        console.log("seeding complete");
    }
    catch(error){
        console.log(error);
    }
}
*/