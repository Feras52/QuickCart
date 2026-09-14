import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Card from "../components/Card";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

import "./Shop.css";

function Shop() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    rows: 2,
    slidesPerRow: 1,
  };

  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [search_word, setSearch_word] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const querySnapshot = await getDocs(productsCollection);

      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(productsData);
    };

    fetchProducts();
  }, []);

  let items = data;

  // 1. First, apply the category filter (if it isn't "All")
  if (filter !== "All") {
    items = items.filter((item: any) => item.category === filter);
  }

  // 2. Then, apply the search word filter to the remaining items
  if (search_word !== "") {
    items = items.filter((item: any) =>
      item.name.toLowerCase().includes(search_word.toLowerCase()),
    );
  }

  return (
    <>
      <NavBar />

      <main className="home_main">
        <div id="searchbar_container">
          <input
            id="search_input"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch_word(e.target.value)}
          />
          <i className="bi bi-search"></i>
        </div>

        <div id="category_container">
          <button
            className={filter === "All" ? "active" : ""}
            onClick={() => setFilter("All")}
          >
            All
          </button>

          <button
            className={filter === "Kitchen" ? "active" : ""}
            onClick={() => setFilter("Kitchen")}
          >
            #kitchen <i className="bi bi-fork-knife"></i>
          </button>

          <button
            className={filter === "Electronics" ? "active" : ""}
            onClick={() => setFilter("Electronics")}
          >
            #electronics <i className="bi bi-cpu"></i>
          </button>

          <button
            className={filter === "Sport" ? "active" : ""}
            onClick={() => setFilter("Sport")}
          >
            #sport <img src="sport icon.png" alt="Sport" />
          </button>

          <button
            className={filter === "Clothing" ? "active" : ""}
            onClick={() => setFilter("Clothing")}
          >
            #clothing <img src="shirt icon.png" alt="Clothing" />
          </button>
        </div>

        <div id="home_slider_container">
          <Slider {...settings}>
            {items.map((item: any) => (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                category={item.category}
                imageUrl={item.imageUrl}
              />
            ))}
          </Slider>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Shop;
