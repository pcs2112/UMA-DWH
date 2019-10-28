import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VirtualMultiSelectBox from '../../../components/VirtualMultiSelectBox';

class DefineForm extends Component {
  static propTypes = {
    facts: PropTypes.array.isRequired,
    selectedFacts: PropTypes.object.isRequired,
    onAddFact: PropTypes.func.isRequired,
    onRemoveFact: PropTypes.func.isRequired,
    onRemoveAllFacts: PropTypes.func.isRequired,
    dims: PropTypes.array.isRequired,
    selectedDims: PropTypes.array.isRequired,
    onAddDim: PropTypes.func.isRequired,
    onRemoveDim: PropTypes.func.isRequired,
    onRemoveAllDims: PropTypes.func.isRequired
  };

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
          valueArray={Object.keys(selectedFacts)}
          onAdd={onAddFact}
          onRemove={(removedItem) => {
            onRemoveFact(removedItem.fact_table, removedItem);
          }}
          onRemoveAll={onRemoveAllFacts}
          selectedLabel="Items"
        />
        <h3>DIMENSION TABLES</h3>
        <VirtualMultiSelectBox
          labelKey="id"
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
      </>
    );
  }
}

export default DefineForm;
