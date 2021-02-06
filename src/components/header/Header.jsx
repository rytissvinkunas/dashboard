import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../nav/Nav';
import logo from '../../assets/logos/logo_blue.svg';
import './Header.scss';

function Header(props) {
    return (
        <header className="row header fixed-top">
            <div className="col align-self-center">
                <div className="container">
                    <div className="row text-center">
                        <div className="col text-left align-self-center">
                            <Link to="/">
                                <img src={logo} width="112" height="20" alt="Festo" />
                            </Link>
                        </div>
                        <div className="col align-self-center displayNoneElement992px">
                            <p>Monitoring Dashboard</p>
                        </div>
                        <div className="col align-self-center displayNoneElement992px">
                            {props.name && (
                                <p>
                                    User: {props.name} {props.surname}
                                </p>
                            )}
                        </div>
                        <div className="col-3 col-sm-3 col-md-2 col-lg-1 col-xl-1 align-self-center text-right">{props.name && <Nav name={props.name} surname={props.surname} />}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
