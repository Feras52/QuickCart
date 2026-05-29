import "./card.css";

type cardProps = {
  name: string;
  price: number;
  category: string;
  imageUrl:string;
};

function Card({ name, price, category,imageUrl }: cardProps) {
  return (
    <div id="card_container">
      <img src={imageUrl} />
      <h1>{name}</h1>
      <h2>${price}</h2>
      <h3>{category}</h3>
      <button>Add to Card <i className="bi bi-bag-plus"></i></button>
    </div>
  );
}

export default Card;
