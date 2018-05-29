import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import reduxModalModule from 'redux/modules/reduxModal';
import { getDisplayName } from 'javascript-utils/lib/react';

/**
 * HOC to connect modals to the state.
 *
 * @param {Object} WrappedComponent
 * @param {String} stateName
 * @param {Function|null|undefined} mapStateToProps
 * @param {Function|null|undefined} mapDispatchToProps
 * @returns {Function}
 */
export default (WrappedComponent, stateName, mapStateToProps = null, mapDispatchToProps = null) => {
  const WithReduxModal = props => (
    <WrappedComponent
      {...props}
    />
  );

  WithReduxModal.propTypes = {
    name: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  WithReduxModal.displayName = `WithReduxModal(${getDisplayName(WrappedComponent)})`;

  return connect(
    (state, ownProps) => Object.assign({}, {
      open: state[stateName].modalName === ownProps.name
    }, mapStateToProps ? mapStateToProps(state, ownProps) : {}),
    (dispatch, ownProps) => Object.assign({}, {
      showModal: () => {
        dispatch(reduxModalModule.actions.showModal(ownProps.name));
      },
      onClose: () => {
        dispatch(reduxModalModule.actions.hideModal());
      }
    }, mapDispatchToProps ? mapDispatchToProps(dispatch, ownProps) : null)
  )(WithReduxModal);
};
