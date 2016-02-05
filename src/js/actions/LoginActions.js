import history from '../history';
import { Map, fromJS } from 'immutable';

import TempStorage from '../services/TempStorage.js';
import KeystoneApiErrorHandler from '../services/KeystoneApiErrorHandler';
import KeystoneApiService from '../services/KeystoneApiService';
import LoginConstants from '../constants/LoginConstants';

export default {
  authenticateUserViaToken(keystoneAuthTokenId, nextPath) {
    return dispatch => {
      dispatch(this.userAuthStarted());
      KeystoneApiService.authenticateUserViaToken(keystoneAuthTokenId).then((response) => {
        TempStorage.setItem('keystoneAuthTokenId', response.access.token.id);
        dispatch(this.userAuthSuccess(response.access));
        history.pushState(null, nextPath);
        // TODO(jtomasek): fetch plans here instead of in AuthenticatedContent
        // dispatch(PlansActions.fetchPlans());
      }).catch((error) => {
        console.error('Error in LoginActions.authenticateUserViaToken', error); //eslint-disable-line no-console
        let errorHandler = new KeystoneApiErrorHandler(error);
        TempStorage.removeItem('keystoneAuthTokenId');
        history.pushState(null, '/login', { nextPath: nextPath });
        dispatch(this.userAuthFailure(errorHandler.errors));
      });
    };
  },

  authenticateUser(formData, formFields, nextPath) {
    return (dispatch, getState) => {
      dispatch(this.userAuthStarted());
      KeystoneApiService.authenticateUser(formData.username, formData.password).then((response) => {
        TempStorage.setItem('keystoneAuthTokenId', response.access.token.id);
        dispatch(this.userAuthSuccess(response.access));
        history.pushState(null, nextPath);
        // TODO(jtomasek): fetch plans here instead of in AuthenticatedContent
        // dispatch(PlansActions.fetchPlans());
      }).catch((error) => {
        console.error('Error in LoginActions.authenticateUser', error); //eslint-disable-line no-console
        let errorHandler = new KeystoneApiErrorHandler(error, formFields);
        dispatch(this.userAuthFailure(errorHandler.errors, errorHandler.formFieldErrors));
      });
    };
  },

  userAuthStarted() {
    return {
      type: LoginConstants.USER_AUTH_STARTED
    };
  },

  userAuthFailure(errors, formFieldErrors = {}) {
    return {
      type: LoginConstants.USER_AUTH_FAILURE,
      payload: Map({
        formErrors: fromJS(errors),
        formFieldErrors: fromJS(formFieldErrors)
      }),
      error: true
    };
  },

  userAuthSuccess(keystoneAccess) {
    return {
      type: LoginConstants.USER_AUTH_SUCCESS,
      payload: fromJS(keystoneAccess)
    };
  },

  logoutUser() {
    return dispatch => {
      history.pushState(null, '/login');
      TempStorage.removeItem('keystoneAuthTokenId');
      dispatch(this.logoutUserSuccess());
    };
  },

  logoutUserSuccess() {
    return {
      type: LoginConstants.LOGOUT_USER_SUCCESS
    };
  }
};
