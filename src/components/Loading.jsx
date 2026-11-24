function Loading({ message = 'Loading analysis...' }) {
  return (
    <div className="loading-box" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export default Loading
