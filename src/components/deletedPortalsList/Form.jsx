import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Form.scss';

const URL = 'https://dashboardapino1.azurewebsites.net/api/portals/'; // GET {id} fetch info by id

function Form(props) {
    const [portal, setPortal] = useState(); // Hook used to store fetched (by ID) portal data which we want to edit
    const [isLoaded, setIsLoaded] = useState(false); // Hook used which shows is data fetched or not
    const [basicAuth, setBasicAuth] = useState(); // Hook used to set Basic Auth. checkbox
    const [method, setMethod] = useState();

    useEffect(() => {
        FetchDataById();
    }, []);

    function FetchDataById() {
        axios
            .get(URL + props.id, {
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
            .then(resp => {
                setPortal(resp.data);
                setMethod(resp.data.method);
                setBasicAuth(resp.data.basicAuth);
                setIsLoaded(true);
            })
            .catch(error => {
                setPortal(error);
                props.IsAuthorized(error.response.status);
            });
    }

    if (isLoaded) {
        return (
            <form className="properties-form">
                <div className="full-row">
                    <label>Service name:</label>
                    <input type="text" defaultValue={portal.name} disabled />
                </div>

                <div className="full-row">
                    <label>Service URL:</label>
                    <input type="text" disabled defaultValue={portal.url} placeholder="http://www.example.com" />
                </div>

                <div className="full-row">
                    <label>Service type:</label>
                    <select defaultValue={portal.type} disabled>
                        <option value={0}>Web app</option>
                        <option value={1}>Service - REST</option>
                        <option value={2}>Service - SOAP</option>
                    </select>
                </div>

                <div className="full-row">
                    <label>Method:</label>
                    <select disabled value={method}>
                        <option value={0}>GET</option>
                        <option value={1}>POST</option>
                    </select>
                </div>

                <div className="checkbox full-row">
                    <label>Basic auth:</label>
                    <input checked={basicAuth} disabled type="checkbox" />
                </div>

                <div className="full-row">
                    <label>User:</label>
                    <input defaultValue={portal.userName} disabled type="text" />
                </div>

                <div className="full-row">
                    <label>Password:</label>
                    <input type="password" defaultValue={portal.passwordHashed} disabled />
                </div>

                <div className="parameters-textArea full-row">
                    <label>Parameters:</label>
                    <textarea defaultValue={portal.callParameters} disabled></textarea>
                </div>

                <div className="full-row">
                    <label>Email to notify:</label>
                    <input disabled type="email" defaultValue={portal.email} />
                </div>

                <div className="full-row">
                    <label>Check interval (s): </label>
                    <input disabled type="number" step="1" defaultValue={portal.checkInterval} />
                </div>

                <div className="full-row">
                    <label>Response threshold time (ms): </label>
                    <input disabled type="number" step="1" defaultValue={portal.responseTimeThreshold} />
                </div>

                <div className="checkbox full-row">
                    <label>Active:</label>
                    <input disabled type="checkbox" checked={props.isActive} />
                </div>

                <div className="form-button text-right full-row margin-on-small-screens">
                    <button
                        className="festo-button"
                        type="button"
                        onClick={props.closeEditModal} //form -> form
                    >
                        Close
                    </button>
                </div>
            </form>
        );
    }
    return (
        <div className="d-flex align-items-center justify-content-center rotation-bar">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Form;
