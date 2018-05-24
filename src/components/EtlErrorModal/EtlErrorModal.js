import React from 'react';
import PropTypes from 'prop-types';
import { Header, Modal, Grid } from 'semantic-ui-react';

const EtlErrorModal = ({
  open, onClose, error
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size="tiny"
    closeIcon
    dimmer="inverted"
  >
    <Header content={<h1>ETL ERROR</h1>} />
    <Modal.Content>
      <Grid celled="internally">
        {error && Object.keys(error).map(key => (
          <Grid.Row key={key}>
            <Grid.Column width={4}>
              {`${key.toUpperCase()}:`}
            </Grid.Column>
            <Grid.Column width={12}>
              {error[key]}
            </Grid.Column>
          </Grid.Row>
        ))}
      </Grid>
    </Modal.Content>
  </Modal>
);

EtlErrorModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};

export default EtlErrorModal;
