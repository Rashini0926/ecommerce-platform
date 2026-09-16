function LoadingSpinner({ size = "sm", text = "Loading" }) {
  return (
    <span className="loading-spinner d-inline-flex align-items-center justify-content-center gap-2">
      <span
        className={`spinner-border spinner-border-${size}`}
        aria-hidden="true"
      ></span>
      <span>{text}</span>
    </span>
  );
}

export default LoadingSpinner;
