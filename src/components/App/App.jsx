import React, { useState } from 'react';
import Header from '../header/Header';
import Main from '../main/Main';
import Footer from '../footer/Footer';
import { useEffect } from 'react';
import './App.scss';

function App() {
    const [name, setName] = useState(null);
    const [surname, setSurname] = useState(null);

    useEffect(() => {
        setName(localStorage.getItem('name'));
        setSurname(localStorage.getItem('surname'));
    }, []);
    return (
        <div className="App container-fluid">
            <Header name={name} surname={surname} />
            <Main setName={setName} setSurname={setSurname} />
            <Footer />
        </div>
    );
}

export default App;
