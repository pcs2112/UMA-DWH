import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';

const portal = document.createElement('div');
portal.classList.add('my-super-portal');

if (!document.body) {
  throw new Error('body not ready for portal creation!');
}

document.body.appendChild(portal);

const grid = 2;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: '0 0 1px 0',

  // change background colour if dragging
  background: isDragging ? 'lightblue' : 'rgba(0, 0, 0, 0.03)',
  border: '1px #eee solid',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = () => ({
  background: '#fff',
  padding: '1px',
  width: 250,
  maxHeight: '50vh',
  overflow: 'auto'
});

class DragNDrop extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    reorderItems: PropTypes.func.isRequired
  };

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const { reorderItems } = this.props;
    reorderItems(result.source.index, result.destination.index);
  };

  render() {
    const { items } = this.props;
    console.log(items);
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {providedContext => (
            <div
              ref={providedContext.innerRef}
              style={getListStyle()}
            >
              {items.map((item, index) => (
                <Draggable key={item.dictionary_entry_id} draggableId={item.dictionary_entry_id} index={index}>
                  {(provided, snapshot) => {
                    const child = (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.column_name}
                      </div>
                    );

                    const usePortal = snapshot.isDragging;

                    if (!usePortal) {
                      return child;
                    }

                    // if dragging - put the item in a portal
                    return ReactDOM.createPortal(child, portal);
                  }}
                </Draggable>
              ))}
              {providedContext.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default DragNDrop;
