import React, {useState} from 'react'
import './Register.css'
import {Room, Cancel} from '@material-ui/icons'
import axios from 'axios'

const Register = ({setShowRegister}) => {

        const [success, setSuccess] = useState(false)
        const [error, setError] = useState(false)
        const [username, setUsername] = useState(null)
        const [email, setEmail] = useState(null)
        const [password, setPassword] = useState(null)

        const handleSubmit = (e) => {

                e.preventDefault()

                const newUser = {

                        username,
                        email,
                        password

                }

                try {

                        axios.post('/api/user/register', newUser)
                                .then(() => {

                                        setSuccess(true)
                                        setError(false)

                                })
                                .catch(() => setError(true))

                } catch(error) {

                        setError(true)

                }



        }

        return (
                <div className="registerContainer">
                        <div className="logo">
                                <Room />
                                <p>Travel Log App</p>
                        </div>
                        <form className="registerForm" onSubmit={handleSubmit}>
                                <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
                                <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
                                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                                <button type="submit" className="registerBtn">Register</button>
                                {success && (<span className="success">Successfully registered. You can login now.</span>)}
                                {error && (<span className="error">Something went wrong.</span>)} 
                                <Cancel className="registerCancel" onClick={() => setShowRegister(false)}/>        
                        </form>
                        
                </div>
        )
}

export default Register
