import type { ErrorDetail } from '@/lib/api'

type FieldErrorsProps = {
  details: ErrorDetail[]
  labels: Record<string, string>
}

export function FieldErrors({ details, labels }: FieldErrorsProps) {
  if (details.length === 0) return null

  return (
    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
      {details.map((detail) => (
        <li key={`${detail.path}-${detail.message}`}>
          {labels[detail.path] ?? detail.path}: {detail.message}
        </li>
      ))}
    </ul>
  )
}
