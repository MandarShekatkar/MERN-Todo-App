import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            console.log(data);

            if (data.success) {
                navigate('/home');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='container'>
            <h2 >Login</h2>
            <form 
            onSubmit={handleLogin}>
                <input
                    type='email'
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type='password'
                    placeholder='Enter Password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'>Login</button>
                <p>New User ?  <Link to='/register'>Register Here</Link>
                </p>
            </form>
        </div>
    )
}

export default Login
