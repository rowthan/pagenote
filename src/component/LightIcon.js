import { h } from 'preact';
import './lightIcon.scss'
export default function LightIcon({colors,run}) {
  return(
    <pagenote-toggle-all data-run={run?'1':''}>
      <svg t="1605017147684" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           p-id="24496" width="20" height="20" fill='#fff'>
        <path
          d="M4.8 460.8C51.2 411.2 144 336 273.6 361.6 443.2 388.8 512 512 512 512s-172.8 8-270.4 156.8c-46.4 78.4-56 171.2-27.2 257.6-16-11.2-30.4-22.4-44.8-35.2C49.6 782.4-11.2 622.4 4.8 460.8z"
          fill={colors[0]||'#fff'} p-id="24497" data-spm-anchor-id="a313x.7781069.0.i46" className="selected"></path>
        <path
          d="M523.2 232c60.8 160-11.2 281.6-11.2 281.6s-94.4-145.6-272-155.2C150.4 358.4 64 395.2 4.8 464 22.4 281.6 134.4 123.2 300.8 48c65.6 14.4 177.6 57.6 222.4 184z"
          fill={colors[1]} p-id="24498" data-spm-anchor-id="a313x.7781069.0.i45" className="selected"></path>
        <path
          d="M760 382.4C651.2 515.2 510.4 512 510.4 512s80-153.6-1.6-312C464 121.6 387.2 65.6 299.2 48 465.6-27.2 659.2-9.6 808 96c19.2 64 40 184-48 286.4z"
          fill={colors[2]} p-id="24499" data-spm-anchor-id="a313x.7781069.0.i44" className="selected"></path>
        <path
          d="M748.8 660.8c-169.6-27.2-238.4-150.4-238.4-150.4s172.8-8 268.8-156.8c46.4-76.8 56-171.2 27.2-256 16 11.2 32 24 46.4 36.8C972.8 241.6 1033.6 400 1019.2 560c-44.8 48-139.2 124.8-270.4 100.8z"
          fill={colors[3]} p-id="24500" data-spm-anchor-id="a313x.7781069.0.i43" className="selected"></path>
        <path
          d="M500.8 792c-60.8-160 11.2-281.6 11.2-281.6s92.8 142.4 270.4 152c91.2 1.6 177.6-36.8 238.4-104-16 182.4-129.6 342.4-297.6 419.2-65.6-16-179.2-57.6-222.4-185.6z"
          fill={colors[4]} p-id="24501" data-spm-anchor-id="a313x.7781069.0.i48" className="selected"></path>
        <path
          d="M212.8 924.8c-20.8-64-40-180.8 46.4-281.6C368 510.4 512 512 512 512s-76.8 152 3.2 310.4c43.2 78.4 120 134.4 208 153.6a505.44 505.44 0 0 1-510.4-51.2z"
          fill={colors[5]||'#fff'} p-id="24502" data-spm-anchor-id="a313x.7781069.0.i47" className="selected"></path>
      </svg>
    </pagenote-toggle-all>

  )
}
