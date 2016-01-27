import BaseStore from './BaseStore';
import NodesConstants from '../constants/NodesConstants';

class NodesStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this.state = {
      nodes: {
        all: [],
        registered: [],
        introspected: [],
        provisioned: [],
        maintenance: []
      }
    };
  }

  _registerToActions(payload) {
    switch(payload.actionType) {
    case NodesConstants.LIST_NODES:
      this.onListNodes(payload.nodes);
      break;
    default:
      break;
    }
  }

  onListNodes(nodes) {
    this.state.nodes.all = nodes;
    this.state.nodes.registered = this._filterRegisteredNodes(nodes);
    this.state.nodes.introspected = this._filterIntrospectedNodes(nodes);
    this.state.nodes.provisioned = this._filterProvisionedNodes(nodes);
    this.state.nodes.maintenance = this._filterMaintenanceNodes(nodes);
    this.emitChange();
  }

  _filterRegisteredNodes(nodes) {
    return nodes.filter((node) => {
      return node.provision_state === 'available' &&
             !node.provision_updated_at ||
             node.provision_state === 'manageable';
      // ??? return node.provision_state === 'enroll';
    });
  }

  _filterIntrospectedNodes(nodes) {
    return nodes.filter((node) => {
      return node.provision_state === 'available' && !!node.provision_updated_at;
    });
  }

  _filterProvisionedNodes(nodes) {
    return nodes.filter((node) => {
      return node.instance_uuid;
    });
  }

  _filterMaintenanceNodes(nodes) {
    return nodes.filter((node) => {
      return node.maintenance;
    });
  }

  getState() {
    return this.state;
  }
}

export default new NodesStore();
