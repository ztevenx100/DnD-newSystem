import { SVGProps } from "react"
const SvgTaskList = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M4 4h5a1 1 0 0 0 0-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2a1 1 0 1 0-2 0v2H4V4Zm11.207-1.707a1 1 0 0 0-1.414 0L8.5 7.586l-.793-.793a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.414 0l6-6a1 1 0 0 0 0-1.414Z"
    />
  </svg>
)
export default SvgTaskList;
