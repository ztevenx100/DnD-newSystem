import { SVGProps } from "react"
const SvgRest = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    width="1em"
    height="1em"
    {...props}
  >
    <title>{"Rest"}</title>
    <path d="M5 10c-1.652 0-3 1.348-3 3v13.813c1.297-1.125 2.938-2.036 5-2.75V20c0-2.66 4.543-3 8.5-3s8.5.34 8.5 3v2c.336-.004.656 0 1 0s.664-.004 1 0v-2c0-2.66 4.543-3 8.5-3s8.5.34 8.5 3v4.031c2.059.711 3.691 1.64 5 2.782V13c0-1.652-1.348-3-3-3Zm20 14C5.906 24-.016 27.531 0 37h50c.016-9.531-5.906-13-25-13ZM0 39v11h7v-4c0-1.438.563-2 2-2h32c1.438 0 2 .563 2 2v4h7V39Z" />
  </svg>
)
export default SvgRest
