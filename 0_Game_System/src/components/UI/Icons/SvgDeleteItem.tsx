import { SVGProps } from "react"
const SvgDeleteItem = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M8 11h8v2H8z" />
    <path d="M21 4V3h-1V2H4v1H3v1H2v16h1v1h1v1h16v-1h1v-1h1V4h-1zm-1 14h-1v1h-1v1H6v-1H5v-1H4V6h1V5h1V4h12v1h1v1h1v12z" />
  </svg>
)
export default SvgDeleteItem
