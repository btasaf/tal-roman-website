export default function BokehBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-brand/15 rounded-full blur-3xl" />
    </div>
  )
}
