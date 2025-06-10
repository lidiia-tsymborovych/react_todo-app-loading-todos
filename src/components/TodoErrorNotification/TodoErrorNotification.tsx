import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  onClose: () => void;
  setError: (value: string) => void;
};

export const TodoErrorNotification: React.FC<Props> = ({
  errorMessage,
  onClose,
  setError,
}) => {
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage, setError]);

  return (
    <div
      data-cy="ErrorNotification"
      className={`notification is-danger is-light has-text-weight-normal ${errorMessage ? '' : 'hidden'}`}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClose}
      />
      {errorMessage}
    </div>
  );
};
