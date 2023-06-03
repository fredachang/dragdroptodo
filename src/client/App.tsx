import "./App.css";
import { Boards, SingleBoard, initialData } from "./data";
import { v4 as uuidv4 } from "uuid";
import { Board } from "./components/Board";
import { Link, Route, Routes } from "react-router-dom";
import { useLocalStorage } from "react-use";

export function App() {
  const [boards, setBoards] = useLocalStorage<Boards>("boards", initialData);
  const [boardName, setBoardName] = useLocalStorage<string>("boardName", "");

  const boardsWithDefault: Boards = boards ?? initialData;

  const boardNameWithDefault = boardName ?? "";

  function handleNewBoard(e: React.ChangeEvent<HTMLInputElement>) {
    setBoardName(e.target.value);
  }

  function createNewBoard(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const newBoard: SingleBoard = {
      id: uuidv4(),
      title: boardNameWithDefault,
      tasks: {},
      columns: {
        "column-1": {
          id: "column-1",
          title: "To-Do",
          taskIds: [],
        },
        "column-2": {
          id: "column-2",
          title: "Doing",
          taskIds: [],
        },
        "column-3": {
          id: "column-3",
          title: "Done",
          taskIds: [],
        },
      },
      columnOrder: ["column-1", "column-2", "column-3"],
    };

    const newBoards: Boards = [...boardsWithDefault, newBoard];
    setBoards(newBoards);
    setBoardName("");
  }

  return (
    <>
      <div className="left-panel">
        <h1>To Do List</h1>

        <div>
          <form onSubmit={(e) => createNewBoard(e)}>
            <input
              type="text"
              value={boardNameWithDefault}
              placeholder="Enter new board name"
              onChange={handleNewBoard}
            />
            <button>&#43;</button>
          </form>
        </div>

        {boardsWithDefault.map((board) => (
          <ul key={board.id}>
            <Link to={`/board/${board.id}`}>{board.title}</Link>
          </ul>
        ))}
      </div>

      <main className="right-panel">
        <Routes>
          {boardsWithDefault.map((board) => (
            <Route key={board.id} path={`/board/${board.id}`} element={<Board data={board} />} />
          ))}
        </Routes>
      </main>
    </>
  );
}
