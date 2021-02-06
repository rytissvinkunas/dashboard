import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import './Sticker.scss';
function Sticker(props) {
    const [pingData, setpingData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [seconds, setSeconds] = useState(props.checkInterval);
    const url2 = 'https://dashboardapino1.azurewebsites.net/api/queryportal/ping/';
    const portalId = props.id;
    const tooLongResponse = props.responseTimeThreshold; // time in milisecons
    const maxStringLengthToDisplayInTable = 15;
    useEffect(() => {
        Fetching();
    }, []);
    function Fetching() {
        axios
            .get(url2 + portalId, {
                headers: {
                    Authorization: 'Bearer '.concat(localStorage.getItem('token'))
                }
            })
            .then(res => {
                setpingData(res.data);
                setIsLoaded(true);
            })
            .catch(err => {
                setIsLoaded(false);
                if (isNaN(err.response.status) || err.response.status === undefined || err.response.status === null) {
                    window.location.reload(false);
                } else {
                    props.IsAuthorized(err.response.status);
                }
            });
    }

    function Timer() {
        if (seconds >= 0) {
            setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);
        } else {
            setSeconds(props.checkInterval);
            setIsLoaded(false);
            Fetching();
        }
        return seconds;
    }

    function StickerStyle() {
        if (pingData.status !== 0 && pingData.status < 300 && pingData.responseTime <= tooLongResponse) return 'sticker m-2';

        if (pingData.status === 0 || pingData.status >= 300) return 'sticker m-2 sticker__alert';
        if (pingData.status !== 0 && pingData.status < 300 && pingData.responseTime > tooLongResponse) return 'sticker m-2 sticker__warning';

        return 'sticker m-2 sticker__alert';
    }

    function LastFail() {
        //const options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
        if (pingData.lastFailure) {
            let pingDataLastFailureTime = new Date(pingData.lastFailure.toString().substring(0, 22) + 'Z');
            //.toLocaleDateString('lt-LT', options);
            return pingDataLastFailureTime.toLocaleDateString() + ' ' + pingDataLastFailureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (props.lastFailure) {
            let firstFetchDate = new Date(props.lastFailure + 'Z');
            //.toLocaleDateString('lt-LT', options);
            return firstFetchDate.toLocaleDateString() + ' ' + firstFetchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return '---';
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

    if (isLoaded) {
        return (
            <div className={StickerStyle()}>
                <div className="tooltip-wrap" data-tip="" data-type="warning" data-for={props.tooltipId}>
                    <span>{MakeShorterName(props.name)}</span>
                    <ReactTooltip id={props.tooltipId} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={props.name.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                        {AddLineBrakesInWord(props.name)}
                    </ReactTooltip>
                </div>

                <p>
                    Response time <strong>{pingData.responseTime === 0 ? '--- ' : pingData.responseTime} </strong>
                    ms
                </p>
                <p>
                    Last failure <strong>{LastFail()}</strong>
                </p>
                <p>
                    Next check in <strong>{Timer()}</strong> s
                </p>
                <p>
                    Service response: <strong>{pingData.status === 0 ? '---' : pingData.status}</strong>
                </p>
            </div>
        );
    }
    return (
        <div className={StickerStyle()}>
            <div className="tooltip-wrap" data-tip="" data-type="warning" data-for={props.tooltipId}>
                <span>{MakeShorterName(props.name)}</span>
                <ReactTooltip id={props.tooltipId} className="festo-tooltip" arrowColor="#0091dc" effect="float" disable={props.name.length > maxStringLengthToDisplayInTable ? false : true} multiline={true} html={true} isCapture={true}>
                    {AddLineBrakesInWord(props.name)}
                </ReactTooltip>
            </div>

            <div className="mb-3">
                <p className="inline">Response time&nbsp;&nbsp;</p>
                <strong>
                    <div className="spinner-border fast spiner inline" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </strong>
                &nbsp;&nbsp;<p className="inline">ms</p>
            </div>
            <p>
                Last failure <strong>{LastFail()}</strong>
            </p>
            <p>
                Next check in <strong>{props.checkInterval}</strong> s
            </p>
            <p>
                Service response: <strong>{pingData.status ? pingData.status : '---'}</strong>
            </p>
        </div>
    );
}
export default Sticker;
