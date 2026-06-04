import './Footer.css';

function Footer (){
    return(
        <div id="footer_container">
            <div id="footer_info_container">
                <div className="logo_container" >
                    <img src="public\footer_logo.png" alt="Logo" />
                    <p>QuickCart</p> 
                </div>
                <div className="media_container" >
                    <p> <i className="bi bi-facebook"></i> QuickCart</p>
                    <p> <i className="bi bi-instagram"></i> @QuickCart </p>
                    <p><i className="bi bi-twitter-x"></i> @Quick_Cart </p>
                </div>
                <div className="contact_container" >
                    <p> <i className="bi bi-geo-alt"></i>Rue idkYet, Ben Arous</p>
                    <p> <i className="bi bi-telephone"></i> +216 50 025 334</p>
                    <p> <i className="bi bi-envelope"></i> quickcart@quickcart.com</p>
                </div>
            </div>
            <div id="copyright_container">&copy; 2025 QuickCart. All rights reserved</div>
        </div>
    )
}

export default Footer;