import './App.css'
import {createStore} from "./lib/storeApi.ts";
import {useState} from "react";

interface Store {
    messages: string[]
    actions: {
        addMessage: (message: string) => void
    }
}

const store = createStore<Store>((set) => {
    return {
        messages: [],
        actions: {
            addMessage: (message: string) => {
                set(prev => ({
                    messages: [...prev.messages, message],
                }))
            }
        }
    }
})

function App() {
    const messages = store.use((state) => state.messages)
    const { addMessage } = store.use((state) => state.actions)
    const [value, setValue] = useState('')

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                }}
            >
                <input value={value} onChange={e => setValue(e.target.value)} />
                <button
                    disabled={!value}
                    onClick={() => {
                        addMessage(value)
                        setValue('')
                    }}
                >
                    Add
                </button>
            </div>

            {messages.map((message, index) => (
                <div
                    key={index}
                    style={{
                        padding: '10px',
                        border: '1px solid green',
                    }}
                >
                    {message}
                </div>
            ))}
        </div>
    )
}

export default App
