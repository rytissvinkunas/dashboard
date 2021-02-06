import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import './User.scss';

const apiUsers = 'https://dashboardapino1.azurewebsites.net/user';

function User(props) {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            minWidth: props.ReturnModalWidth,
            width: '40%',
            maxHeight: '85%',
            height: 'auto',
            overlfow: 'scroll'
        }
    };
    var subtitle;
    const [submitError, setSubmitError] = useState('');
    const [active, setActive] = useState(props.isActive);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [formModalIsOpen, formSetIsOpen] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const { handleSubmit, register, errors, watch, clearError } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    const maxStringLengthToDisplayInTable = props.maxStringLengthToDisplayInTable;
    const surnameTooltip = 'surname' + props.number;
    const nameTooltip = 'name' + props.number;
    const emailTooltip = 'email' + props.number;

    useEffect(() => {
        setActive(props.isActive);
        setSubmitError('');
        Modal.setAppElement('body');
    }, [props]);

    const onSubmit = values => {
        values.userid = parseInt(props.id);
        if (values.password.length === 0) values.password = null;
        const submitUser = async () => {
            await axios
                .post(apiUsers + '/update', values, {
                    headers: {
                        Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                    }
                })
                .then(() => {
                    props.reload();
                    formSetIsOpen(false);
                })
                .catch(error => {
                    setSubmitError(error.response.data);
                    props.IsAuthorized(error.response.status);
                });
        };
        submitUser();
    };

    const openModal = event => {
        setIsOpen(true);
        event.preventDefault();
    };
    function AfterOpenModal() {
        subtitle.style.color = '$main-blue';
    }
    function CloseModal() {
        setIsOpen(false);
        setSubmitError('');
    }

    const formOpenModal = event => {
        formSetIsOpen(true);
        event.preventDefault();
    };
    function FormAfterOpenModal() {
        subtitle.style.color = '$main-blue';
    }
    function FormCloseModal() {
        formSetIsOpen(false);
        setSubmitError('');
    }

    function DeleteUser() {
        const del = async () => {
            axios
                .delete('https://dashboardapino1.azurewebsites.net/user/' + props.id, {
                    headers: {
                        Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                    }
                })
                .then(props.reload)
                .catch(err => {
                    //setIsLoaded(false)
                    props.IsAuthorized(err.response.status);
                });
        };
        del();
        CloseModal();
    }

    function HandleCheckboxChange() {
        const postActive = async () => {
            axios({
                method: 'post',
                url: 'https://dashboardapino1.azurewebsites.net/user/toggleactive',
                data: props.id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            }).catch(err => {
                props.IsAuthorized(err.response.status);
            });
        };
        postActive();
        setActive(!active);
    }

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
        <tr>
            <td>{props.number}</td>

            <td data-tip="" data-type="warning" data-for={emailTooltip}>
                {MakeShorterName(props.email)}
                <ReactTooltip id={emailTooltip} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={props.email.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                    {AddLineBrakesInWord(props.email)}
                </ReactTooltip>
            </td>

            <td data-tip="" data-type="warning" data-for={nameTooltip}>
                {MakeShorterName(props.name)}
                <ReactTooltip id={nameTooltip} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={props.name.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                    {AddLineBrakesInWord(props.name)}
                </ReactTooltip>
            </td>

            <td data-tip="" data-type="warning" data-for={surnameTooltip}>
                {MakeShorterName(props.surname)}
                <ReactTooltip id={surnameTooltip} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={props.surname.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                    {AddLineBrakesInWord(props.surname)}
                </ReactTooltip>
            </td>

            <td className="text-center">
                <input type="checkbox" checked={active} onChange={HandleCheckboxChange} />
            </td>
            <td className="text-center">
                <button type="button" onClick={formOpenModal} className="festo-button" id="edit-user">
                    edit
                </button>
                <button className="festo-button festo-button-danger" type="button" onClick={openModal} id="delete-user">
                    delete
                </button>
            </td>
            <Modal isOpen={modalIsOpen} onAfterOpen={AfterOpenModal} onRequestClose={CloseModal} style={customStyles} portalClassName="delete-modal" contentLabel="Delete modal">
                <h4 ref={_subtitle => (subtitle = _subtitle)} className="text-break">
                    Are you sure you want to delete <strong>{props.email}</strong> user?
                </h4>
                <div className="text-right">
                    <button className="festo-button festo-button-danger" onClick={DeleteUser} id="delete-user">
                        Delete
                    </button>
                    <button className="festo-button" onClick={CloseModal} id="delete-user-cancel">
                        Cancel{' '}
                    </button>
                </div>
            </Modal>
            <Modal isOpen={formModalIsOpen} onAfterOpen={FormAfterOpenModal} onRequestClose={FormCloseModal} style={customStyles} portalClassName="edit-modal" contentLabel="Edit modal">
                <div>
                    <h4 ref={_subtitle => (subtitle = _subtitle)}>Edit user: </h4>
                    <h4 className="text-break">
                        <strong>{props.email}</strong>
                    </h4>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="userform">
                    <input type="text" name="userid" id="userid" readOnly value={parseInt(props.id)} hidden ref={register} />

                    <div className="edit-line mt-4">
                        <label className="" htmlFor="email">
                            Email{' '}
                        </label>
                        <input
                            className=""
                            type="text"
                            name="email"
                            id="email"
                            onChange={() => {
                                clearError('email');
                                setSubmitError('');
                            }}
                            defaultValue={props.email}
                            ref={register({
                                required: 'Enter an email',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i,
                                    message: 'Invalid email address'
                                },
                                minLength: {
                                    value: 2,
                                    message: 'Minimum 2 symbols'
                                },
                                maxLength: {
                                    value: 100,
                                    message: 'Maximum 100 symbols'
                                }
                            })}
                        />
                    </div>
                    {errors.email && <p className="text-danger warning-text">{errors.email.message}</p>}
                    <p className="text-danger warning-text">{submitError}</p>
                    <div className="edit-line mt-4">
                        <label className="" htmlFor="name">
                            Name
                        </label>
                        <input
                            className=""
                            type="text"
                            name="name"
                            id="name"
                            onChange={() => {
                                clearError('name');
                            }}
                            defaultValue={props.name}
                            ref={register({
                                required: 'Enter first name',
                                minLength: {
                                    value: 2,
                                    message: 'Minimum 2 symbols'
                                },
                                maxLength: {
                                    value: 60,
                                    message: 'Maximum 60 symbols'
                                },
                                pattern: {
                                    // value: /^[a-zA-Z0-9\s]+[^!@#$%^&`~*(){};|<>,.:'\"?/ąčęėįšųūžĄČĘĖĮŠŲŪŽ]+$/i,
                                    value: /^[a-zA-Z]+ ?[a-zA-Z]+$/i,
                                    message: 'Only latin letters'
                                }
                            })}
                        />
                    </div>
                    <p className="text-danger warning-text">{errors.name && errors.name.message}</p>

                    <div className="edit-line mt-4">
                        <label className="" htmlFor="surname">
                            Surname
                        </label>
                        <input
                            className=""
                            type="text"
                            name="surname"
                            id="surname"
                            onChange={() => {
                                clearError('surname');
                            }}
                            defaultValue={props.surname}
                            ref={register({
                                required: 'Enter last name',
                                minLength: {
                                    value: 2,
                                    message: 'Minimum 2 symbols'
                                },
                                maxLength: {
                                    value: 60,
                                    message: 'Maximum 60 symbols'
                                },
                                pattern: {
                                    // value: /^[a-zA-Z0-9\s]+[^!@#$%^&`~*(){};|<>,.:'\"?/ąčęėįšųūžĄČĘĖĮŠŲŪŽ]+$/i,
                                    value: /^[a-zA-Z]+ ?[a-zA-Z]+$/i,
                                    message: 'Only latin letters'
                                }
                            })}
                        />
                    </div>
                    <p className="text-danger warning-text">{errors.surname && errors.surname.message}</p>

                    <div className=" edit-line edit-line__small mt-4">
                        <label className="" htmlFor="isactive">
                            Is active?
                        </label>
                        <input className="checkbox-input" type="checkbox" name="isactive" id="isactive" defaultChecked={active} ref={register} />
                    </div>

                    <div className="edit-line mt-4">
                        <label className="" htmlFor="password0">
                            Password
                        </label>
                        <input
                            className=""
                            type="password"
                            name="password0"
                            id="password0"
                            autocomplete="off"
                            onChange={() => {
                                clearError('password');
                                setPasswordError('');
                            }}
                            ref={register({
                                minLength: 6,
                                validate: value => {
                                    if (value === watch('password')) {
                                        setPasswordError('');
                                        return true;
                                    }
                                }
                            })}
                        />
                    </div>

                    <div className="edit-line mt-4">
                        <label className="text-nowrap" htmlFor="password">
                            Repeat password
                        </label>
                        <input
                            className=""
                            type="password"
                            name="password"
                            id="password"
                            onChange={() => {
                                clearError('password');
                                setPasswordError('');
                            }}
                            autocomplete="off"
                            ref={register({
                                //required: "Enter password",
                                minLength: {
                                    value: 6,
                                    message: 'Minimum 6 symbols'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Maximum 20 symbols'
                                },
                                pattern: {
                                    //value: /^[a-zA-Z0-9@#$%]+$/i,
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
                                    message: 'Only latin letters, at least one uppercase letter, one lowercase letter, one number and one special character'
                                },
                                validate: value => {
                                    if (value === watch('password0')) {
                                        setPasswordError('');
                                        return true;
                                    }
                                    if (value !== watch('password0')) {
                                        setPasswordError("Password doesn't match");
                                        return false;
                                    }
                                }
                            })}
                        />
                    </div>
                    <p className="text-danger warning-text">
                        <span>{errors.password && errors.password.message}</span>
                        <span>{passwordError}</span>
                    </p>

                    <div className="text-right">
                        <button className="festo-button" type="submit">
                            OK
                        </button>
                        <button className="festo-button" onClick={FormCloseModal}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </tr>
    );
}

export default User;
