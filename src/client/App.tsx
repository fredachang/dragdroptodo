import "./App.css";
import { SingleBoard, initialData } from "./data";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Board } from "./components/Board";
import { Link, Route, Routes } from "react-router-dom";

export function App() {
  const [boards, setBoards] = useState(initialData);

  return (
    <>
      <div className="left-panel">
        <h1>To Do List</h1>
        {boards.map((board) => (
          <ul key={board.id}>
            <Link to={`/board/${board.id}`}>{board.title}</Link>
          </ul>
        ))}
      </div>

      <main className="right-panel">
        <Routes>
          {boards.map((board) => (
            <Route
              key={board.id}
              path={`/board/${board.id}`}
              element={<Board key={board.id} data={board} />}
            />
          ))}
        </Routes>
      </main>
    </>
  );
}
