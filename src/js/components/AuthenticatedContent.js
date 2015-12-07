import React from 'react';

import AuthenticatedComponent from './utils/AuthenticatedComponent';
import PlansActions from '../actions/PlansActions';

import NavBar from './NavBar';
import Footer from './Footer';
import NotificationsToaster from './notifications/NotificationsToaster';

export default AuthenticatedComponent(class Nodes extends React.Component {

  componentDidMount() {
    PlansActions.listPlans();
  }

  render() {
    return (
      <div>
        <header>
          <NavBar/>
        </header>
        <div className="wrapper-fixed-body container-fluid">
          {this.props.children}
        </div>
        <Footer/>
        <NotificationsToaster />
      </div>
    );
  }
});
