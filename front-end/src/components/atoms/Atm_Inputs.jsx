export default function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  className = ""
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded px-2 py-1 ${className}`}
    />
  );
}