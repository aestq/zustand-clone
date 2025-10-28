export type SetStateAction<Value> = ((prev: Value) => Partial<Value>) | Partial<Value>

export type Listener<Value> = (state: Value, prevState: Value) => void;

export type StoreApi<Value> = {
    getInitialState: () => Value;
    getState: () => Value;
    setState: (value: SetStateAction<Value>) => void;
    subscribe: (listener: Listener<Value>) => () => void;
};

export type StateCreator<Value> = (
    set: (action: SetStateAction<Value>) => void,
    get: () => Value,
) => Value;

export const isSetStateActionFunction = <Value>(action: SetStateAction<Value>): action is ((prev: Value) => Partial<Value>) => {
    return typeof action === 'function'
}

export const isStateCreator = <Value>(creator: StateCreator<Value> | Value): creator is StateCreator<Value> => {
    return typeof creator === 'function'
}