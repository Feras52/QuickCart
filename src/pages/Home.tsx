import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { data } from "../../public/products.tsx";
import Card from "../components/Card";

import { useState } from "react";
import "./Home.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function Home() {
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

  const [filter, setFilter] = useState("All");
  const [search_word, setSearch_word] = useState("");

  const items =
    search_word !== ""
      ? data.filter((item: any) => item.name.toLowerCase().includes(search_word.toLowerCase()))
      : filter === "All"
      ? data
      : data.filter((item: any) => item.category === filter);

  /*if (search_word !==""){
      items = data.filter;
    }
    else{
      if(filter ==="all"){
        items = data
      }
      else{
        items = data.fitler
      }
    }
    */

  return (
    <>
      <NavBar />

      <main className="home_main" >
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
          <button onClick={() => setFilter("All")}>All</button>
          <button onClick={() => setFilter("Kitchen")}>
            #kitchen <i className="bi bi-fork-knife"></i>
          </button>
          <button onClick={() => setFilter("Electronics")}>
            #electronics <i className="bi bi-cpu"></i>
          </button>
          <button onClick={() => setFilter("Sport")}>
            #sport <img src="sport icon.png" />{" "}
          </button>
          <button onClick={() => setFilter("Clothing")}>
            #clothing <img src="shirt icon.png" />{" "}
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
export default Home;
