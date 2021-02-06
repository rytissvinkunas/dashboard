import { Link, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import './DeletedPortalsList.scss';
import Row from './Row';

const X = 41;
const getAllDeletedListAPI = 'https://dashboardapino1.azurewebsites.net/api/portals/deletedlist';
const permanentlyDeleteAllAPI = 'https://dashboardapino1.azurewebsites.net/api/Portals/deletedlist'; // DELETE
const restoreAllAPI = 'https://dashboardapino1.azurewebsites.net/api/Portals/Restore'; // PATCH

function DeletedPortalsList(props) {
    const [modalWindow, setModalWindow] = useState(window.innerWidth);
    const modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            minWidth: ReturnModalWidth(),
            width: '40%',
            maxHeight: '80%',
            height: 'auto',
            overlfow: 'scroll'
        }
    };
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    const [permanentlyDeleteAllModalIsOpen, setPermanentlyDeleteAllModalIsOpen] = useState(false);
    const [restoreAllPortalsToMaintainingListModalIsOpen, setRestoreAllPortalsToMaintainingListModalIsOpen] = useState(false);
    const [portals, setPortals] = useState([]);
    const [maxStringLengthToDisplayInTable, setMaxStringLengthToDisplayInTable] = useState(Math.round(window.innerWidth / X) < 15 ? 15 : Math.round(window.innerWidth / X));

    useEffect(() => {
        FecthList();
    }, []);

    function FecthList() {
        axios
            .get(getAllDeletedListAPI, {
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
            .then(resp => {
                setPortals(resp.data);
                setIsLoaded(true);
            })
            .catch(error => {
                IsAuthorized(error.response.status);
            });
    }

    function PermanentlyDeleteAllPortals() {
        const permanentlyDeleteAllPortals = async () => {
            axios({
                method: 'delete',
                url: permanentlyDeleteAllAPI,
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
                .then(resp => {
                    setPermanentlyDeleteAllModalIsOpen(false);
                    FecthList();
                })
                .catch(error => {
                    IsAuthorized(error.response.status);
                });
        };
        permanentlyDeleteAllPortals();
    }

    const openPermanentlyDeleteModal = event => {
        setPermanentlyDeleteAllModalIsOpen(true);
    };

    const closePermanentlyDeleteModal = event => {
        setPermanentlyDeleteAllModalIsOpen(false);
    };

    function RestoreAllDeletedPortals() {
        const restoreAllDeletedPortals = async () => {
            axios({
                method: 'patch',
                url: restoreAllAPI,
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
                .then(resp => {
                    setRestoreAllPortalsToMaintainingListModalIsOpen(false);
                    FecthList();
                })
                .catch(error => {
                    IsAuthorized(error.response.status);
                });
        };
        restoreAllDeletedPortals();
    }

    const openRestoreAllPortalsModal = event => {
        setRestoreAllPortalsToMaintainingListModalIsOpen(true);
    };

    const closeRestoreAllPortalsModal = event => {
        setRestoreAllPortalsToMaintainingListModalIsOpen(false);
    };

    window.onresize = function ResizeApp() {
        setMaxStringLengthToDisplayInTable(Math.round(window.innerWidth / X) < 15 ? 15 : Math.round(window.innerWidth / X));
        setModalWindow(window.innerWidth); //del modalu plocio
    };

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

    if (isLoaded)
        return (
            <div className="deleted-portals-list">
                <h1 className="title">Recycle bin</h1>

                <div className="text-right addButton">
                    <button className="festo-button" onClick={openRestoreAllPortalsModal}>
                        Restore All
                    </button>
                    <button className="festo-button festo-button-danger" onClick={openPermanentlyDeleteModal}>
                        Delete All
                    </button>
                    <Link to="/maintaining_list">
                        <button className="festo-button">Maintaining List</button>
                    </Link>
                </div>

                <div className="table-responsive table-width festo-table">
                    <table>
                        <colgroup>
                            <col className="number-collumn" />
                            <col className="service-name-collumn" />
                            <col className="type-collumn" />
                            <col className="url-collumn" />
                            <col className="email-collumn" />
                            <col className="check-interval-collumn" />
                            <col className="response-time-threshold-collumn" />
                            <col className="maintenance-collumn" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-center">No.</th>
                                <th className="text-center">Service name</th>
                                <th className="text-center">Type</th>
                                <th className="text-center">URL</th>
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
                                    number={index + 1}
                                    IsAuthorized={IsAuthorized}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <Modal
                    ariaHideApp={false}
                    contentLabel="Permanently delete all portals modal"
                    isOpen={permanentlyDeleteAllModalIsOpen}
                    style={modalStyle}
                    portalClassName="delete-modal" //taking CSS class to modal
                >
                    <h4>Are you sure you want to permanently delete all portals?</h4>
                    <div className="text-right">
                        <button className="festo-button festo-button-danger" onClick={PermanentlyDeleteAllPortals}>
                            Permanently Delete
                        </button>
                        <button className="festo-button" onClick={closePermanentlyDeleteModal}>
                            Cancel
                        </button>
                    </div>
                </Modal>

                <Modal
                    ariaHideApp={false}
                    contentLabel="Restore all portals modal"
                    isOpen={restoreAllPortalsToMaintainingListModalIsOpen}
                    style={modalStyle}
                    portalClassName="delete-modal" //taking CSS class to modal
                >
                    <h4>Are you sure you want to restore all portals?</h4>
                    <div className="text-right">
                        <button className="festo-button" onClick={RestoreAllDeletedPortals}>
                            Restore
                        </button>
                        <button className="festo-button" onClick={closeRestoreAllPortalsModal}>
                            Cancel
                        </button>
                    </div>
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
export default DeletedPortalsList;
