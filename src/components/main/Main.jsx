import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import PortalsList from '../portalsList/PortalsList';
import Users from '../users/Users';
import Login from '../login/Login';
import Logout from '../logout/Logout';
import NotFound from '../NotFound/NotFound';
import DeletedPortalsList from '../deletedPortalsList/DeletedPortalsList';

import './Main.scss';

function Main(props) {
    return (
        <main className="main-container pb-3 mb-5 pt-5 mt-5">
            <Switch>
                <Route exact path="/">
                    <Dashboard setName={props.setName} setSurname={props.setSurname} />
                    {/* paduodami vardo/pavardes setinimo f-cijos/hooksai, kad atloginnt nunulintu varda/pavarde */}
                </Route>

                <Route path="/maintaining_list">
                    <PortalsList setName={props.setName} setSurname={props.setSurname} />
                </Route>

                <Route path="/users">
                    <Users setName={props.setName} setSurname={props.setSurname} />
                </Route>

                <Route path="/deleted_portals">
                    <DeletedPortalsList setName={props.setName} setSurname={props.setSurname} />
                </Route>

                <Route path="/login">
                    <Login setName={props.setName} setSurname={props.setSurname} />
                </Route>

                <Route path="/logout">
                    <Logout setName={props.setName} setSurname={props.setSurname} />
                </Route>

                <Route component={NotFound} />
            </Switch>
        </main>
    );
}

export default Main;
