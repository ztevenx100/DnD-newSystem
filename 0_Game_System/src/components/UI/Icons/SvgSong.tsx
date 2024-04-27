import { SVGProps } from "react"
const SvgSong = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22 22"
    width="1em"
    height="1em"
    {...props}
  >
    <title>{"Song"}</title>
    <path d="M11 2h7v5h-5v11h-1v1h-1v1H7v-1H6v-1H5v-4h1v-1h1v-1h4V2m0 13h-1v-1H8v1H7v2h1v1h2v-1h1v-2Z" />
  </svg>
)
export default SvgSong;
