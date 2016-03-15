import { fromJS } from 'immutable';

import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
import { InitialEnvironmentConfigurationState } from '../immutableRecords/environmentConfiguration';

const initialState = new InitialEnvironmentConfigurationState;

export default function environmentConfigurationReducer(state = initialState, action) {
  switch(action.type) {

  case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_PENDING:
    return initialState.set('isLoaded', false);

  case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_SUCCESS:
    return state
        .set('isLoaded', true)
        .set('topics', fromJS(action.payload.topics));

  case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_FAILED:
    return initialState.set('isLoaded', true);

  case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_PENDING:
    return state.set('isLoaded', false);

  case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS:
    return state
        .set('isLoaded', true)
        .set('topics', fromJS(action.payload.topics));

  case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_FAILED:
    return state
        .set('isLoaded', true)
        .set('form', fromJS(action.payload));

  default:
    return state;

  }
}
