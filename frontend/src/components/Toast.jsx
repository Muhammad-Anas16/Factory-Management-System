export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`} role="status">
      <span>{message}</span>
      <button type="button" className="icon-button" onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
}
