import { useHistory, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import decode from 'jwt-decode'
import './PortalsList.scss';

import Row from './Row';
import Form from './Form';

const X = 41;
const getAllListAPI = 'https://dashboardapino1.azurewebsites.net/api/portals/';

function PortalsList(props) {
    const [modalWindow, setModalWindow] = useState(window.innerWidth); //prasom netrinti modalo plociam ant mobilaus
    const formModalStyle = {
        content: {
            top: '10%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, 0)',
            minWidth: ReturnModalWidth(),
            width: '80%',
            maxHeight: '80%',
            height: 'auto',
            overlfow: 'scroll'
        }
    };
    const history = useHistory();
    const [portals, setPortals] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [maxStringLengthToDisplayInTable, setMaxStringLengthToDisplayInTable] = useState(Math.round(window.innerWidth / X) < 15 ? 15 : Math.round(window.innerWidth / X));

    useEffect(() => {
        FecthList();
    }, []);

    function FecthList() {
        axios
            .get(getAllListAPI, {
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
            .then(resp => {
                setPortals(resp.data);
                setIsLoaded(true);                
                let decoded = decode('Bearer '.concat(localStorage.getItem('token')));
               // console.log(decoded);
               // console.log(ToDateTime(decoded.nbf))
               // console.log(ToDateTime(decoded.exp))
               // console.log(Math.round(Date.now() / 1000));                                
            })
            .catch(error => {
                IsAuthorized(error.response.status);
            });
    }

    const OpenAddModal = event => {
        setAddModalIsOpen(true);
    };

    const CloseAddModal = event => {
        setAddModalIsOpen(false);
    };

    function RenewJWT() {

    }

    function ToDateTime(secs) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
    }

    function IsAuthorized(status) {
        if (status === 401) {
            localStorage.clear();
            props.setName(null);
            props.setSurname(null);
            history.push('/login');
        }
    }

    function ReturnModalWidth() {
        if (modalWindow > 768) {
            return '768px';
        }
        return '100%';
    }

    window.onresize = function ResizeApp() {
        setMaxStringLengthToDisplayInTable(Math.round(window.innerWidth / X) < 15 ? 15 : Math.round(window.innerWidth / X));
        setModalWindow(window.innerWidth); //del modalu plocio
    };

    function parseJwt(token) {
        try {
          // Get Token Header
          const base64HeaderUrl = token.split('.')[0];
          const base64Header = base64HeaderUrl.replace('-', '+').replace('_', '/');
          const headerData = JSON.parse(window.atob(base64Header));
      
          // Get Token payload and date's
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const dataJWT = JSON.parse(window.atob(base64));
          dataJWT.header = headerData;
      
      // TODO: add expiration at check ...
      
      
          return dataJWT;
        } catch (err) {
          return false;
        }
      }

    if (isLoaded)
        return (
            <div className="portals-list">
                <h1 className="title">Maintaining list</h1>
                <div className="addButton text-right">
                    <button className="festo-button" onClick={OpenAddModal}>
                        Add New Portal
                    </button>
                    <Link to="/deleted_portals">
                        <button className="festo-button">Recycle bin</button>
                    </Link>
                </div>
                <div className="table-responsive table-width festo-table">
                    <table>
                        <colgroup>
                            <col className="number-collumn" />
                            <col className="service-name-collumn" />
                            <col className="type-collumn" />
                            <col className="url-collumn" />
                            <col className="active-collumn" />
                            <col className="email-collumn" />
                            <col className="check-collumn" />
                            <col className="threshold-collumn" />
                            <col className="maintenance-collumn" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-center">No.</th>
                                <th className="text-center">Service name</th>
                                <th className="text-center">Type</th>
                                <th className="text-center">URL</th>
                                <th className="text-center">Active</th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Check (s)</th>
                                <th className="text-center">Threshold (ms)</th>
                                <th className="text-center">Maintenance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portals.map((portal, index) => (
                                <Row
                                    key={portal.id}
                                    id={portal.id}
                                    name={portal.name}
                                    type={portal.type}
                                    url={portal.url}
                                    isActive={portal.isActive}
                                    email={portal.email}
                                    checkInterval={portal.checkInterval}
                                    responseTreshold={portal.responseTimeThreshold}
                                    fetchList={FecthList}
                                    maxStringLengthToDisplayInTable={maxStringLengthToDisplayInTable}
                                    ReturnModalWidth={ReturnModalWidth()}
                                    IsAuthorized={IsAuthorized}
                                    number={index + 1}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal ariaHideApp={false} contentLabel="Edit modal" isOpen={addModalIsOpen} style={formModalStyle} portalClassName="font-modal">
                    <Form closeEditModal={CloseAddModal} formAction={'Add New Service'} fetchList={FecthList} type={0} />
                </Modal>
            </div>
        );
    return (
        <div className="d-flex align-items-center justify-content-center rotation-bar">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default PortalsList;
