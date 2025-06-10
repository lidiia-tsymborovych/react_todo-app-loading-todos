import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoErrorNotification } from './components/TodoErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { FilterParams } from './types/FilterParams';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);

  useEffect(() => {
    setError('');
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterParams.Active) {
      return !todo.completed;
    }

    if (filter === FilterParams.Completed) {
      return todo.completed;
    }

    return true;
  });

  const resetError = () => setError('');
  const allTodosCompleted = todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${allTodosCompleted && todos.length > 0 ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList todos={visibleTodos} />

        {todos.length > 0 && (
          <TodoFooter todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>

      <TodoErrorNotification
        errorMessage={error}
        onClose={resetError}
        setError={setError}
      />
    </div>
  );
};
