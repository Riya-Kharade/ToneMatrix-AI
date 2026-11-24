function TextInput({ value, onChange, placeholder = 'Type your Marathi text here...' }) {
  return (
    <label className="text-input-wrap">
      <textarea
        className="marathi-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={1000}
      />
    </label>
  )
}

export default TextInput