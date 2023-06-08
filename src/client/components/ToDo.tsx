import { Task } from "../data";
import burgerMenu from "../public/burger-menu.svg";

interface Props {
  task: Task;
  deleteToDo: (id: string) => void;
  updateToDo: (id: string, newDescription: string) => void;
  calculateStatus: (dueDateWithDefault: string) => boolean;
  updateDueDate: (id: string, newDueDate: string) => void;
  updateDescription: (id: string, newDescription: string) => void;
  starToDo: (id: string) => void;
}

export function ToDo(props: Props) {
  const {
    task,
    deleteToDo,
    updateToDo,
    calculateStatus,
    updateDueDate,
    updateDescription,
    starToDo,
  } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToDo(task.id, e.target.value);
  };

  return (
    <>
      <div className="burger-menu">
        <img src={burgerMenu} alt="drag here" />
      </div>

      <div onClick={() => starToDo(task.id)}>
        <p
          className={task.starred === true ? "star-highlight" : "star-default"}
        >
          &#9733;
        </p>
      </div>

      <button
        className="delete-button"
        onClick={() => {
          deleteToDo(task.id);
        }}
      >
        &#8722;
      </button>

      <input type="text" value={task.title} onChange={onChange}></input>

      <p>
        Description:{" "}
        <input
          type="text"
          value={task.description}
          onChange={(e) => updateDescription(task.id, e.target.value)}
        />
      </p>

      <p>
        Status:
        <span
          className={
            calculateStatus(task.dueDate) ? "status-good" : "status-late"
          }
        >
          &#9679;
        </span>
      </p>

      <div className="due-date">
        <span>
          <p>Due Date:</p>
        </span>
        <input
          type="date"
          className="update-date-input"
          onChange={(e) => updateDueDate(task.id, e.target.value)}
          value={task.dueDate}
        />
      </div>
    </>
  );
}
