import { Draggable, Droppable } from "react-beautiful-dnd";
import { Column, Task } from "../data";
import { ToDo } from "./ToDo";

interface Props {
  column: Column;
  tasks: Task[];
  deleteToDo: (id: string) => void;
  updateToDo: (id: string, newDescription: string) => void;
}

export function Container(props: Props) {
  const { column, tasks, deleteToDo, updateToDo } = props;
  return (
    <div className="column-container">
      <h2>{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className={droppableSnapshot.isDraggingOver ? "column-droppable" : "column"}
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task: Task, index: number) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    className={draggableSnapshot.isDragging ? "to-do-item-dragged" : "to-do-item"}
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <ToDo
                      id={task.id}
                      description={task.description}
                      deleteToDo={deleteToDo}
                      updateToDo={updateToDo}
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
