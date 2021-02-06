import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import Modal from 'react-modal';

import Form from './Form';

const updateAPI = 'https://dashboardapino1.azurewebsites.net/api/portals/'; // PUT
const deleteAPI = 'https://dashboardapino1.azurewebsites.net/api/portals/'; // DELETE

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
    const [check, setCheck] = useState(props.isActive);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const maxStringLengthToDisplayInTable = props.maxStringLengthToDisplayInTable;

    const OpenDeleteModal = event => {
        setDeleteModalIsOpen(true);
    };

    const CloseDeleteModal = event => {
        setDeleteModalIsOpen(false);
    };

    const OpenEditModal = event => {
        setEditModalIsOpen(true);
    };

    const CloseEditModal = event => {
        setEditModalIsOpen(false);
        row.fetchList();
    };

    const urlTooltip = 'url' + props.number;
    const nameTooltip = 'name' + props.number;
    const emailTooltip = 'email' + props.number;

    useEffect(() => {
        setRow(props);
        setCheck(props.isActive);
    }, [props]);

    function ServiceType(type) {
        if (type === 0) return 'Web app';
        else if (type === 1) return 'Service-REST';
        return 'Service-SOAP';
    }

    function ChangeActivityStatus() {
        const changeActivityStatus = async () => {
            axios({
                method: 'patch',
                url: updateAPI + row.id,
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
                .then(resp => {
                    setCheck(!check);
                })
                .catch(error => {
                    console.log(error);
                    props.IsAuthorized(error.response.status);
                });
        };
        changeActivityStatus();
    }

    function DeletePortal() {
        const deletePortal = async () => {
            await axios({
                method: 'delete',
                url: deleteAPI + row.id,
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
                .then(resp => {
                    setDeleteModalIsOpen(false);
                    row.fetchList();
                })
                .catch(error => {
                    console.log(error.response);
                    props.IsAuthorized(error.response.status);
                });
        };
        deletePortal();
    }

    function MakeShorterName(name) {
        return name.length <= maxStringLengthToDisplayInTable ? name : String(name).substring(0, maxStringLengthToDisplayInTable) + '...';
    }

    function AddLineBrakesInWord(word) {
        let newWord = '';
        let breaker = 30;
        for (let i = 0; i <= Math.round(word.length / breaker); i++)
            newWord = newWord + word.slice(i * breaker, i * breaker + breaker) + '<br />';
        return newWord.slice(0, newWord.length - 6);
    }

    return (
        <tr onDoubleClick={OpenEditModal}>
            <td>{row.number}</td>

            <td data-tip="" 
                data-type="warning" 
                data-for={nameTooltip}
            >
                {MakeShorterName(row.name)}
                <ReactTooltip 
                    id={nameTooltip} 
                    className="festo-tooltip" 
                    arrowColor="#0091dc" 
                    effect="float" 
                    disable={row.name.length > maxStringLengthToDisplayInTable ? false : true} 
                    multiline={true} 
                    html={true} 
                    isCapture={true}
                >
                    {AddLineBrakesInWord(row.name)}
                </ReactTooltip>
            </td>

            <td className="text-truncate">{ServiceType(row.type)}</td>

            <td 
                data-tip="" 
                data-type="warning" 
                data-for={urlTooltip}
            >
                {MakeShorterName(row.url)}
                <ReactTooltip 
                    id={urlTooltip} 
                    className="festo-tooltip" 
                    arrowColor="#0091dc" 
                    effect="float" 
                    disable={row.url.length > maxStringLengthToDisplayInTable ? false : true} 
                    multiline={true} 
                    html={true} 
                    isCapture={true}
                >
                    {AddLineBrakesInWord(row.url)}
                </ReactTooltip>
            </td>

            <td className="text-center" onClick={ChangeActivityStatus}>
                <input type="checkbox" checked={check} onChange={ChangeActivityStatus} />
            </td>

            <td 
                data-tip="" 
                data-type="warning" 
                data-for={emailTooltip}
            >
                {MakeShorterName(row.email)}
                <ReactTooltip 
                    id={emailTooltip} 
                    className="festo-tooltip" 
                    arrowColor="#0091dc" 
                    effect="float" 
                    disable={row.email.length > maxStringLengthToDisplayInTable ? false : true} 
                    multiline={true} 
                    html={true} 
                    isCapture={true}
                >
                    {AddLineBrakesInWord(row.email)}
                </ReactTooltip>
            </td>

            <td>{row.checkInterval}</td>

            <td>{row.responseTreshold}</td>

            <td className="row-button text-center">
                <button className="festo-button" onClick={OpenEditModal} id="edit-portal">
                    Edit
                </button>
                <button className="festo-button festo-button-danger" onClick={OpenDeleteModal} id="delete-portal">
                    Delete
                </button>
            </td>

            <Modal ariaHideApp={false} contentLabel="Delete modal" isOpen={deleteModalIsOpen} style={deleteModalStyle} portalClassName="delete-modal">
                <h4>
                    Are you sure you want to delete{' '}
                    <span>
                        <strong>{row.name}</strong>
                    </span>{' '}
                    service?
                </h4>
                <div className="text-right">
                    <button className="festo-button festo-button-danger" onClick={DeletePortal} id="delete-portal">
                        Delete
                    </button>
                    <button className="festo-button" onClick={CloseDeleteModal} id="delete-portal-cancel">
                        Cancel
                    </button>
                </div>
            </Modal>

            <Modal ariaHideApp={false} contentLabel="Edit modal" isOpen={editModalIsOpen} portalClassName="font-modal" style={formModalStyle}>
                <Form closeEditModal={CloseEditModal} fetchList={props.fetchList} formAction={'Edit Service'} id={row.id} isActive={row.isActive} type={row.type} ReturnModalWidth={props.ReturnModalWidth} IsAuthorized={props.IsAuthorized} />
            </Modal>
        </tr>
    );
}
export default Row;
