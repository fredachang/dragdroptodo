import burgerMenu from "../public/burger-menu.svg";

interface Props {
  id: string;
  description: string;
  deleteToDo: (id: string) => void;
  updateToDo: (id: string, newDescription: string) => void;
}

export function ToDo(props: Props) {
  const { id, description, deleteToDo, updateToDo } = props;
  return (
    <>
      <div className="burger-menu">
        <img src={burgerMenu} alt="drag here" />
      </div>
      <input
        type="text"
        value={description}
        onChange={(e) => updateToDo(id, e.target.value)}
      ></input>
      <button
        className="delete-button"
        onClick={() => {
          deleteToDo(id);
        }}
      >
        &#8722;
      </button>
    </>
  );
}
