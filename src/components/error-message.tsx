export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="border-destructive/50 text-destructive rounded-md border px-3 py-2 text-sm"
    >
      {message}
    </p>
  )
}
