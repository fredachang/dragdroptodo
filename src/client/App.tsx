import "./App.css";
import { Container } from "./components/Container";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Column, Task, Tasks, initialData } from "./data";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type TasksArray = Tasks[];

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

export function App() {
  const [data, setData] = useState(initialData);
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

    const copyOfTasks = { ...data.tasks };

    copyOfTasks[parseInt(newTask.id)] = newTask;

    const copyOfColumns = { ...data.columns };

    const copyOfTaskIds = [...data.columns["column-1"].taskIds];

    copyOfTaskIds.push(parseInt(newTask.id));

    copyOfColumns["column-1"].taskIds = copyOfTaskIds;

    const newData = {
      ...data,
      tasks: copyOfTasks,
      columns: copyOfColumns,
    };
    setData(newData);
    setNewToDo("");
  };

  const deleteToDo = (id: string) => {
    const foundColumn = Object.values(data.columns).find((column) =>
      column.taskIds.includes(parseInt(id))
    );
    if (foundColumn) {
      foundColumn.taskIds = foundColumn.taskIds.filter((taskId) => taskId !== parseInt(id));
      const updatedColumns = { ...data.columns };
      updatedColumns[foundColumn.id] = foundColumn;
      const updatedTasks = { ...data.tasks };
      delete updatedTasks[parseInt(id)];
      setData({
        ...data,
        tasks: updatedTasks,
        columns: updatedColumns,
      });
    }
  };

  const updateToDo = (id: string, newDescription: string) => {
    setData((prevData) => {
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
    const sourceCol = data.columns[source.droppableId];
    const destinationCol = data.columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const newColumn = reorderColumn(sourceCol, source.index, destination.index);
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      setData(newState);
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
      ...data,
      columns: {
        ...data.columns,
        [newSourceCol.id]: newSourceCol,
        [newDestinationCol.id]: newDestinationCol,
      },
    };

    setData(newState);
  };

  return (
    <>
      <div className="header">
        <h1>To Do List</h1>
      </div>

      <main>
        <div className="form-container">
          <form onSubmit={(e) => createNewToDo(e)}>
            <input
              type="text"
              placeholder="enter to-do"
              value={newToDo}
              onChange={handleNewToDo}
            ></input>
            <button type="submit">&#43;</button>
          </form>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="body">
            {data.columnOrder.map((columnId: string) => {
              // access the columns
              const column = data.columns[columnId];

              // access the tasks
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <Container
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  deleteToDo={deleteToDo}
                  updateToDo={updateToDo}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>
    </>
  );
}
