import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { SingleBoard, Column, Task, Tasks } from "../data";
import { Container } from "./Container";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type TasksArray = Tasks[];

interface Props {
  data: SingleBoard;
}

const reorderColumn = (sourceCol: Column, sourceIndex: number, destinationIndex: number) => {
  const taskIds = sourceCol.taskIds;
  const removedTask = taskIds.splice(sourceIndex, 1)[0];
  taskIds.splice(destinationIndex, 0, removedTask);

  const reorderedColumn = {
    ...sourceCol,
    taskIds: taskIds,
  };
  return reorderedColumn;
};

export function Board(props: Props) {
  const { data } = props;
  const [board, setBoard] = useState(data);
  const [newToDo, setNewToDo] = useState("");

  const handleNewToDo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewToDo(e.target.value);
  };

  const createNewToDo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask: Task = {
      id: uuidv4(),
      description: newToDo,
    };

    const copyOfTasks = { ...board.tasks };

    copyOfTasks[parseInt(newTask.id)] = newTask;

    const copyOfColumns = { ...board.columns };

    const copyOfTaskIds = [...board.columns["column-1"].taskIds];

    copyOfTaskIds.push(parseInt(newTask.id));

    copyOfColumns["column-1"].taskIds = copyOfTaskIds;

    const newData = {
      ...board,
      tasks: copyOfTasks,
      columns: copyOfColumns,
    };
    setBoard(newData);
    setNewToDo("");
  };

  const deleteToDo = (id: string) => {
    const foundColumn = Object.values(board.columns).find((column) =>
      column.taskIds.includes(parseInt(id))
    );
    if (foundColumn) {
      foundColumn.taskIds = foundColumn.taskIds.filter((taskId) => taskId !== parseInt(id));
      const updatedColumns = { ...board.columns };
      updatedColumns[foundColumn.id] = foundColumn;
      const updatedTasks = { ...board.tasks };
      delete updatedTasks[parseInt(id)];
      setBoard({
        ...board,
        tasks: updatedTasks,
        columns: updatedColumns,
      });
    }
  };

  const updateToDo = (id: string, newDescription: string) => {
    setBoard((prevData) => {
      const updatedTasks = { ...prevData.tasks };
      updatedTasks[parseInt(id)].description = newDescription;
      return {
        ...prevData,
        tasks: updatedTasks,
      };
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // if user tries to drop in unknown destination (e.g. outside of droppable area)
    if (!destination) return;

    // if user drags and drops back in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    // if user drops within the same column but in a different position
    const sourceCol = board.columns[source.droppableId];
    const destinationCol = board.columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const newColumn = reorderColumn(sourceCol, source.index, destination.index);
      const newState = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };
      setBoard(newState);
      return;
    }

    // if the user moves from one column to another
    const sourceTaskIds = [...sourceCol.taskIds];
    const [removed] = sourceTaskIds.splice(source.index, 1);
    const newSourceCol = {
      ...sourceCol,
      taskIds: sourceTaskIds,
    };

    const destinationTaskIds = [...destinationCol.taskIds];
    destinationTaskIds.splice(destination.index, 0, removed);
    const newDestinationCol = {
      ...destinationCol,
      taskIds: destinationTaskIds,
    };

    const newState = {
      ...board,
      columns: {
        ...board.columns,
        [newSourceCol.id]: newSourceCol,
        [newDestinationCol.id]: newDestinationCol,
      },
    };

    setBoard(newState);
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={(e) => createNewToDo(e)}>
          <input
            className="new-to-do-input"
            type="text"
            placeholder="enter to-do"
            value={newToDo}
            onChange={handleNewToDo}
          ></input>
          <button type="submit">&#43;</button>
        </form>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="column-section">
          {board.columnOrder.map((columnId: string) => {
            // access the columns
            const column = board.columns[columnId];

            // access the tasks
            const tasks = column.taskIds.map((taskId) => board.tasks[taskId]);

            return (
              <Container
                key={column.id}
                column={column}
                tasks={tasks}
                updateToDo={updateToDo}
                deleteToDo={deleteToDo}
              />
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
}
