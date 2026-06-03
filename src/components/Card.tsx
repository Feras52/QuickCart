import "./card.css";

import {useState} from "react";

import { useCartStore } from "../store/cartStore";

type cardProps = {
  id :number;
  name: string;
  price: number;
  category: string;
  imageUrl:string;
};

function Card({ id,name, price, category,imageUrl }: cardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const [added,setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id,name,price,imageUrl,
    });

    setAdded(true);

    //After 1 second hide Added! again.
    setTimeout(() => {
      setAdded(false);
    },1000)
  };

  return (
    <div id="card_container">
      <img src={imageUrl} />
      <h1>{name}</h1>
      <h2>${price}</h2>
      <h3>{category}</h3>
      <button onClick={handleAddToCart} > {added? "Added!" : "Add to Cart"} <i className="bi bi-bag-plus"></i></button>
    </div>
  );
}

export default Card;
