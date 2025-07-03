export enum TodoStatus {
  TODO = 'TODO',
  COMPLETED = 'COMPLETED',
}

export type Todo = {
  _id?: string;

  title: string;
  description: string;
  status: TodoStatus;

  createdAt?: Date;
  updatedAt?: Date;
};
