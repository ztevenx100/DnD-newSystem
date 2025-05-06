import { SVGProps } from "react"
const SvgTreasure = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <title>{"Treasure"}</title>
    <path
      stroke="#000"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12.498h-7m-11 0h7M7 4.5v14.998M17 4.5v14.998M6.2 19.5h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 17.98 21 17.42 21 16.3v-5.4c0-2.24 0-3.36-.436-4.216a4 4 0 0 0-1.748-1.748C17.96 4.5 16.84 4.5 14.6 4.5H9.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C3 7.54 3 8.66 3 10.9v5.4c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218Zm3.8-9.002h4v4h-4v-4Z"
    />
  </svg>
)
export default SvgTreasure
