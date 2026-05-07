interface WavyDividerProps {
  fill?: string
  flipY?: boolean
  className?: string
}

/**
 * SVG wavy divider used between sections.
 * @param fill - Tailwind fill color via hex (default teal)
 * @param flipY - if true, the wave points upward
 */
export default function WavyDivider({
  fill = '#fef9f1',
  flipY = false,
  className = '',
}: WavyDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${className}`}
      style={{ transform: flipY ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-16"
      >
        <path
          d="M0 60H1440V30C1200 60 960 0 720 0C480 0 240 60 0 30V60Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
