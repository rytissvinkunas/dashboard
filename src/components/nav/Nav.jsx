import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './Nav.scss';

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStore: false,
            clasName: 'dontShow'
        }
    }
    hamburger = () => {
        if (this.state.showStore === true) {
            this.setState({ showStore: false, clasName: 'dontShow' });
        } else {
            this.setState({ showStore: true, clasName: '' });
        }
    }
    pushedButton = () => {
        this.setState({ showStore: false, clasName: 'dontShow' });
    };
    render() {
        let userLink;
        if (this.props.name === null) { userLink = <li><Link to="/login"><button className="buttonDesign" onClick={this.pushedButton}>Login</button></Link></li> }
        else {userLink = <li><Link to="/logout"><button className="buttonDesign" onClick={this.pushedButton}>Logout</button></Link></li>}
        return (
            <React.Fragment>
                <button className="menuIcon" onClick={this.hamburger}>&#9776;</button>
                {/* <div className="d-flex justify-content-end" style={{display: this.state.showStore ? 'block !important' : 'none !important' }}> */}
                <div className={this.state.clasName}>
                    <div className="d-flex justify-content-end " >
                        <ul className="listStyle text-left">
                            <li><Link to="/"><button className="buttonDesign" onClick={this.pushedButton}>Home Page</button></Link></li>
                            <li><Link to="/maintaining_list"><button className="buttonDesign" onClick={this.pushedButton}>Maintaining List</button></Link></li>
                            <li><Link to="/users"><button className="buttonDesign" onClick={this.pushedButton}>Users</button></Link></li>
                            {userLink}
                        </ul>
                    </div>
                </div>
            </React.Fragment>

        );
    }
}

export default Nav;