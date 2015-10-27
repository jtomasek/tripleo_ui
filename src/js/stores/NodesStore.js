import BaseStore from './BaseStore';
import NodesConstants from '../constants/NodesConstants';

class NodesStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this.state = {
      nodes: {}
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
    this.state.nodes.discovered = this._filterDiscoveredNodes(nodes);
    this.state.nodes.provisioned = this._filterProvisionedNodes(nodes);
    this.state.nodes.maintenance = this._filterMaintenanceNodes(nodes);
    this.emitChange();
  }

  _filterRegisteredNodes(nodes) {
    return nodes.filter((node) => {
      return true;
    });
  }

  _filterDiscoveredNodes(nodes) {
    return nodes.filter((node) => {
      return true;
    });
  }

  _filterProvisionedNodes(nodes) {
    return nodes.filter((node) => {
      return true;
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
