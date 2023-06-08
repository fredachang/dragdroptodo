import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { SingleBoard, Column, Task } from "../data";
import { Container } from "./Container";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "react-use";
import { DatePicker } from "./DatePicker";

import format from "date-fns/format";

interface Props {
  data: SingleBoard;
  deleteBoard: (id: string) => void;
}

const reorderColumn = (
  sourceCol: Column,
  sourceIndex: number,
  destinationIndex: number
) => {
  const taskIds = sourceCol.taskIds;
  const removedTask = taskIds.splice(sourceIndex, 1)[0];
  taskIds.splice(destinationIndex, 0, removedTask);

  const reorderedColumn = {
    ...sourceCol,
    taskIds: taskIds,
  };
  return reorderedColumn;
};

// fn that takes a date and returns a 'yyyy-mm-dd' string

const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export function Board(props: Props) {
  const { data, deleteBoard } = props;
  const [board, setBoard] = useLocalStorage<SingleBoard>(
    `board-${data.id}`,
    data
  );
  const [newToDo, setNewToDo] = useLocalStorage<string>("new-to-do", "");
  const [description, setDescription] = useLocalStorage<string>(
    "description",
    ""
  );

  const [dueDate, setDueDate] = useLocalStorage<string>(
    "due-date",
    formatDate(new Date())
  );

  const boardWithDefault = board ?? data;
  const newToDoWithDefault = newToDo ?? "";
  const descriptionWithDefault = description ?? "";
  const dueDateWithDefault = dueDate ?? formatDate(new Date());

  const handleNewToDo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewToDo(e.target.value);
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  const createNewToDo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask: Task = {
      id: uuidv4(),
      title: newToDoWithDefault,
      description: descriptionWithDefault,
      dueDate: dueDateWithDefault,
      starred: false,
    };

    const copyOfTasks = [...boardWithDefault.tasks];

    copyOfTasks.push(newTask);

    const copyOfColumns = { ...boardWithDefault.columns };

    const copyOfTaskIds = [...boardWithDefault.columns["column-1"].taskIds];

    copyOfTaskIds.push(newTask.id);

    copyOfColumns["column-1"].taskIds = copyOfTaskIds;

    const newData = {
      ...boardWithDefault,
      tasks: copyOfTasks,
      columns: copyOfColumns,
    };
    setBoard(newData);
    setNewToDo("");
    setDescription("");
    setDueDate(new Date().toISOString().slice(0, 10));
  };

  const calculateStatus = (dueDateWithDefault: string) => {
    const currentDate = formatDate(new Date());
    if (dueDateWithDefault < currentDate) {
      return false;
    } else {
      return true;
    }
  };

  const deleteToDo = (id: string) => {
    const columnId = Object.keys(boardWithDefault.columns).find((columnId) =>
      boardWithDefault.columns[columnId].taskIds.includes(id)
    );

    if (columnId) {
      const column = boardWithDefault.columns[columnId];
      const updatedColumn = column.taskIds.filter((taskId) => taskId !== id);
      const updatedColumns = {
        ...boardWithDefault.columns,
        [columnId]: { ...column, taskIds: updatedColumn },
      };
      const updatedTasks = boardWithDefault.tasks.filter(
        (task) => task.id !== id
      );
      setBoard({
        ...boardWithDefault,
        tasks: updatedTasks,
        columns: updatedColumns,
      });
    }
  };

  const updateToDo = (id: string, newTitle: string) => {
    const taskIndex = boardWithDefault.tasks.findIndex(
      (task) => task.id === id
    );
    if (taskIndex !== -1) {
      const updatedTasks = [...boardWithDefault.tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        title: newTitle,
      };
      setBoard({
        ...boardWithDefault,
        tasks: updatedTasks,
      });
    }
  };

  const updateDueDate = (id: string, newDueDate: string) => {
    const taskIndex = boardWithDefault.tasks.findIndex(
      (task) => task.id === id
    );
    if (taskIndex !== -1) {
      const updatedTasks = [...boardWithDefault.tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        dueDate: newDueDate,
      };
      setBoard({
        ...boardWithDefault,
        tasks: updatedTasks,
      });
    }
  };

  const updateDescription = (id: string, newDescription: string) => {
    const taskIndex = boardWithDefault.tasks.findIndex(
      (task) => task.id === id
    );
    if (taskIndex !== -1) {
      const updatedTasks = [...boardWithDefault.tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        description: newDescription,
      };
      setBoard({
        ...boardWithDefault,
        tasks: updatedTasks,
      });
    }
  };

  const starToDo = (id: string) => {
    const taskIndex = boardWithDefault.tasks.findIndex(
      (task) => task.id === id
    );
    if (taskIndex !== -1) {
      const updatedTasks = [...boardWithDefault.tasks];
      const currentStarred = updatedTasks[taskIndex].starred;
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        starred: !currentStarred,
      };
      setBoard({
        ...boardWithDefault,
        tasks: updatedTasks,
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // if user tries to drop in unknown destination (e.g. outside of droppable area)
    if (!destination) return;

    // if user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // if user drops within the same column but in a different position
    const sourceCol = boardWithDefault.columns[source.droppableId];
    const destinationCol = boardWithDefault.columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const newColumn = reorderColumn(
        sourceCol,
        source.index,
        destination.index
      );
      const newState = {
        ...boardWithDefault,
        columns: {
          ...boardWithDefault.columns,
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
      ...boardWithDefault,
      columns: {
        ...boardWithDefault.columns,
        [newSourceCol.id]: newSourceCol,
        [newDestinationCol.id]: newDestinationCol,
      },
    };

    setBoard(newState);
  };

  return (
    <>
      <div className="board-header">
        <h2>{boardWithDefault.title}</h2>
        <button
          className="delete-button"
          onClick={() => {
            deleteBoard(boardWithDefault.id);
          }}
        >
          &#8722;
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={(e) => createNewToDo(e)}>
          <input
            className="new-to-do-input"
            type="text"
            placeholder="enter to-do"
            value={newToDo}
            onChange={handleNewToDo}
          />
          <input
            className="description-input"
            type="text"
            placeholder="enter description"
            value={description}
            onChange={handleDescription}
          />
          <DatePicker
            handleDate={handleDate}
            dueDateWithDefault={dueDateWithDefault}
          />

          <button type="submit">&#43;</button>
        </form>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="column-section">
          {boardWithDefault.columnOrder.map((columnId: string) => {
            // access the columns
            const column = boardWithDefault.columns[columnId];

            // access the tasks
            const tasks = column.taskIds.flatMap((taskId) => {
              return boardWithDefault.tasks.filter(
                (task) => task.id === taskId
              );
            });

            return (
              <Container
                key={column.id}
                column={column}
                tasks={tasks}
                updateToDo={updateToDo}
                deleteToDo={deleteToDo}
                calculateStatus={calculateStatus}
                updateDueDate={updateDueDate}
                updateDescription={updateDescription}
                starToDo={starToDo}
              />
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
}
