export default function ErrorMessage({ message }) {
  return (
    <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">{message}</div>
  )
}
