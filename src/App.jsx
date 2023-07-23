import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './App.css';
import { useEffect, useState } from 'react';

const DATA = [
  {
    name: 'Text',
    id: 0,
    icon: 'https://res.cloudinary.com/do7bnejaz/image/upload/v1690015392/Icons/text_xfvuub.png',
    active: false,
  },
  {
    name: 'Image',
    id: 1,
    icon: 'https://res.cloudinary.com/do7bnejaz/image/upload/v1690015300/Icons/imagen_fzt2n8.png',
  },
  {
    name: 'Table',
    id: 2,
    icon: 'https://res.cloudinary.com/do7bnejaz/image/upload/v1690015499/Icons/cuadricula-de-mesa_rund7b.png',
  },
];

const App = () => {
  const [items, setItems] = useState(DATA);

  const [headerItems, setHeaderItems] = useState([]);
  const [bodyBoxItems, setBodyBoxItems] = useState([]);
  const [footerItems, setFooterItems] = useState([]);

  const [toggleSide, setToggleSide] = useState(true);

  const handleDragDrop = (results) => {
    const { source, destination, draggableId } = results;

    const getItemName = draggableId.split('_');
    const typeOfItem = getItemName[0];

    //destination = null, no action
    if (!destination) return;

    // destination and index similar to previus state, no action
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    //only change index --> Reorder items
    if (
      source.droppableId === destination.droppableId &&
      source.index !== destination.index
    ) {
      //reorder items in header
      if (source.droppableId === 'header') {
        const reorderedItems = [...headerItems];

        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        const [removedItem] = reorderedItems.splice(sourceIndex, 1);
        reorderedItems.splice(destinationIndex, 0, removedItem);

        return setHeaderItems(reorderedItems);
      } else if (source.droppableId === 'bodyBox') {
        //reorder items in bodyBox
        const reorderedItems = [...bodyBoxItems];

        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        const [removedItem] = reorderedItems.splice(sourceIndex, 1);
        reorderedItems.splice(destinationIndex, 0, removedItem);

        return setBodyBoxItems(reorderedItems);
      } else if (source.droppableId === 'footer') {
        //reorder items in footer
        const reorderedItems = [...footerItems];

        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        const [removedItem] = reorderedItems.splice(sourceIndex, 1);
        reorderedItems.splice(destinationIndex, 0, removedItem);

        return setFooterItems(reorderedItems);
      }
    }

    // add image to header
    if (
      source.droppableId === 'sideContainer' &&
      destination.droppableId === 'header' &&
      typeOfItem === 'Image'
    ) {
      const draggedItem = items[source.index];

      setHeaderItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(destination.index, 0, draggedItem);

        return updatedItems;
      });
    }

    //add item to bodyBox
    if (source.droppableId === 'sideContainer' && destination.droppableId === 'bodyBox') {
      const draggedItem = items[source.index];
      setBodyBoxItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(destination.index, 0, draggedItem);

        return updatedItems;
      });
    }

    // add text to footer
    if (
      source.droppableId === 'sideContainer' &&
      destination.droppableId === 'footer' &&
      typeOfItem === 'Text'
    ) {
      const draggedItem = items[source.index];

      setFooterItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(destination.index, 0, draggedItem);

        return updatedItems;
      });
    }

    //Transfer items from header to bodyBox
    if (source.droppableId === 'header' && destination.droppableId === 'bodyBox') {
      const draggedItem = source.index;

      setBodyBoxItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(destination.index, 0, headerItems[draggedItem]);

        return updatedItems;
      });

      setHeaderItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(draggedItem, 1);

        return updatedItems;
      });
    }

    //Transfer images from bodyBox to header
    if (
      source.droppableId === 'bodyBox' &&
      destination.droppableId === 'header' &&
      typeOfItem === 'Image'
    ) {
      const draggedItem = source.index;

      setHeaderItems((prevItems) => {
        const updatedHeaderItems = [...prevItems];
        updatedHeaderItems.splice(destination.index, 0, bodyBoxItems[draggedItem]);

        return updatedHeaderItems;
      });

      setBodyBoxItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(draggedItem, 1);

        return updatedItems;
      });
    }

    //Delete Item

    if (
      source.droppableId !== 'sideContainer' &&
      destination.droppableId === 'deleteDrop'
    ) {
      const draggedItem = source.index;
      if (source.droppableId === 'header') {
        setHeaderItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems.splice(draggedItem, 1);

          return updatedItems;
        });
      }
      if (source.droppableId === 'bodyBox') {
        setBodyBoxItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems.splice(draggedItem, 1);

          return updatedItems;
        });
      }
      if (source.droppableId === 'footer') {
        setFooterItems((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems.splice(draggedItem, 1);

          return updatedItems;
        });
      }
    }
  };

  const handleBtnSideContainer = () => {
    setToggleSide(!toggleSide);
  };

  useEffect(() => {}, [toggleSide]);

  return (
    <div className="layout__wrapper">
      <DragDropContext onDragEnd={handleDragDrop}>
        <div className="dashboard">
          <div className="header">
            <h4 className="title">Header</h4>
            <Droppable droppableId="header">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="headerContainer"
                  {...provided.droppableProps}
                >
                  {headerItems.length === 0 && (
                    <h5 className="default">
                      Drag and drop one element within this area
                    </h5>
                  )}
                  {headerItems.map((item, index) => (
                    <Draggable
                      key={`${item.name}_${index}`}
                      draggableId={`${item.name}_h.${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          className="itemHeader"
                        >
                          <img className="icon" src={item.icon} alt={item.name} />
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="bodyBox">
            <h4 className="title">Body</h4>
            <Droppable droppableId="bodyBox">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="bodyBoxContainer"
                  {...provided.droppableProps}
                >
                  {bodyBoxItems.length === 0 && (
                    <h5 className="default">
                      Drag and drop one element within this area
                    </h5>
                  )}
                  {bodyBoxItems.map((item, index) => (
                    <Draggable
                      key={`${item.name}_${index}`}
                      draggableId={`${item.name}_b.${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          className="itemBodyBox"
                        >
                          <img className="icon" src={item.icon} alt={item.name} />
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="footer">
            <h4 className="title">Footer</h4>
            <Droppable droppableId="footer">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="footerContainer"
                  {...provided.droppableProps}
                >
                  {footerItems.length === 0 && (
                    <h5 className="default">
                      Drag and drop one element within this area
                    </h5>
                  )}
                  {footerItems.map((item, index) => (
                    <Draggable
                      key={`${item.name}_${index}`}
                      draggableId={`${item.name}_f.${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          className="itemFooter"
                        >
                          <img className="icon" src={item.icon} alt={item.name} />
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
        <div className={toggleSide === false ? 'collapsed' : 'sideContainer'}>
          <button className="btnSide" onClick={() => handleBtnSideContainer()}>
            <img
              src={
                toggleSide === false
                  ? 'https://res.cloudinary.com/do7bnejaz/image/upload/v1690115618/Icons/izquierda_tunxmp.png'
                  : 'https://res.cloudinary.com/do7bnejaz/image/upload/v1690115615/Icons/derecha_hokv6f.png'
              }
              alt="arrow"
            />
          </button>
          <h4 className="sideTitle">Elements</h4>
          <>
            <Droppable droppableId="sideContainer">
              {(provided, snapshot) => (
                <div
                  style={{ display: snapshot.isDraggingOver && 'none' }}
                  ref={provided.innerRef}
                  className="itemsList"
                  {...provided.droppableProps}
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.name} index={index}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={{
                            boxShadow: snapshot.isDragging && 'none',
                            color: snapshot.isDragging && '#1E4054',
                            border: snapshot.isDragging && '1px #C2C2C2 solid',
                            ...provided.draggableProps.style,
                          }}
                          {...provided.dragHandleProps}
                          className="itemSideContainer"
                        >
                          <img
                            className="icon"
                            src={item.icon}
                            alt={item.name}
                            style={{ filter: snapshot.isDragging && 'brightness(50%)' }}
                          />
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </>
          <>
            <Droppable droppableId="deleteDrop">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className="trashDrop"
                  {...provided.droppableProps}
                >
                  <div>
                    <img
                      style={{ filter: snapshot.isDraggingOver && 'opacity(0%)' }}
                      className="icon"
                      src="https://res.cloudinary.com/do7bnejaz/image/upload/v1690143344/Icons/trash_apk9zj.png"
                      alt="Trash"
                    />
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </>
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
