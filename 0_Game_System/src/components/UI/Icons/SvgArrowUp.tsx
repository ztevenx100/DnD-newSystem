import { SVGProps } from "react"
const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 30 30"
    {...props}
  >
    <path 
      fill={props.fill}
      stroke={props.stroke}
      d="M29.069 22.276a3.988 3.988 0 0 1-3.052 1.409 3.996 3.996 0 0 1-2.587-.949l-8.42-7.152-8.42 7.151a4.001 4.001 0 1 1-5.179-6.099l11.01-9.351a3.997 3.997 0 0 1 5.178 0l11.011 9.351a4.002 4.002 0 0 1 .459 5.64z" 
    />
  </svg>
)
export default SvgArrowUp
