import React, { useState } from "react";  
import { Link, useNavigate } from "react-router-dom";  
import axios from "axios";  
import Box from "@mui/material/Box";  
import TextField from "@mui/material/TextField";  
import Button from "@mui/material/Button";  
import "./mycss/signup.css";  

function Login() {  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");  
  const [errorMessage, setErrorMessage] = useState("");  
  const navigate = useNavigate();  

  const handleLogin = async (e) => {  
    e.preventDefault();  

    try {  
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {  
        email: email,  
        password: password,  
      });  

      console.log(response);
      

      if (response.data.token) {  
        console.log("login", response.data);
        
        localStorage.setItem("jsonwebtoken", response.data.token);
        navigate("/");
      }  
    } catch (error) {  
      setErrorMessage("Invalid email or password. Please try again.");
    }  
  };

  return (  
    <div className="SignupFrom">  
      <div className="imageside">  
        <img src="signup.jpg" alt="Signup" />  
      </div>  
      <div className="signupformside">  
        <div className="signform">  
          <img src="images.png" alt="Logo" />  
          <h2>Login</h2>  
          <Box component="form" onSubmit={handleLogin} sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">  
            <TextField  
              label="Email"  
              variant="filled"  
              value={email}  
              onChange={(e) => setEmail(e.target.value)}  
            />  
            <br />  
            <TextField  
              label="Password"  
              type="password"  
              autoComplete="current-password"  
              variant="filled"  
              value={password}  
              onChange={(e) => setPassword(e.target.value)}  
            />  
            <br />  
            <Button type="submit" variant="outlined">Login</Button>  
          </Box>  
          {errorMessage && <p>{errorMessage}</p>}  
          <p>  
            *If you don't have an account <Link to="/signup">Signup</Link>  
          </p>  
        </div>  
      </div>  
    </div>  
  );  
}  

export default Login;  
