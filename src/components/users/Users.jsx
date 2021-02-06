import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Users.scss';
import axios from 'axios';
import User from './User';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
const apiUsers = 'https://dashboardapino1.azurewebsites.net/user';

function Users(props) {
    const [modalWindow, setModalWindow] = useState(window.innerWidth);
    const customStyles = {
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
    const { handleSubmit, register, errors, watch, clearError } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    const [isLoaded, setIsLoaded] = useState(false);
    const onSubmit = values => {
        const submitUser = async () => {
            await axios
                .post(apiUsers + '/register', values, {
                    headers: {
                        Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                    }
                })
                .then(() => {
                    reloadUsers();
                    setIsOpen(false);
                })
                .catch(error => {
                    setSubmitError(error.response.data);
                    IsAuthorized(error.response.status);
                });
        };
        submitUser();
    };

    var subtitle;
    const X = 34;
    const [submitError, setSubmitError] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [users, setUsers] = useState([]);
    const [maxStringLengthToDisplayInTable, setMaxStringLengthToDisplayInTable] = useState(Math.round(window.innerWidth / X) < 15 ? 15 : Math.round(window.innerWidth / X));

    useEffect(() => {
        Fetch();
        Modal.setAppElement('html');
    }, []);

    function IsAuthorized(status) {
        if (status === 401) {
            localStorage.clear();
            props.setName(null);
            props.setSurname(null);
            history.push('/login');
        }
    }

    function Fetch() {
        axios
            .get(apiUsers, {
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
            .then(res => {
                setUsers(res.data);
                setIsLoaded(true);
            })
            .catch(err => {
                setIsLoaded(false);
                IsAuthorized(err.response.status);
            });
    }

    const reloadUsers = () => {
        Fetch();
    };

    const openModal = event => {
        setIsOpen(true);
        event.preventDefault();
        setSubmitError('');
    };
    function AfterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '$main-blue';
    }
    function CloseModal() {
        setIsOpen(false);
        setSubmitError('');
    }

    window.onresize = function ResizeApp() {
        setMaxStringLengthToDisplayInTable(Math.round(window.innerWidth / X) < 15 ? 15 : Math.round(window.innerWidth / X));
        setModalWindow(window.innerWidth);
    };

    function ReturnModalWidth() {
        if (modalWindow > 768) {
            return '768px';
        }
        return '100%';
    }

    if (isLoaded) {
        return (
            <div className="portalsList">
                <div className="addButton d-flex justify-content-between">
                    <h1>Users</h1>
                    <button className="festo-button" type="button" onClick={openModal}>
                        Add new user
                    </button>
                </div>
                <div className="table-responsive">
                    <table>
                        <colgroup>
                            <col className="number-collumn" />
                            <col className="first-collumn" />
                            <col className="second-collumn" />
                            <col className="third-collumn" />
                            <col className="fourth-collumn" />
                            <col className="fifth-collumn" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="text-center">No. </th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Surname</th>
                                <th className="text-center">Active</th>
                                <th className="text-center text-break">Maintenance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <User
                                    key={user.userId}
                                    reload={reloadUsers}
                                    id={user.userId}
                                    email={user.email}
                                    name={user.name}
                                    surname={user.surname}
                                    isActive={user.isActive}
                                    ReturnModalWidth={ReturnModalWidth()} //sending modal width to user component
                                    number={index + 1}
                                    IsAuthorized={IsAuthorized}
                                    Name={props.setName} //jei updateinam usri uzsetina varda App.jsx
                                    Surname={props.setSurname} //jei updateinam usri uzsetina pavrde App.jsx
                                    maxStringLengthToDisplayInTable={maxStringLengthToDisplayInTable}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                <Modal isOpen={modalIsOpen} onAfterOpen={AfterOpenModal} onRequestClose={CloseModal} style={customStyles} portalClassName="edit-modal">
                    <div className="pb-3">
                        <h4 ref={_subtitle => (subtitle = _subtitle)}>Add new user</h4>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="userform">
                        <div className="edit-line mt-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={() => {
                                    clearError('email');
                                    setSubmitError('');
                                }}
                                ref={register({
                                    required: 'Enter an email',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i,
                                        message: 'Invalid email address format'
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
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                onChange={() => {
                                    clearError('name');
                                }}
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
                                        value: /^[a-zA-Z0-9]+ ?[a-zA-Z0-9]+$/i,
                                        message: 'Only latin letters and numbers'
                                    }
                                })}
                            />
                        </div>
                        <p className="text-danger warning-text">{errors.name && errors.name.message}</p>

                        <div className="edit-line mt-4">
                            <label htmlFor="surname">Surname</label>
                            <input
                                type="text"
                                name="surname"
                                id="surname"
                                onChange={() => {
                                    clearError('surname');
                                }}
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
                                        value: /^[a-zA-Z0-9]+ ?[a-zA-Z0-9]+$/i,
                                        message: 'Only latin letters and numbers'
                                    }
                                })}
                            />
                        </div>
                        <p className="text-danger warning-text">{errors.surname && errors.surname.message}</p>

                        <div className="edit-line edit-line__small mt-4">
                            <label htmlFor="isactive">Is active?</label>
                            <input className="checkbox-input" type="checkbox" name="isactive" id="isactive" ref={register} />
                        </div>

                        <div className="edit-line mt-4">
                            <label htmlFor="password0" className="d-block">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password0"
                                id="password0"
                                autocomplete="off"
                                onChange={() => {
                                    clearError('password');
                                    setPasswordError('');
                                }}
                                ref={register({
                                    required: true,
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
                            <label htmlFor="password">Repeat password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={() => {
                                    clearError('password');
                                    setPasswordError('');
                                }}
                                autocomplete="off"
                                ref={register({
                                    required: 'Enter password',
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
                                            setPasswordError('Password doesnt match');
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
                            <button className="festo-button" onClick={CloseModal}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
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

export default Users;
