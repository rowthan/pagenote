import Color from 'color';

export default function ColorLines(props:{colors: string[]}) {
    const {colors} = props;
    const sortedColors = colors.sort(function (pre,next) {
        return Color(pre).luminosity() > Color(next).luminosity() ? 1 : -1
    })
    return(
        <div className={'flex'}>
            {
                sortedColors.map(function (color) {
                    const bgColor = Color(color).hsl().toString();
                    const bc = bgColor.substring(4,bgColor.length - 1).replaceAll(',','')
                    return(
                        //@ts-ignore
                        <div key={color} className=''>
                            {/*@ts-ignore*/}
                            <input style={{'--bc':bc}}
                                   type="checkbox"
                                   checked
                                   className="checkbox checkbox-sm" />
                        </div>
                    )
                })
            }
        </div>
    )
}
