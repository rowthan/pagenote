
export default function Star(props:{score: number}) {
    return (
        <span>
            {
                new Array(props.score).fill(1).map(function () {
                    return "⭐️"
                })
            }
        </span>
    )
}
