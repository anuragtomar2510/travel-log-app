import React, {useState} from 'react'
import './Login.css'
import {Room, Cancel} from '@material-ui/icons'
import axios from 'axios'

const Login = ({setShowLogin, setCurrentUser, myStorage}) => {

        
        const [error, setError] = useState(false)
        const [username, setUsername] = useState(null)
        const [password, setPassword] = useState(null)

        const handleSubmit = (e) => {

                e.preventDefault()

                const user = {

                        username,
                        password

                }

                try {

                        axios.post('/api/user/login', user)
                                .then((res) => {

                                        myStorage.setItem('username', res.data.username)
                                        setCurrentUser(res.data.username)
                                        setShowLogin(false)
                                        setError(false)
                                        

                                })
                                .catch(() => setError(true))

                } catch(error) {

                        setError(true)

                }



        }

        return (
                <div className="loginContainer">
                        <div className="logo">
                                <Room />
                                <p>Travel Log App</p>
                        </div>
                        <form className="loginForm" onSubmit={handleSubmit}>
                                <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                                <button type="submit" className="loginBtn">Login</button>
                                {error && (<span className="error">Something went wrong.</span>)} 
                                <Cancel className="loginCancel" onClick={() => setShowLogin(false)}/>        
                        </form>
                        
                </div>
        )
}

export default Login
