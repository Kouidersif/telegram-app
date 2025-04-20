import { Alert as FlowbiteAlert } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAlert } from '../../store/slices/alertSlice';
import { useEffect } from 'react';

export const Alert = () => {
  const { message, type } = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearAlert());
      }, 5000); // Auto dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-999 max-w-md">
      <FlowbiteAlert
        color={type || 'info'}
        onDismiss={() => dispatch(clearAlert())}
      >
        <span className="font-medium">{message}</span>
      </FlowbiteAlert>
    </div>
  );
};