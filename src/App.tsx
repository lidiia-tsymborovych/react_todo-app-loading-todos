import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/TodoErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { FilterParams } from './types/FilterParams';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.loadingUnable))
      .finally(() => setIsLoading(false));
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterParams.Active:
        return !todo.completed;
      case FilterParams.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const allTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const resetError = () => setErrorMessage('');

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: allTodosCompleted && Boolean(todos.length),
            })}
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

        {!isLoading && <TodoList todos={visibleTodos} />}

        {Boolean(todos.length) && (
          <TodoFooter todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={resetError}
        setError={setErrorMessage}
      />
    </div>
  );
};
