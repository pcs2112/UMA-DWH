import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import { Form } from 'semantic-ui-react';
import VirtualMultiSelectBox from '../../../components/VirtualMultiSelectBox';
import factsRdx from '../../../redux/modules/dataCubes/facts';
import dimsRdx from '../../../redux/modules/dataCubes/dims';

class DefineForm extends Component {
  static propTypes = {
    facts: PropTypes.array.isRequired,
    selectedFacts: PropTypes.array.isRequired,
    onAddFact: PropTypes.func.isRequired,
    onRemoveFact: PropTypes.func.isRequired,
    onRemoveAllFacts: PropTypes.func.isRequired,
    dims: PropTypes.array.isRequired,
    selectedDims: PropTypes.array.isRequired,
    onAddDim: PropTypes.func.isRequired,
    onRemoveDim: PropTypes.func.isRequired,
    onRemoveAllDims: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onChangeDefinition: PropTypes.func.isRequired,
    definition: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.definition = [...props.definition];
  }

  onClose = () => {
    const { onChangeDefinition, onClose, definition } = this.props;
    onChangeDefinition(definition);
    onClose();
  }

  render() {
    const {
      facts,
      onAddFact,
      onRemoveFact,
      onRemoveAllFacts,
      selectedFacts,
      dims,
      onAddDim,
      onRemoveDim,
      onRemoveAllDims,
      selectedDims
    } = this.props;
    return (
      <>
        <h3>FACT TABLES</h3>
        <VirtualMultiSelectBox
          labelKey="label"
          valueKey="fact_table"
          options={facts}
          valueArray={selectedFacts}
          onAdd={onAddFact}
          onRemove={(removedItem) => {
            onRemoveFact(removedItem.fact_table, removedItem);
          }}
          onRemoveAll={onRemoveAllFacts}
          selectedLabel="Items"
        />
        <h3>DIMENSION TABLES</h3>
        <VirtualMultiSelectBox
          labelKey="label"
          valueKey="id"
          options={dims}
          valueArray={selectedDims}
          onAdd={onAddDim}
          onRemove={(removedItem) => {
            onRemoveDim(removedItem.id, removedItem);
          }}
          onRemoveAll={onRemoveAllDims}
          selectedLabel="Items"
        />
        <br />
        <Form.Button
          type="button"
          content="Done"
          primary
          onClick={this.onClose}
        />
      </>
    );
  }
}

const ConnectedForm = connect(
  state => ({
    definition: dimsRdx.selectors.getSelectedFlat(state),
    facts: factsRdx.selectors.getData(state),
    selectedFacts: factsRdx.selectors.getSelectedIds(state),
    dims: dimsRdx.selectors.getData(state),
    selectedDims: dimsRdx.selectors.getSelectedIds(state)
  }),
  (dispatch, props) => ({
    onChangeDefinition: (value) => dispatch(change(props.form, 'definition', value)),
    onAddFact: (fact) => {
      dispatch(factsRdx.actions.select(fact));
    },
    onRemoveFact: (id, fact) => {
      dispatch(factsRdx.actions.unselect(id, fact));
    },
    onRemoveAllFacts: () => {
      dispatch(factsRdx.actions.unselectAll());
    },
    onAddDim: (dim) => {
      dispatch(dimsRdx.actions.select(dim));
    },
    onRemoveDim: (id, dim) => {
      dispatch(dimsRdx.actions.unselect(id, dim));
    },
    onRemoveAllDims: () => {
      dispatch(dimsRdx.actions.unselectAll());
    }
  })
)(DefineForm);

export default ConnectedForm;
