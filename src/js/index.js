import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Router, Route, Redirect } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import App from './components/App';
import AuthenticatedContent from './components/AuthenticatedContent';
import DeletePlan from './components/plan/DeletePlan';
import IntrospectedNodesTabPane from './components/nodes/IntrospectedNodesTabPane';
import DeploymentPlan from './components/deployment-plan/DeploymentPlan';
import EditPlan from './components/plan/EditPlan';
import EnvironmentConfiguration from
  './components/environment_configuration/EnvironmentConfiguration.js';
import Flavors from './components/flavors/Flavors';
import Images from './components/images/Images';
import ListPlans from './components/plan/ListPlans';
import Login from './components/Login';
import LoginActions from './actions/LoginActions';
import LoginStore from './stores/LoginStore';
import MaintenanceNodesTabPane from './components/nodes/MaintenanceNodesTabPane';
import NewPlan from './components/plan/NewPlan';
import Nodes from './components/nodes/Nodes';
import Parameters from './components/parameters/Parameters.js';
import Plans from './components/plan/Plans.js';
import ProvisionedNodesTabPane from './components/nodes/ProvisionedNodesTabPane';
import RegisterNodesDialog from './components/nodes/RegisterNodesDialog';
import RegisteredNodesTabPane from './components/nodes/RegisteredNodesTabPane';
import Roles from './components/roles/Roles.js';
import TempStorage from './services/TempStorage.js';

function checkAuth(nextState, replaceState) {
  if (!LoginStore.isLoggedIn()) {
    replaceState(null, '/login', { nextPath: nextState.location.pathname +
                                             nextState.location.search });
  }
}

let routes = (
  <Route>
    <Redirect from="/" to="/deployment-plan"/>
    <Route path="/" component={App}>
      <Route component={AuthenticatedContent} onEnter={checkAuth}>

        <Route path="deployment-plan" component={DeploymentPlan}>
          <Route path="environment" component={EnvironmentConfiguration}/>
          <Route path="parameters" component={Parameters}/>
        </Route>

        <Route path="roles" component={Roles}/>

        <Redirect from="nodes" to="nodes/registered"/>
        <Route path="nodes" component={Nodes}>
          <Route path="registered" component={RegisteredNodesTabPane}>
            <Route path="register" component={RegisterNodesDialog}/>
          </Route>
          <Route path="introspected" component={IntrospectedNodesTabPane}/>
          <Route path="provisioned" component={ProvisionedNodesTabPane}/>
          <Route path="maintenance" component={MaintenanceNodesTabPane}/>
        </Route>

        <Route path="flavors" component={Flavors}/>

        <Route path="images" component={Images}/>

        <Redirect from="plans" to="plans/list"/>
        <Route path="plans" component={Plans}>
          <Route path="list" component={ListPlans}>
            <Route path="/plans/new" component={NewPlan}/>
            <Route path="/plans/:planName/delete" component={DeletePlan}/>
          </Route>
          <Route path=":planName/edit" component={EditPlan}/>
        </Route>
      </Route>
      <Route path="login" component={Login}/>
    </Route>
  </Route>
);

TempStorage.initialized.then(() => {
  let keystoneAuthTokenId = TempStorage.getItem('keystoneAuthTokenId');
  if (keystoneAuthTokenId) {
    LoginActions.authenticateUserViaToken(keystoneAuthTokenId);
  }
});

ReactDOM.render(
  <IntlProvider locale="en">
    <Router history={createBrowserHistory()}>{routes}</Router>
  </IntlProvider>,
  document.getElementById('react-app-index'));
