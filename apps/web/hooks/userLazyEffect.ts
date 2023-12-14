import {DependencyList, EffectCallback, useCallback, useEffect, useRef} from "react";
import {debounce} from "lodash";

export function useLazyEffect(effect: EffectCallback, deps: DependencyList = [], wait = 300) {
    const cleanUp = useRef<void | (() => void)>();
    const effectRef = useRef<EffectCallback>();
    const updatedEffect = useCallback(effect, deps);
    effectRef.current = updatedEffect;
    const lazyEffect = useCallback(
        debounce(() => {
            cleanUp.current = effectRef.current?.();
        }, wait),
        [],
    );
    useEffect(lazyEffect, deps);
    useEffect(() => {
        return () => {
            cleanUp.current instanceof Function ? cleanUp.current() : undefined;
        };
    }, []);
}
