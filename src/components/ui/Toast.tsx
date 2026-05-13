import { useToast } from '../../hooks/useToast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <button
          className="toast"
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          type="button"
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
