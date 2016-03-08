import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import nodesReducer from './nodesReducer';
import notificationsReducer from './notificationsReducer';
import plansReducer from './plansReducer';
import registerNodesReducer from './registerNodesReducer';
import validationsReducer from './validationsReducer';

const appReducer = combineReducers({
  login: loginReducer,
  nodes: nodesReducer,
  notifications: notificationsReducer,
  plans: plansReducer,
  registerNodes: registerNodesReducer,
  validations: validationsReducer
});

export default appReducer;
