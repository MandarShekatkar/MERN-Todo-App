import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    // 🔹 State for todos list
    const [todos, setTodos] = useState([]);

    // 🔹 State for input field
    const [title, setTitle] = useState("");

    // 🔹 Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const todosPerPage = 5; // show 5 todos per page

    // 🔹 Pagination logic
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

    // 🔥 IMPORTANT → only these todos will be shown
    const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

    const navigate = useNavigate();

    // 🔹 Fetch todos from backend
    const fetchTodos = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/todos', {
                method: 'GET',
                credentials: "include",
            });
            const data = await res.json();

            if (data.success) {
                setTodos(data.todos);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // 🔹 Run once on page load
    useEffect(() => {
        fetchTodos();
    }, []);

    // 🔹 Add Todo
    const handleAddTodo = async () => {
        if (!title) return;

        try {
            const res = await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ title }),
            });

            const data = await res.json();

            if (data.success) {
                setTitle("");
                setCurrentPage(1); // 🔥 go back to first page
                
            }

        } catch (error) {
            console.log(error);
        }
    };

    // 🔹 Toggle Todo
    const handleToggle = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'PUT',
                credentials: 'include',
            });

            const data = await res.json();

            if (data.success) {
                fetchTodos();
            }

        } catch (error) {
            console.log(error);
        }
    };

    // 🔹 Delete Todo
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'DELETE',
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                fetchTodos();
            }

        } catch (error) {
            console.log(error);
        }
    };

    // 🔹 Logout
    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();

            if (data.success) {
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container'>
            <h1>My Todos</h1>

            {/* 🔹 Input + Add button */}
            <input
                type='text'
                placeholder='Enter Todo'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={handleAddTodo}>Add</button>

            {/* 🔹 Todo List */}
            {todos.length === 0 ? (
                <p>No Todos Yet</p>
            ) : (
                currentTodos.map((todo) => (   // 🔥 USE currentTodos (pagination)
                    <div className="todo" key={todo._id}>

                        {/* 🔹 Todo title */}
                        <span className={todo.completed ? "done" : ""}>
                            {todo.title}
                        </span>

                        {/* 🔹 Action buttons */}
                        <div className="actions">
                            <button onClick={() => handleToggle(todo._id)}>
                                {todo.completed ? "Undo" : "Done"}
                            </button>

                            <button onClick={() => handleDelete(todo._id)}>
                                Delete
                            </button>
                        </div>

                    </div>
                ))
            )}

            {/* 🔹 Pagination Controls */}
            <div className="pagination">

                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <span>Page {currentPage}</span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastTodo >= todos.length}
                >
                    Next
                </button>

            </div>

            {/* 🔹 Logout */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
