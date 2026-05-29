import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AboutUsSlider.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function AutoPlay() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    speed: 1000,
    autoplaySpeed: 3000,
    cssEase: "ease",
    pauseOnHover: true,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="container">
          <center>
            <div className="left_container">
              <p className="title">About Us </p> <br />
              <p className="phrase">Making shopping simple and fun</p>
            </div>
            <div className="right_container">
              <img src="AboutUsSlideImages\pic1.png" />
            </div>
          </center>
        </div>
        <div className="container">
          <center>
            <div className="left_container">
              <p className="title"> Who We Are</p> <br />
              <p className="phrase">
                QuickCart is a mini online marketplace built to make shopping
                easier for everyone. <br /> We focus on simple design, easy
                navigation, and quick access to products
              </p>
            </div>

            <div className="right_container">
              <img src="AboutUsSlideImages\pic2.png" />
            </div>
          </center>
        </div>
        <div className="container">
          <center>
            <div className="left_container">
              <p className="title">Our Mission</p> <br />
              <p className="phrase">
                Our mission is to provide a clean, modern shopping experience.
              </p>
            </div>
            <div className="right_container">
              <img src="AboutUsSlideImages\pic3.png" />
            </div>
          </center>
        </div>
        <center>
          <div>
            <p className="title">Why Choose Us</p>
            <div className="card_container">
              <div>
                <p>
                  Simple Shopping <i className="bi bi-basket"></i>{" "}
                </p>{" "}
                <br />
                <img src="AboutUsSlideImages\pic4.png" />
              </div>
            </div>
            <div className="card_container">
              <div>
                <p>
                  Fast & Easy Checkout <i className="bi bi-lightning"></i>{" "}
                </p>{" "}
                <br />
                <img src="AboutUsSlideImages\pic5.png" />
              </div>
            </div>
            <div className="card_container">
              <div>
                <p>
                  Accessible Anywhere{" "}
                  <i className="bi bi-globe-europe-africa-fill"></i>{" "}
                </p>{" "}
                <br />
                <img src="AboutUsSlideImages\pic6.png" />
              </div>
            </div>
          </div>
        </center>
      </Slider>
    </div>
  );
}

export default AutoPlay;
