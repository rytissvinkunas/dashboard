import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';

import './Form.scss';

const api = 'https://dashboardapino1.azurewebsites.net/api/';
const postPortal = 'QueryPortal/queryportal';
const URL = 'https://dashboardapino1.azurewebsites.net/api/portals/'; // GET {id} fetch info by id
const editAPI = 'https://dashboardapino1.azurewebsites.net/api/portals/'; // PUT {id}
const addAPI = 'https://dashboardapino1.azurewebsites.net/api/portals/'; // POST

function Form(props) {
    const testModalStyle = {
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
    const [portal, setPortal] = useState();
    const [isLoaded, setIsLoaded] = useState(props.formAction === 'Edit Service' ? false : true);
    const [basicAuth, setBasicAuth] = useState();
    const [disbaledBasicAuthCheckbox, setDisbaledBasicAuthCheckbox] = useState(props.type == 0 ? true : false);
    const [active, setActive] = useState(props.isActive);
    const { handleSubmit, register, errors, clearError } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    const [disabledMethod, setDisabledMethod] = useState(props.type == 0 || props.type == 2 ? true : false);
    const [disabledParameters, setDisabledParameters] = useState(props.type == 0 ? true : false);
    const [method, setMethod] = useState();
    const [testData, setTestData] = useState(null);
    const [testModalIsOpen, setTestModalIsOpen] = useState(false);
    //error hooks
    const [callParametersError, setCallParametersError] = useState();
    const [UrlError, setUrlError] = useState();
    const [userNameError, setUserNameError] = useState();

    useEffect(() => {
        if (props.formAction === 'Edit Service') FetchDataById();
    }, []);

    const onSubmit = values => {
        values = FixValues(values);
        const editPortalData = async () => {
            values.id = portal.id;
            await axios
                .put(editAPI + props.id, values, {
                    headers: {
                        Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                    }
                })
                .then(resp => {
                    props.closeEditModal();
                })
                .catch(error => {
                    props.IsAuthorized(error.response.status);
                    SetErrorHooks(error.response.data.errors);
                });
        };
        const addPortalData = async () => {
            await axios
                .post(addAPI, values, {
                    headers: {
                        Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                    }
                })
                .then(resp => {
                    props.fetchList();
                    props.closeEditModal();
                })
                .catch(error => {
                    props.IsAuthorized(error.response.status);
                    SetErrorHooks(error.response.data.errors);
                });
        };
        props.formAction === 'Edit Service' ? editPortalData() : addPortalData();
    };

    function SetErrorHooks(errors) {
        setUrlError(errors.URL);
        setUserNameError(errors.UserName);
        setCallParametersError(errors.CallParameters);
    }

    function FixValues(values) {
        values.type = parseInt(values.type);
        values.method = parseInt(values.method);
        values.checkInterval = parseInt(values.checkInterval);
        values.responseTimeThreshold = parseInt(values.responseTimeThreshold);
        if (values.type === 0) {
            values.method = 0;
            values.basicAuth = false;
            values.userName = null;
            values.passwordHashed = null;
            values.callParameters = null;
        }
        return values;
    }

    const testSubmit = values => {
        values.type = parseInt(values.type);
        values.method = parseInt(values.method);
        values.checkInterval = parseInt(values.checkInterval);
        values.responseTimeThreshold = parseInt(values.responseTimeThreshold);
        const testPortal = async () => {
            try {
                await axios //const resp =
                    .post(api + postPortal, values, {
                        headers: {
                            Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                        }
                    })
                    .then(resp => {
                        setTestData(resp.data);
                        setTestModalIsOpen(true);
                    })
                    .catch(error => {
                        props.IsAuthorized(error.response.status);
                        SetErrorHooks(error.response.data.errors);
                    });
            } catch (e) {
                setTestModalIsOpen(true);
            }
        };
        testPortal();
    };

    function closeTestModal() {
        setTestModalIsOpen(false);
        setTestData(null);
    }

    function TestComponent() {
        var comp = [];
        if (testData != null) {
            comp.push(
                <p key={1} className="mb-1">
                    Status code: {testData.status}
                </p>
            );
            comp.push(
                <p key={2} className="mb-1">
                    Response time: {testData.responseTime}ms
                </p>
            );
            if (testData.errorMessage != null)
                comp.push(
                    <p key={3} className="text-break">
                        Error: {testData.errorMessage}
                    </p>
                );
        } else comp.push(<p key={4}>Incorrect input field data or server error</p>);
        return <div className="mb-3">{comp}</div>;
    }

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
                props.IsAuthorized(error.response.status);
                setPortal(error);
            });
    }

    function BasicAuthCheckbox() {
        setBasicAuth(!basicAuth);
    }

    function ActiveCheckbox() {
        setActive(!active);
    }

    function HandleServiceTypeChange(e) {
        if (e.target.value == 0) {
            setMethod(0);
            setDisabledMethod(true);
            setDisabledParameters(true);
            setDisbaledBasicAuthCheckbox(true);
        } else if (e.target.value == 1) {
            setDisabledMethod(false);
            setDisabledParameters(false);
            setMethod(null);
            setDisbaledBasicAuthCheckbox(false);
        } else if (e.target.value == 2) {
            setMethod(1);
            setDisabledMethod(true);
            setDisabledParameters(false);
            setDisbaledBasicAuthCheckbox(false);
        }
    }

    function IsValidJSONString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function HandleMethodChange(e) {
        setMethod(null);
    }

    function ClearAllBackEndErrors() {
        setUrlError(null);
        setUserNameError(null);
        setCallParametersError(null);
    }

    if (isLoaded) {
        return (
            <form className="add-edit-form" onSubmit={handleSubmit(onSubmit)} onChange={ClearAllBackEndErrors}>
                <div className="full-row">
                    <label>Service name:</label>
                    <input
                        type="text"
                        name="name"
                        onChange={() => {
                            clearError('name');
                        }}
                        defaultValue={props.formAction === 'Edit Service' ? portal.name : null}
                        ref={register({
                            required: 'Service name field can not be empty',
                            minLength: {
                                value: 3,
                                message: 'Service name field must be longer than 3 symbols'
                            },
                            maxLength: {
                                value: 60,
                                message: 'Service name field must be shorter than 60 symbols'
                            },
                            pattern: {
                                value: /^[A-Z 0-9-~.,/!@#$%^&*()_+={}:;'"<>?/]+$/i,
                                message: 'Field can contain only latin letters, numbers and some specific symbols'
                            }
                        })}
                    />
                    <p className="text-danger text-center">{errors.name && errors.name.message}</p>
                </div>

                <div className="full-row">
                    <label>Service URL:</label>
                    <input
                        type="text"
                        name="url"
                        onInvalid={'Bad URl'}
                        onChange={() => {
                            clearError('url');
                            setUrlError(null);
                        }}
                        defaultValue={props.formAction === 'Edit Service' ? portal.url : null}
                        placeholder="http://www.example.com"
                        ref={register({
                            required: 'URL field can not be empty',
                            pattern: {
                                value: /^(https?):\/\/[^\s$.?#].[^\s]+$/i,
                                message: 'Bad URL'
                            }
                        })}
                    />
                    <p className="text-danger text-center">{errors.url && errors.url.message}</p>
                    <p className="text-danger text-center">{UrlError}</p>
                </div>

                <div className="full-row">
                    <label>Service type:</label>
                    <select defaultValue={props.formAction === 'Edit Service' ? portal.type : null} name="type" id="type" ref={register} onChange={HandleServiceTypeChange}>
                        <option value={0}>Web app</option>
                        <option value={1}>Service - REST</option>
                        <option value={2}>Service - SOAP</option>
                    </select>
                </div>

                <div className="full-row">
                    <label>Method:</label>
                    <select disabled={disabledMethod} name="method" ref={register} value={method} onChange={HandleMethodChange}>
                        <option value={0}>GET</option>
                        <option value={1}>POST</option>
                    </select>
                </div>

                <div className="checkbox full-row">
                    <label>Basic auth:</label>
                    <input type="checkbox" name="basicAuth" checked={basicAuth} onChange={BasicAuthCheckbox} ref={register} disabled={disbaledBasicAuthCheckbox} />
                </div>

                <div className="full-row">
                    <label>User:</label>
                    <input
                        type="text"
                        name="userName"
                        onChange={() => {
                            clearError('userName');
                            setUserNameError(null);
                        }}
                        disabled={!basicAuth}
                        defaultValue={props.formAction === 'Edit Service' ? portal.userName : null}
                        ref={register({
                            maxLength: {
                                value: 50,
                                message: 'Service name field must be shorter than 50 symbols'
                            },
                            pattern: {
                                value: /^[A-Z0-9 ._]+$/i,
                                message: 'Field can contain only latin letters, numbers and these symbols: ._'
                            }
                        })}
                    />
                    <p className="text-danger text-center">{errors.userName && errors.userName.message}</p>
                    <p className="text-danger text-center">{userNameError}</p>
                </div>

                <div className="full-row">
                    <label>Password:</label>
                    <input type="password" name="passwordHashed" defaultValue={props.formAction === 'Edit Service' ? portal.passwordHashed : null} disabled={!basicAuth} ref={register({})} />
                    <p className="text-danger text-center">{errors.passwordHashed && errors.passwordHashed.message}</p>
                </div>

                <div>
                    <div className="parameters-textArea full-row">
                        <label>Parameters:</label>
                        <textarea name="callParameters" defaultValue={props.formAction === 'Edit Service' ? portal.callParameters : null} disabled={disabledParameters} ref={register}></textarea>
                    </div>
                    <p className="text-danger text-center">{callParametersError}</p>
                </div>

                <div className="full-row">
                    <label>Email to notify:</label>
                    <input
                        type="text"
                        name="email"
                        onChange={() => {
                            clearError('email');
                        }}
                        defaultValue={props.formAction === 'Edit Service' ? portal.email : null}
                        ref={register({
                            required: 'Email adress is required',
                            pattern: {
                                value: /^[A-Z 0-9 ._%+-]+@[A-Z 0-9 .-]+\.[A-Z]{2,10}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    <p className="text-danger text-center">{errors.email && errors.email.message}</p>
                </div>

                <div className="full-row">
                    <label>Check interval (s): </label>
                    <input
                        type="number"
                        name="checkInterval"
                        step="1"
                        onChange={() => {
                            clearError('checkInterval');
                        }}
                        defaultValue={props.formAction === 'Edit Service' ? portal.checkInterval : null}
                        ref={register({
                            required: 'Check interval can not be empty',
                            pattern: {
                                value: /^[0-9]/i,
                                message: 'Check interval must be positive number'
                            },
                            minLength: {
                                value: 2,
                                message: 'Check interval must be greater than 10 seconds'
                            },
                            maxLength: {
                                value: 8,
                                message: 'Check interval must be lower than 99999999 seconds'
                            }
                        })}
                    />
                    <p className="text-danger text-center">{errors.checkInterval && errors.checkInterval.message}</p>
                </div>

                <div className="full-row">
                    <label>Response threshold time (ms): </label>
                    <input
                        type="number"
                        name="responseTimeThreshold"
                        onChange={() => {
                            clearError('responseTimeThreshold');
                        }}
                        step="1"
                        defaultValue={props.formAction === 'Edit Service' ? portal.responseTimeThreshold : null}
                        ref={register({
                            required: 'Response threshold time can not be empty',
                            pattern: {
                                value: /^[0-9]/i,
                                message: 'Response threshold time must be positive number'
                            },
                            minLength: {
                                value: 3,
                                message: 'Check interval must be greater than 100 ms'
                            },
                            maxLength: {
                                value: 8,
                                message: 'Check interval must be lower than 99999999 ms'
                            }
                        })}
                    />
                    <p className="text-danger text-center">{errors.responseTimeThreshold && errors.responseTimeThreshold.message}</p>
                </div>

                <div className="checkbox full-row">
                    <label>Active:</label>
                    <input type="checkbox" name="isActive" checked={active} onChange={ActiveCheckbox} ref={register} />
                </div>

                <div className="form-button text-right full-row margin-on-small-screens">
                    <button className="festo-button" type="button" onClick={handleSubmit(testSubmit)}>
                        Test
                    </button>

                    <button className="festo-button" type="submit">
                        OK
                    </button>

                    <button
                        className="festo-button"
                        type="button"
                        onClick={props.closeEditModal} //form -> form
                    >
                        Cancel
                    </button>
                </div>

                <Modal ariaHideApp={false} contentLabel="Test modal" isOpen={testModalIsOpen} style={testModalStyle} portalClassName="test-modal">
                    <h4>Service test</h4>
                    <TestComponent />
                    <div className="text-right">
                        <button className="festo-button" onClick={closeTestModal}>
                            Ok
                        </button>
                    </div>
                </Modal>
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
