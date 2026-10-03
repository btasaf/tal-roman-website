// The Tal Roman logo (public/logo.svg) as a CSS mask, so it takes the current text color:
// set the color with a text-* class and the size with a height class (width follows the logo's proportions).
export default function LogoMark({ className = 'h-10 text-[#C34832]', label }: { className?: string; label?: string }) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 aspect-[1312/1199] bg-current [mask:url(/logo.svg)_center/contain_no-repeat] [-webkit-mask:url(/logo.svg)_center/contain_no-repeat] ${className}`}
    />
  )
}
