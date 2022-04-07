import './App.scss';
import {useEffect, useState} from "react";

import {collection, doc, writeBatch, onSnapshot} from "firebase/firestore";

import Headline from "./components/Headline";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import {db} from "./firebase";

function App() {
    const [tasks, setTasks] = useState([]);
    const [selection, setSelection] = useState('all');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
            setTasks(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })))
        });

        return () => {
            unsubscribe();
        }
    }, []);

    async function handleDeleteDone() {
        const batch = writeBatch(db);
        tasks.forEach(task => {
            if (task.status) {
                const ref = doc(db, 'todos', task.id);
                batch.delete(ref);
            }
        })

        await batch.commit();
    }

    return (
        <div className="App">
            <Headline/>
            <div className="container">
                <TaskInput/>
                {tasks.length === 0 ? ('') : (
                    <>
                        <TaskList
                            tasks={tasks}
                            selection={selection}
                        />

                        <div className="utils">
                            {/*TODO move to separate component */}
                            <p>{tasks.filter((e) => !e.status).length} items left</p>

                            {/*TODO move to separate component */}
                            <div>
                                <button onClick={() => setSelection('all')}
                                        className={selection === 'all' ? 'active' : ''}>All
                                </button>
                                <button onClick={() => setSelection(false)}
                                        className={selection === false ? 'active' : ''}>Active
                                </button>
                                <button onClick={() => setSelection(true)}
                                        className={selection === true ? 'active' : ''}>Completed
                                </button>
                            </div>

                            {/*TODO move to separate component */}
                            <div>
                                {tasks.filter((e) => e.status).length > 0 ? (
                                    <button onClick={handleDeleteDone}>Clear Completed</button>) : ('')}
                            </div>
                        </div>
                    </>)
                }
            </div>
        </div>
    );
}

export default App;
