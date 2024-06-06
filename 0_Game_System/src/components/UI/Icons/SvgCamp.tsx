import { SVGProps } from "react"
const SvgCamp = (props: SVGProps<SVGSVGElement>) => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlSpace="preserve"
  width={200}
  height={200}
  viewBox="0 0 512 512"
  {...props}
  >
    <title>{"Camp"}</title>
    <path d="M504.267 487.065 274.919 82.978l29.41-58.82c4.119-8.25.782-18.278-7.468-22.403-8.239-4.098-18.272-.777-22.403 7.468l-18.457 36.919-18.457-36.92c-4.119-8.244-14.141-11.566-22.403-7.467-8.25 4.125-11.587 14.153-7.468 22.403l29.41 58.82L7.738 487.066C1.436 498.173 9.472 512 22.26 512h467.484c12.833 0 20.8-13.891 14.523-24.935zM50.935 478.72l18.952-33.503h81.319l13.357 33.503H50.935zm96.158-133.678h84.246l-42.12 105.305-42.126-105.305zm66.782 133.678 42.127-105.428c25.891 64.727 33.825 84.674 42.127 105.428h-84.254zm120.212 0-13.357-33.503h121.388l18.952 33.503H334.087z" />
  </svg>
)
export default SvgCamp