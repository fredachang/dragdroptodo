export type Task = {
  id: string;
  description: string;
};

export type Tasks = Record<number, Task>;

export interface Column {
  id: string;
  title: string;
  taskIds: number[];
}

export interface Columns {
  [key: string]: Column;
}

export interface InitialData {
  tasks: Tasks;
  columns: Columns;
  columnOrder: string[];
}

export const initialData: InitialData = {
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
