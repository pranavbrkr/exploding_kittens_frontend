import { Box } from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import BaseModal from "./BaseModal";

function AlterModal({ show, alterCards, onAlterCards, onConfirm, onClose }) {
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const updated = [...alterCards];
    const [removed] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, removed);
    onAlterCards(updated);
  };

  return (
    <BaseModal show={show} onClose={onClose}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="alter-deck" direction="horizontal">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ display: 'flex', gap: 2 }}
            >
              {alterCards.map((card, index) => (
                <Draggable draggableId={card + index} index={index} key={card + index}>
                  {(provided, snapshot) => (
                    <img
                      src={`/assets/cards/${card}.jpg`}
                      alt={card}
                      width={200}
                      ref={(node) => {
                        provided.innerRef(node);
                        if (node && node.complete) {
                          const transparentImg = new Image();
                          transparentImg.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                          node.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setDragImage(transparentImg, 0, 0);
                          });
                        } else if (node) {
                          node.onload = () => {
                            const transparentImg = new Image();
                            transparentImg.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
                            node.addEventListener('dragstart', (e) => {
                              e.dataTransfer.setDragImage(transparentImg, 0, 0);
                            });
                          };
                        }
                      }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        borderRadius: 12,
                        boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                        opacity: snapshot.isDragging ? 0.85 : 1,
                        transition: 'transform 0.15s ease',
                      }}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, width: '100%' }}>
        <button
          onClick={onConfirm}
          style={{
            marginTop: 16,
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Confirm Order
        </button>
      </Box>
    </BaseModal>
  );
}

export default AlterModal;
