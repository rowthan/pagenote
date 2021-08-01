import { h } from 'preact';
import './lightIcon.scss'
export default function LightIcon({colors,run}) {
  const length = colors.length;
  return(
    <pagenote-toggle-all data-run={run?'1':''}>
      <svg t="1619246738331" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="20138" width="16" height="16">
        <path
            d="M48.9 729.5c0-208.8 179.9-353.6 352-394.7V260c0.1-39.7 25.7-75 64-88.2v-131c0-17.2 14.3-31.3 32-31.3s32 14.1 32 31.3v131c38.3 13.1 63.9 48.5 64 88.2v74.7c172.1 40.7 352 184.4 352 394.8h-896z m448 219.2c-88.4 0-160-70.1-160-156.5h320c0 86.4-71.7 156.5-160 156.5z"
            p-id="20139" fill="#ffffff"></path>
      </svg>
    </pagenote-toggle-all>

  )
}
