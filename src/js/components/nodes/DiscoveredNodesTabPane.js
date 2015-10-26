import React from 'react';

import DataTable from '../ui/tables/DataTable';
import { DataTableCellLink } from '../ui/tables/DataTableCells';
import { DataTableColumn } from '../ui/tables/DataTableColumns';

export default class DiscoveredNodesTabPane extends React.Component {
  render() {
    return (
      <DataTable className="table table-striped" data={this.props.nodes}>
        <DataTableColumn dataKey="uuid"
                         title="UUID"
                         cellRenderer={DataTableCellLink}/>
        <DataTableColumn dataKey="instance_uuid"
                         title="Instance UUID"/>
        <DataTableColumn dataKey="power_state"/>
        <DataTableColumn dataKey="provision_state"/>
      </DataTable>
    );
  }
}
DiscoveredNodesTabPane.propTypes = {
  nodes: React.PropTypes.array
};
