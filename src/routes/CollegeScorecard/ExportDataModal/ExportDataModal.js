import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { connectModal } from 'redux-modal';
import collegeScorecardReduxModule from '../../../redux/modules/collegeScorecard';
import DragNDrop from './DragNDrop';

class ExportDataModal extends Component {
  static propTypes = {
    // name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    reorderItems: PropTypes.func.isRequired
  };

  render() {
    const {
      open, onClose, items, reorderItems
    } = this.props;
    return (
      <Modal
        open={open}
        onClose={onClose}
        size="large"
        closeIcon
        dimmer="inverted"
        closeOnDimmerClick={false}
      >
        <Header content={<h1>EXPORT DATA</h1>} />
        <Modal.Content>
          <DragNDrop
            items={items}
            reorderItems={reorderItems}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default connectModal(
  ExportDataModal,
  'modal',
  state => ({
    items: collegeScorecardReduxModule.selectors.getSelectedOrdered(state)
  }),
  dispatch => ({
    reorderItems: (sourceIdx, destIdx) => dispatch(collegeScorecardReduxModule.actions.reorder(sourceIdx, destIdx))
  })
);
