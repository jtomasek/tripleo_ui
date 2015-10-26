import React from 'react';
import { Link } from 'react-router';

import AuthenticatedComponent from './utils/AuthenticatedComponent';
import LoginActions from '../actions/LoginActions';
import NavTab from './ui/NavTab';


export default AuthenticatedComponent(class NavBar extends React.Component {
  logout(e) {
    e.preventDefault();
    LoginActions.logoutUser();
  }

  render() {
    if (this.props.userLoggedIn) {
      return (
        <nav className="navbar navbar-default">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed"
                    data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
                    aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link className="navbar-brand" to="/">RDO Director</Link>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <NavTab to="/" onlyActiveOnIndex>Overview</NavTab>
              <NavTab to="/nodes">Nodes</NavTab>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <p className="navbar-text">
                  <span className="glyphicon glyphicon-user" aria-hidden="true">
                  </span> {this.props.user.username}
                </p>
              </li>
              <li><a href="#" onClick={this.logout}>Logout</a></li>
            </ul>
          </div>
        </nav>
      );
    } else {
      return false;
    }
  }
});
