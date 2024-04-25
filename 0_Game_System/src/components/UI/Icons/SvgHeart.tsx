import { SVGProps } from "react"
const SvgHeart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <title>{"Heartbeat"}</title>
      <path d="M20.998 9a4.869 4.869 0 0 0-8.31-3.574L12 6.115l-.688-.689a4.869 4.869 0 0 0-6.886 6.886L12 19.885l1.893-1.893" />
      <path d="M9 12.667h2.667l2-2.667 2 5.333 2-2.666H21" />
    </g>
  </svg>
)
export default SvgHeart;
