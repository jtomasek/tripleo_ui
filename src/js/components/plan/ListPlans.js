import { Link } from 'react-router';
import React from 'react';

import DataTable from '../ui/tables/DataTable';
import { DataTableCell, DataTableHeaderCell } from '../ui/tables/DataTableCells';
import DataTableColumn from '../ui/tables/DataTableColumn';
import PlansActions from '../../actions/PlansActions';
import PlansStore from '../../stores/PlansStore';

export default class ListPlans extends React.Component {
  constructor() {
    super();
    this.state = {
      plans: PlansStore.getPlans()
    };
    this.changeListener = this._onPlansChange.bind(this);
  }

  componentWillMount() {
    PlansActions.listPlans();
  }

  componentDidMount() {
    PlansStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount() {
    PlansStore.removeChangeListener(this.changeListener);
  }

  _onPlansChange() {
    this.setState({ plans: PlansStore.getPlans() });
  }

  renderNoPlans() {
    return (
      <tr>
        <td colSpan="2">
          <p></p>
          <p className="text-center">
            There are currently no Plans
          </p>
          <p className="text-center">
            <Link to="/plans/new"
                  query={{tab: 'newPlan'}}
                  className="btn btn-success">Create New Plan</Link>
          </p>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <Link to="/plans/new"
                query={{tab: 'newPlan'}}
                className="btn btn-lg btn-success">Create New Plan</Link>
        </div>
        <div className="col-sm-12">
          <h2>Plans</h2>
          <DataTable data={this.state.plans}
                     rowsCount={this.state.plans.length}
                     noRowsRenderer={this.renderNoPlans.bind(this)}>
            <DataTableColumn
              key="name"
              header={<DataTableHeaderCell key="name">Name</DataTableHeaderCell>}
              cell={<PlanNameCell data={this.state.plans}/>}/>

            <DataTableColumn
              key="actions"
              header={<DataTableHeaderCell key="actions">Actions</DataTableHeaderCell>}
              cell={<RowActionsCell className="text-right" data={this.state.plans}/>}/>

          </DataTable>
        </div>
        {this.props.children}
      </div>
    );
  }
}
ListPlans.propTypes = {
  children: React.PropTypes.node
};

class RowActionsCell extends React.Component {
  render() {
    let plan = this.props.data[this.props.rowIndex];

    if(plan.transition) {
      // TODO(jtomasek): this causes DOMNesting validation error which should eventually go away
      // in future React versions. See https://github.com/facebook/react/issues/5506
      return null;
    } else {
      return (
        <DataTableCell {...this.props}>
          <Link to={`/plans/${plan.name}/edit`}
                className="btn btn-xs btn-default">Edit</Link>
          &nbsp;
          <Link to={`/plans/${plan.name}/delete`}
                className="btn btn-xs btn-danger">Delete</Link>
        </DataTableCell>
      );
    }
  }
}
RowActionsCell.propTypes = {
  data: React.PropTypes.array.isRequired,
  rowIndex: React.PropTypes.number
};

export class PlanNameCell extends React.Component {
  onPlanClick(e) {
    e.preventDefault();
    PlansActions.choosePlan(e.target.textContent);
  }

  getActiveIcon(planName) {
    if(planName === PlansStore.getCurrentPlanName()) {
      return (
        <span className="pficon pficon-flag"></span>
      );
    }
    return false;
  }

  render() {
    let plan = this.props.data[this.props.rowIndex];

    if(plan.transition) {
      return (
        <DataTableCell {...this.props} colSpan="2" className={plan.transition}>
          <em>Deleting <strong>{plan.name}</strong>&hellip;</em>
        </DataTableCell>
      );
    } else {
      return (
        <DataTableCell {...this.props}>
          {this.getActiveIcon(plan.name)} <a href="" onClick={this.onPlanClick}>{plan.name}</a>
        </DataTableCell>
      );
    }
  }
}
PlanNameCell.propTypes = {
  data: React.PropTypes.array.isRequired,
  rowIndex: React.PropTypes.number
};
