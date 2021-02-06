import React from "react";
import "./Footer.scss";

function Footer(props) {
    function Years() {
        let date = new Date();
        let year = date.getFullYear();
        return year;
    }

    return (
        <footer className="row footer fixed-bottom">
            <div className="col align-self-center">
                <div className="container">
                    <div className="row">
                        <div className="col text-right align-self-center">
                            <p>
                                © {Years()} Festo Corporation. All Rights
                                Reserved
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
