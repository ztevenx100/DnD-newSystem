import { SVGProps } from "react"
const SvgCharacter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={200}
    height={200}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M8 12h1v1h6v-1h1v-1h1V5h-1V4h-1V3H9v1H8v1H7v6h1v1zm1-5h1V6h1V5h2v1h1v1h1v2h-1v1h-1v1h-2v-1h-1V9H9V7zM19 16v-1h-1v-1H6v1H5v1H4v5h2v-3h1v-1h1v-1h8v1h1v1h1v3h2v-5z" />
  </svg>
)
export default SvgCharacter
