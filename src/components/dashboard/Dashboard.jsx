import { useHistory } from 'react-router-dom';
import Sticker from '../sticker/Sticker';
import './Dashboard.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard(props) {
    const history = useHistory();
    const [stickers, setStickers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const url2 = 'https://dashboardapino1.azurewebsites.net/api/queryportal/getallactive';

    useEffect(() => {
        if (!localStorage.getItem('name')) {
            history.push('/login');
        } else {
            axios
                .get(url2, {
                    headers: {
                        Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                    }
                })
                .then(res => {
                    setStickers(res.data);
                    setIsLoaded(true);
                })
                .catch(err => {
                    setIsLoaded(false);
                    if (isNaN(err.response.status) || err.response.status === undefined || err.response.status === null) {
                        window.location.reload(false);
                    } else {
                        IsAuthorized(err.response.status);
                    }
                });
        }
    }, []);

    function IsAuthorized(status) {
        if (status === 401) {
            localStorage.clear();
            props.setName(null);
            props.setSurname(null);
            history.push('/login');
        }
    }

    if (isLoaded) {
        return (
            <React.Fragment>
                <section>
                    <h1 className="title">Dashboard</h1>
                    <p>Web apps</p>
                    <div className="row d-flex flex-wrap justify-content-start">
                        {stickers
                            .filter(i => i.type === 0)
                            .map((stickerItem, index) => (
                                <Sticker
                                    key={stickerItem.id}
                                    type={stickerItem.type}
                                    url={stickerItem.url}
                                    isActive={stickerItem.isActive}
                                    email={stickerItem.email}
                                    id={stickerItem.id}
                                    name={stickerItem.name}
                                    checkInterval={stickerItem.checkInterval}
                                    lastFailure={stickerItem.lastFailure}
                                    responseTimeThreshold={stickerItem.responseTimeThreshold}
                                    IsAuthorized={IsAuthorized}
                                    tooltipId={'Web app' + index}
                                />
                            ))}
                    </div>
                </section>
                <section className="pt-3">
                    <p>Services</p>
                    <div className="row d-flex flex-wrap justify-content-start ">
                        {stickers
                            .filter(i => i.type !== 0)
                            .map((stickerItem, index) => (
                                <Sticker
                                    key={stickerItem.id}
                                    type={stickerItem.type}
                                    url={stickerItem.url}
                                    isActive={stickerItem.isActive}
                                    email={stickerItem.email}
                                    id={stickerItem.id}
                                    name={stickerItem.name}
                                    checkInterval={stickerItem.checkInterval}
                                    lastFailure={stickerItem.lastFailure}
                                    responseTimeThreshold={stickerItem.responseTimeThreshold}
                                    IsAuthorized={IsAuthorized}
                                    tooltipId={'Service' + index}
                                />
                            ))}
                    </div>
                </section>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <h1 className="title">Dashboard</h1>
            <section className="d-flex align-items-center justify-content-center rotation-bar">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </section>
        </React.Fragment>
    );
}

export default Dashboard;
