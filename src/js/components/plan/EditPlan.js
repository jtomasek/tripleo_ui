import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import FormErrorList from '../ui/forms/FormErrorList';
import PlanEditFormTabs from './PlanEditFormTabs';
import PlansActions from '../../actions/PlansActions';

class EditPlan extends React.Component {

  constructor() {
    super();
    this.state = {
      planName: undefined,
      selectedFiles: undefined,
      canSubmit: false,
      formErrors: []
    };
  }

  componentDidMount() {
    this.state.planName = this.getNameFromUrl();
    this.props.fetchPlan(this.state.planName);
  }

  onPlanFilesChange(currentValues) {
    if(currentValues && currentValues.planFiles) {
      this.setState({ selectedFiles: currentValues.planFiles });
    }
  }

  onFormSubmit(form) {
    let planFiles = {};
    this.state.selectedFiles.map(item => {
      planFiles[item.name] = {};
      planFiles[item.name].contents = item.content;
      // TODO(jtomasek): user can identify capabilities-map in the list of files
      // (dropdown select or sth)
      if(item.name.match('^capabilities[-|_]map\.yaml$')) {
        planFiles[item.name].meta = { 'file-type': 'capabilities-map' };
      }
    });
    this.props.updatePlan(this.state.planName, planFiles);
  }

  onFormValid() {
    this.setState({canSubmit: true});
  }

  onFormInvalid() {
    this.setState({canSubmit: false});
  }

  getNameFromUrl() {
    let planName = this.props.params.planName || '';
    return planName.replace(/[^A-Za-z0-9_-]*/g, '');
  }

  render() {
    let plan = this.props.planData.filter(plan => plan.get('name') === this.state.planName).first();
    let planFiles = plan ? plan.get('files') : undefined;

    return (
      <div>
        <div className="modal modal-routed in" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <Formsy.Form ref="EditPlanForm"
                           role="form"
                           className="form-horizontal"
                           onChange={this.onPlanFilesChange.bind(this)}
                           onValidSubmit={this.onFormSubmit.bind(this)}
                           onValid={this.onFormValid.bind(this)}
                           onInvalid={this.onFormInvalid.bind(this)}>
              <div className="modal-header">
                <Link to="/plans/list"
                     type="button"
                     className="close">
                     <span aria-hidden="true">&times;</span>
                </Link>
                <h4>Update {this.state.planName} Files</h4>
              </div>
              <div className="modal-body">
                <FormErrorList errors={this.state.formErrors}/>
                <PlanEditFormTabs currentTab={this.props.location.query.tab || 'editPlan'}
                                  planFiles={planFiles}
                                  selectedFiles={this.state.selectedFiles}
                                  planName={this.state.planName}/>
              </div>
              <div className="modal-footer">
                <button disabled={!this.state.canSubmit}
                        className="btn btn-primary btn-lg"
                        type="submit">
                  Upload Files and Update Plan
                </button>
              </div>
              </Formsy.Form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop in"></div>
      </div>
    );
  }
}

EditPlan.propTypes = {
  fetchPlan: React.PropTypes.func,
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  planData: ImmutablePropTypes.list,
  updatePlan: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    planData: state.plans.get('all')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPlan: planName => {
      dispatch(PlansActions.fetchPlan(planName));
    },
    updatePlan: (planName, files) => {
      dispatch(PlansActions.updatePlan(planName, files));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPlan);
