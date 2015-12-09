import React from 'react';

import HorizontalStaticText from '../ui/forms/HorizontalStaticText';
import NavTab from '../ui/NavTab';
import PlanFileInput from './PlanFileInput';
import PlanFilesTab from './PlanFilesTab';

export default class PlanEditFormTabs extends React.Component {
  setActiveTab(tabName) {
    return this.props.currentTab === tabName ? 'active' : '';
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <NavTab to={`/plans/${this.props.planName}/edit`}
                  query={{tab: 'editPlan'}}>Update Plan</NavTab>
          <NavTab to={`/plans/${this.props.planName}/edit`}
                  query={{tab: 'planFiles'}}>
            Files <span className="badge">{this.props.planFiles.length}</span>
          </NavTab>
        </ul>
        <div className="tab-content">
          <PlanFormTab active={this.setActiveTab('editPlan')}
                       planName={this.props.planName}/>
          <PlanFilesTab active={this.setActiveTab('planFiles')}
                        planFiles={this.props.planFiles} />
        </div>
      </div>
    );
  }
}
PlanEditFormTabs.propTypes = {
  currentTab: React.PropTypes.string,
  planFiles: React.PropTypes.array.isRequired,
  planName: React.PropTypes.string
};
PlanEditFormTabs.defaultProps = {
  currentTtab: 'editPlan'
};

class PlanFormTab extends React.Component {
  render() {
    return (
      <div className={`tab-pane ${this.props.active}`}>
        <HorizontalStaticText title="Plan Name"
                              text={this.props.planName}
                              valueColumnClasses="col-sm-7"
                              labelColumnClasses="col-sm-3"/>
        <PlanFileInput name="planFiles"
                       title="Upload Files"
                       inputColumnClasses="col-sm-7"
                       labelColumnClasses="col-sm-3"
                       multiple
                       required/>
      </div>
    );
  }
}
PlanFormTab.propTypes = {
  active: React.PropTypes.string,
  planName: React.PropTypes.string
};
