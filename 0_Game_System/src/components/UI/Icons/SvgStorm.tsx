import { SVGProps } from "react"
const SvgStorm = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    {...props}
  >
   <title>{"Storm"}</title>
    <path d="M19.11 9.59h-5.4V3.28a1.26 1.26 0 0 0-2.15-.89l-.15.18L4 12.47l-.15.19a1.21 1.21 0 0 0-.21.71 1.27 1.27 0 0 0 1.26 1.26H11v6.09A1.27 1.27 0 0 0 12.21 22a1.25 1.25 0 0 0 1-.49l.08-.1 6.82-9.77.07-.11a1.22 1.22 0 0 0 .19-.66 1.25 1.25 0 0 0-1.26-1.28Zm-6.27 9.12v-6H6.15l5.67-7.57v6.31h6.08Z" />
    <path
      d="M0 0h24v24H0z"
      style={{
        fill: "none",
      }}
    />
  </svg>
)
export default SvgStorm;
