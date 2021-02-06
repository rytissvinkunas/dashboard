import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import './Login.scss';
const api = 'https://dashboardapino1.azurewebsites.net/user/login';

function Login(props) {
    const [errormsg, setErrormsg] = useState('');
    const history = useHistory();
    const { handleSubmit, register, errors, clearError } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    const onSubmit = values => {
        axios
            .post(api, values)
            .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('surname', response.data.surname);
                if (response.data.isAdmin != null && response.data.isAdmin === true) {
                    localStorage.setItem('admin', true);
                }
                props.setName(response.data.name);
                props.setSurname(response.data.surname);
                if (response.status === 200) {
                    history.push('/');
                }
            })
            .catch(error => {
                if (error.response.status === 401 || error.response.status === 400) setErrormsg('Incorrect email or password');
            });
    };

    useEffect(() => {
        if (localStorage.getItem('name')) history.push('/');
    }, [history]);

    function HandleValidationMessage() {
        clearError('email');
        clearError('password');
        setErrormsg('');
    }

    return !localStorage.getItem('name') ? (
        <div className="d-flex justify-content-center align-items-center reset-position">
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate="novalidate">
                    <div className="input-wraper">
                        <input
                            onChange={HandleValidationMessage}
                            type="text"
                            name="email"
                            id="email"
                            className="inputText"
                            required
                            ref={register({
                                required: 'Enter an email',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i,
                                    message: 'Invalid email address format'
                                }
                            })}
                        />
                        <span className="floating-label">Email</span>
                        <p className="text-danger" id="er">
                            {errors.email && errors.email.message}
                        </p>
                    </div>

                    <div className="input-wraper">
                        <input
                            onChange={HandleValidationMessage}
                            type="password"
                            name="password"
                            id="password"
                            className="inputText"
                            required
                            ref={register({
                                required: 'Enter a password',
                                pattern: {
                                    //value: /^[a-zA-Z0-9!@#$%^&]+$/i,
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
                                    message: 'Incorrect email or password'
                                },
                                minLength: {
                                    value: 6,
                                    message: 'Incorrect email or password'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'Incorrect email or password'
                                }
                            })}
                        />
                        <span className="floating-label">Password</span>
                        <p className="text-danger">
                            <span id="re">{errors.password && errors.password.message}</span>
                            <span>{errormsg}</span>
                        </p>
                    </div>
                    <div className="">
                        <button className="button" type="submit">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <div></div>
    );
}

export default Login;
