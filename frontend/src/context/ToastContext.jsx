/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const ToastContext = createContext();

const toastIcons = {
  success: <FaCheckCircle />,
  danger: <FaExclamationCircle />,
  info: <FaInfoCircle />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            className={`app-toast app-toast-${toast.type}`}
            key={toast.id}
            role="status"
          >
            <span className="app-toast-icon">
              {toastIcons[toast.type] || toastIcons.info}
            </span>

            <span className="app-toast-message">
              {toast.message}
            </span>

            <button
              type="button"
              className="app-toast-close"
              aria-label="Close notification"
              onClick={() => removeToast(toast.id)}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
