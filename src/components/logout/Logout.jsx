import { useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';

function Logout(props) {
    useEffect(() => {
        localStorage.clear();
        props.setName(null);
        props.setSurname(null);
        history.push('/login');
    });

    const history = useHistory();
    return (
        <div className="login mt-5 pt-5 d-flex flex-column justify-content-center align-items-center">
            <h1 className="mt-3 mb-5">Loging out</h1>
        </div>
    );
}

export default Logout;
