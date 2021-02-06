import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import Modal from 'react-modal';

import Form from './Form';

const permanentlyDeletePortalAPI = 'https://dashboardapino1.azurewebsites.net/api/Portals/DeleteById/'; // DELETE {id}
const restoreAPI = 'https://dashboardapino1.azurewebsites.net/api/Portals/Restore/'; // PATCH {id}

function Row(props) {
    const deleteModalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            minWidth: props.ReturnModalWidth,
            width: '40%',
            maxHeight: '80%',
            height: 'auto',
            overlfow: 'scroll'
        }
    };
    const formModalStyle = {
        content: {
            top: '10%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, 0)',
            minWidth: props.ReturnModalWidth,
            width: '80%',
            maxHeight: '80%',
            height: 'auto',
            overlfow: 'scroll'
        }
    };

    const [row, setRow] = useState(props);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const maxStringLengthToDisplayInTable = props.maxStringLengthToDisplayInTable;

    const urlTooltip = 'url' + props.number;
    const nameTooltip = 'name' + props.name;
    const emailTooltip = 'email' + props.email;

    useEffect(() => {
        setRow(props);
    }, [props]);

    function ServiceType(type) {
        if (type === 0) return 'Web app';
        else if (type === 1) return 'Service-REST';
        return 'Service-SOAP';
    }

    function PermanentlyDeletePortal() {
        const permanentlyDeletePortal = async () => {
            axios({
                method: 'delete',
                url: permanentlyDeletePortalAPI + props.id,
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
                .then(resp => {
                    setDeleteModalIsOpen(false);
                    row.fetchList();
                })
                .catch(error => {
                    props.IsAuthorized(error.response.status);
                });
        };
        permanentlyDeletePortal();
    }

    function RestorePortal() {
        const restorePortal = async () => {
            axios({
                method: 'patch',
                url: restoreAPI + row.id,
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
                .then(resp => {
                    props.fetchList();
                })
                .catch(error => {
                    props.IsAuthorized(error.response.status);
                });
        };
        restorePortal();
    }

    const OpenDeleteModal = event => {
        setDeleteModalIsOpen(true);
    };

    const CloseDeleteModal = event => {
        setDeleteModalIsOpen(false);
    };

    const OpenPropertiesModal = event => {
        setEditModalIsOpen(true);
    };

    const ClosePropertiesModal = event => {
        setEditModalIsOpen(false);
        row.fetchList();
    };

    function MakeShorterName(name) {
        return name.length <= maxStringLengthToDisplayInTable ? name : String(name).substring(0, maxStringLengthToDisplayInTable) + '...';
    }

    function AddLineBrakesInWord(word) {
        let newWord = '';
        let breaker = 30;
        for (let i = 0; i <= Math.round(word.length / breaker); i++) newWord = newWord + word.slice(i * breaker, i * breaker + breaker) + '<br />';
        return newWord.slice(0, newWord.length - 6);
    }

    return (
        <tr onDoubleClick={OpenPropertiesModal}>
            <td>{row.number}</td>

            <td data-tip="" data-type="warning" data-for={nameTooltip}>
                {MakeShorterName(row.name)}
                <ReactTooltip id={nameTooltip} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={row.name.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                    {AddLineBrakesInWord(row.name)}
                </ReactTooltip>
            </td>

            <td className="text-truncate">{ServiceType(row.type)}</td>

            <td data-tip="" data-type="warning" data-for={urlTooltip}>
                {MakeShorterName(row.url)}
                <ReactTooltip id={urlTooltip} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={row.url.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                    {AddLineBrakesInWord(row.url)}
                </ReactTooltip>
            </td>

            <td data-tip="" data-type="warning" data-for={emailTooltip}>
                {MakeShorterName(row.email)}
                <ReactTooltip id={emailTooltip} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={row.email.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                    {AddLineBrakesInWord(row.email)}
                </ReactTooltip>
            </td>

            <td>{row.checkInterval}</td>

            <td>{row.responseTreshold}</td>

            <td className="row-button text-center">
                <button className="festo-button" onClick={OpenPropertiesModal} id="properties-portal">
                    Properties
                </button>
                <button className="festo-button" onClick={RestorePortal} id="restore-portal">
                    Restore
                </button>
                <button className="festo-button festo-button-danger" onClick={OpenDeleteModal} id="delete-portal">
                    Delete
                </button>
            </td>

            <Modal
                ariaHideApp={false}
                contentLabel="Delete modal"
                isOpen={deleteModalIsOpen}
                style={deleteModalStyle}
                portalClassName="delete-modal" //taking CSS class to modal
            >
                <h4>
                    Are you sure you want to permanently <strong>{row.name}</strong> portal?
                </h4>
                <div className="text-right">
                    <button className="festo-button festo-button-danger" onClick={PermanentlyDeletePortal} id="delete-portals">
                        Permanently Delete
                    </button>
                    <button className="festo-button" onClick={CloseDeleteModal} id="delete-portal-cancel">
                        Cancel
                    </button>
                </div>
            </Modal>

            <Modal ariaHideApp={false} contentLabel="Edit modal" isOpen={editModalIsOpen} portalClassName="font-modal" style={formModalStyle}>
                <Form closeEditModal={ClosePropertiesModal} fetchList={props.fetchList} id={row.id} isActive={row.isActive} type={row.type} IsAuthorized={props.IsAuthorized} />
            </Modal>
        </tr>
    );
}
export default Row;
