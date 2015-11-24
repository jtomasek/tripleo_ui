import * as _ from 'lodash';
import Formsy from 'formsy-react';
import React from 'react';

import EnvironmentConfigurationTopic from './EnvironmentConfigurationTopic';
import FormErrorList from '../ui/forms/FormErrorList';
import NotificationActions from '../../actions/NotificationActions';
import TripleOApiService from '../../services/TripleOApiService';
import TripleOApiErrorHandler from '../../services/TripleOApiErrorHandler';

export default class EnvironmentConfiguration extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false,
      formErrors: [],
      environmentConfiguration: {
        topics: []
      }
    };
  }

  componentDidMount() {
    this._fetchEnvironmentConfiguration();
  }

  _fetchEnvironmentConfiguration() {
    TripleOApiService.getPlanEnvironments(this.props.currentPlanName).then((response) => {
      this.setState({
        environmentConfiguration: response.environments
      });
    }).catch((error) => {
      let errorHandler = new TripleOApiErrorHandler(error);
      errorHandler.errors.forEach((error) => {
        NotificationActions.notify(error);
      });
    });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  /*
  * Formsy splits data into objects by '.', file names include '.'
  * so we need to convert data back to e.g. { filename.yaml: true, ... }
  */
  _convertFormData(formData) {
    return _.mapValues(_.mapKeys(formData, (value, key) => {
      return key+'.yaml';
    }), (value) => {
      return value.yaml;
    });
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    let data = this._convertFormData(formData);
    this.disableButton();
    TripleOApiService.updatePlanEnvironments(this.props.currentPlanName, data).then((response) => {
      this.setState({ environmentConfiguration: response.environments });
      NotificationActions.notify({
        title: 'Environment Configuration updated',
        message: 'The Environment Configuration has been successfully updated',
        type: 'success'
      });
    }).catch((error) => {
      console.error('Error in EnvironmentConfiguration.handleSubmit', error);
      let errorHandler = new TripleOApiErrorHandler(error, Object.keys(this.refs.environmentConfigurationForm.inputs));
      invalidateForm(errorHandler.formFieldErrors);
      this.setState({
        formErrors: errorHandler.errors
      });
    });
  }

  render() {
    let topics = this.state.environmentConfiguration.topics.map((topic, index) => {
      return (
        <EnvironmentConfigurationTopic key={index}
                                       title={topic.title}
                                       description={topic.description}
                                       environmentGroups={topic.environment_groups}/>
      );
    });

    return (
      <div>
        <h2>Environment Configuration</h2>
        <div className="row">
          <div className="col-sm-12">
            <FormErrorList errors={this.state.formErrors}/>
            <Formsy.Form ref="environmentConfigurationForm"
                         role="form"
                         className="form"
                         onSubmit={this.handleSubmit.bind(this)}
                         onValid={this.enableButton.bind(this)}
                         onInvalid={this.disableButton.bind(this)}>
              <div className="form-group">
                <div className="masonry-environment-topics">
                  {topics}
                </div>
              </div>
              <div className="form-group">
                <div className="submit">
                  <button type="submit" disabled={!this.state.canSubmit}
                          className="btn btn-primary btn-lg">
                    Save Configuration
                  </button>
                </div>
              </div>
            </Formsy.Form>
          </div>
        </div>
      </div>
    );
  }
}
EnvironmentConfiguration.propTypes = {
  currentPlanName: React.PropTypes.string
};

/**
* requiresEnvironments validation
* Invalidates input if it is selected and environment it requires is not.
* example: validations="requiredEnvironments:['some_environment.yaml']"
*/
Formsy.addValidationRule('requiresEnvironments',
                         function (values, value, requiredEnvironmentFieldNames) {
  if(value) {
    return !_.filter(_.values(_.pick(values, requiredEnvironmentFieldNames)),
                     function(val){return val === false;}).length;
  }
  return true;
});
