import './App.css';
import {useEffect, useState} from "react";

import {loadFromLocalStorage, saveToLocalStorage} from "./utils/localstorage";
import uuidGen from "./utils/uuid";

import Headline from "./components/Headline";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

function App() {
    const [value, setValue] = useState('');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setTasks(loadFromLocalStorage('tds'));
    }, []);

    useEffect(() => {
        saveToLocalStorage('tds', tasks);
    }, [tasks])

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            setTasks([{
                name: value,
                id: uuidGen(),
                status: false
            }, ...tasks]);
            setValue('');
        }
    }


    function handleChangeStatus(id) {
        const newTasks = tasks.map(task => {
            if (task.id === id) {
                task.status = !task.status
            }
            return task
        })

        setTasks(newTasks);
    }

    function handleDeleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id))
    }

    return (
        <div className="App">
            <Headline/>
            <TaskInput
                value={value}
                handleChange={handleChange}
                handleKeyUp={handleKeyUp}
            />
            <TaskList
                tasks={tasks}
                handleChangeStatus={handleChangeStatus}
                handleDeleteTask={handleDeleteTask}
            />
        </div>
    );
}

export default App;
