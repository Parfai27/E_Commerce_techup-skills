export default function FieldMessage({ error }) {
  if (!error?.message) return null
  return <p className="mt-1 text-sm font-normal text-red-700">{error.message}</p>
}
