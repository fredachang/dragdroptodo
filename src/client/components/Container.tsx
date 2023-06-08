import { Draggable, Droppable } from "react-beautiful-dnd";
import { Column, Task } from "../data";
import { ToDo } from "./ToDo";

interface Props {
  column: Column;
  tasks: Task[];
  deleteToDo: (id: string) => void;
  updateToDo: (id: string, newDescription: string) => void;
  calculateStatus: (dueDateWithDefault: string) => boolean;
  updateDueDate: (id: string, newDueDate: string) => void;
  updateDescription: (id: string, newDescription: string) => void;
  starToDo: (id: string) => void;
}

export function Container(props: Props) {
  const {
    column,
    tasks,
    deleteToDo,
    updateToDo,
    calculateStatus,
    updateDueDate,
    updateDescription,
    starToDo,
  } = props;

  return (
    <div className="column-container">
      <h2>{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className={
              droppableSnapshot.isDraggingOver ? "column-droppable" : "column"
            }
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task: Task, index: number) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    className={
                      draggableSnapshot.isDragging
                        ? "to-do-item-dragged"
                        : "to-do-item"
                    }
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <ToDo
                      task={task}
                      deleteToDo={deleteToDo}
                      updateToDo={updateToDo}
                      calculateStatus={calculateStatus}
                      updateDueDate={updateDueDate}
                      updateDescription={updateDescription}
                      starToDo={starToDo}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
