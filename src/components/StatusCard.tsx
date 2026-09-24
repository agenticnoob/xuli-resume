interface StatusCardProps {
  message: string
}

export default function StatusCard({ message }: StatusCardProps) {
  return (
    <div className="sketch-card bg-card p-8 text-center" role="status">
      <p className="text-tertiary text-sm">{message}</p>
    </div>
  )
}
