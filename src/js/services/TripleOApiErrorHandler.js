import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class TripleOApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(xmlHttpRequestError) {
    let errors = [];
    switch(xmlHttpRequestError.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to TripleO is not available'
      });
      break;
    case 401:
      let error = JSON.parse(xmlHttpRequestError.responseText).error;
      errors.push({
        title: 'Unauthorized',
        message: error.message
      });
      break;
    default:
      break;
    }
    return errors;
  }
}
