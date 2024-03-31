// @ts-nocheck
import React, {
    forwardRef, useEffect, useImperativeHandle,
    useState,
  } from 'react'
  
// eslint-disable-next-line react/display-name
const MentionList = forwardRef((props: {items: {}[]}, ref) => {
const [selectedIndex, setSelectedIndex] = useState(0)

const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
    props.command({ id: item })
    }
}

const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
}

const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
}

const enterHandler = () => {
    selectItem(selectedIndex)
}

useEffect(() => setSelectedIndex(0), [props.items])

useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
    if (event.key === 'ArrowUp') {
        upHandler()
        return true
    }

    if (event.key === 'ArrowDown') {
        downHandler()
        return true
    }

    if (event.key === 'Enter') {
        enterHandler()
        return true
    }

    return false
    },
}))

return (
    <div className="items">
    {props.items.length
        ? props.items.map((item, index) => (
        <button
            className={`bg-blue-100 m-1 rounded item ${index === selectedIndex ? 'is-selected outline' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
        >
            {item}
        </button>
        ))
        : <div className="item">No result</div>
    }
    </div>
)
})

export default MentionList;