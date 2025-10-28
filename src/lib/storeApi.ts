import {
    type Listener,
    type StateCreator,
    type StoreApi,
    type SetStateAction,
    isSetStateActionFunction, isStateCreator
} from "./types.ts";
import {useSyncExternalStore} from "react";

export const createStore = <Value>(createState: StateCreator<Value> | Value) => {
    let state: Value
    const listeners: Set<Listener<Value>> = new Set()

    const setState: StoreApi<Value>["setState"] = (action: SetStateAction<Value>) => {
        const nextState = isSetStateActionFunction<Value>(action) ? action(state) : action;

        if (!Object.is(nextState, state)) {
            const prevState = state

            const isNoObject = typeof nextState !== "object" || nextState === null

            state = isNoObject ? nextState : Object.assign({}, state, nextState)

            listeners.forEach(listener => listener(state, prevState))
        }
    }

    const subscribe: StoreApi<Value>["subscribe"] = (listener: Listener<Value>) => {
        listeners.add(listener);

        return () => {
            listeners.delete(listener)
        }
    };

    const getState: StoreApi<Value>["getState"] = () => state

    if (isStateCreator<Value>(createState)) {
        state = createState(setState, getState);
    } else {
        state = createState;
    }

    const useStore = <Selected>(selector: (state: Value) => Selected) => {
        return useSyncExternalStore(subscribe, () => selector(getState()))
    }

    return {
        getState,
        setState,
        subscribe,
        use: useStore,
    };
}