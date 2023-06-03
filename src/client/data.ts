export type Task = {
  id: string;
  description: string;
};

export type Tasks = Task[];

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Columns {
  [key: string]: Column;
}

export interface SingleBoard {
  id: string;
  title: string;
  tasks: Tasks;
  columns: Columns;
  columnOrder: string[];
}

export type Boards = SingleBoard[];

export const initialData: Boards = [];
