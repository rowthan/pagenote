import { useEffect, useRef } from 'react';
interface Handle<EventType> {
    (e:EventType):void;
}

export default function useEventListener<EventType extends Event>(eventName:string, handler:Handle<EventType>, element:HTMLElement | Window = window) {
    // Create a ref that stores handler
    const savedHandler = useRef<Handle<EventType>>();

    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(
        () => {
            // Make sure element supports addEventListener
            const isSupported = element && element.addEventListener;
            if (!isSupported) return;

            // Create event listener that calls handler function stored in ref
            const eventListener = (event: EventType) => {
                if(savedHandler.current){
                    savedHandler.current(event)
                }
            };

            // Add event listener
            element.addEventListener(eventName, eventListener,{capture: true});

            // Remove event listener on cleanup
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element] // Re-run if eventName or element changes
    );
}
