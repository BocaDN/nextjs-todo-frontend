import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Todo, TodoStatus } from '../types/todo';
import { todoService } from '../services/todo.service';
import Link from 'next/link';
import { Grid } from '@mui/system';

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalState, setModalState] = useState<'closed' | 'edit' | 'create'>(
    'closed',
  );
  const [form, setForm] = useState<Omit<Todo, 'id'>>({
    title: '',
    description: '',
    status: TodoStatus.TODO,
  });
  const [loading, setLoading] = useState(false);

  const getAllTodos = async () => {
    try {
      setLoading(true);
      setTodos(await todoService.getAll());
    } catch (error) {
      console.error('Failed to fetch todos', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTodos().then();
  }, []);

  const handleSaveTodo = async (): Promise<void> => {
    setLoading(true);
    try {
      if (form._id) {
        const { _id, ...updateData } = form;
        await todoService.update(_id, updateData);
      } else {
        await todoService.create(form);
      }
      await getAllTodos();
      closeModal();
    } catch (err) {
      console.error('Failed to save todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id?: string): Promise<void> => {
    if (!id) return console.error('Missing todo ID!');
    setLoading(true);
    try {
      await todoService.delete(id);
      await getAllTodos();
    } catch (err) {
      console.error('Failed to delete todo', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (todo: Todo) => {
    try {
      await todoService.update(todo._id, {
        status:
          todo.status === TodoStatus.TODO
            ? TodoStatus.COMPLETED
            : TodoStatus.TODO,
      });
      await getAllTodos();
    } catch (err) {
      console.error('Failed to toggle todo');
    }
  };

  const openModal = (todo?: Todo) => {
    setForm({
      _id: todo?._id ?? '',
      title: todo?.title ?? '',
      description: todo?.description ?? '',
      status: todo?.status ?? TodoStatus.TODO,
    });
    setModalState(todo ? 'edit' : 'create');
  };

  const closeModal = () => {
    setModalState('closed');
    setForm({ title: '', description: '', status: TodoStatus.TODO });
  };

  return (
    <Grid p={10}>
      <Typography variant="h4" gutterBottom>
        My Todos
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button variant="contained" onClick={() => openModal()}>
          Create Todo
        </Button>
        {loading && <CircularProgress size={24} />}
        <Link href="/" passHref>
          <Button variant="text" color="primary">
            Get Back Home
          </Button>
        </Link>
      </Stack>

      <List>
        {todos.map((todo) => (
          <ListItem key={todo._id} divider>
            <Checkbox
              checked={todo.status === TodoStatus.COMPLETED}
              onChange={() => toggleCompletion(todo)}
            />
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration:
                      todo.status === TodoStatus.COMPLETED
                        ? 'line-through'
                        : 'none',
                  }}
                >
                  {todo.title}
                </Typography>
              }
              secondary={todo.description}
            />
            <IconButton edge="end" onClick={() => deleteTodo(todo._id)}>
              <Delete />
            </IconButton>
            <Button size="small" onClick={() => openModal(todo)}>
              Edit
            </Button>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={modalState !== 'closed'}
        onClose={closeModal}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          {modalState === 'edit' ? 'Edit Todo' : 'Create Todo'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.status === TodoStatus.COMPLETED}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.checked
                        ? TodoStatus.COMPLETED
                        : TodoStatus.TODO,
                    })
                  }
                />
              }
              label="Completed"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveTodo}
            disabled={loading}
          >
            {modalState === 'edit' ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Todos;
