import { useState, useEffect, } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Link,useNavigate,Navigate} from "react-router-dom"
import "./login.css"
import Signup from "../signup/signup"
import signup from "../signup/signup"




function Login(){
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");
    let navigate = useNavigate();


    const loginHandler = (e) =>{
        e.preventDefault();

        const auth = getAuth();
        signInWithEmailAndPassword(auth, logInEmail, logInPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("login successful: ", user);
                let path = `newPath`; 
                alert("Welcome " + auth?.currentUser?.displayName)
                navigate("/")
                // window.location.reload();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("firebase login error: ", errorCode, errorMessage);
            });

    }

    const signUpPageHandler = () =>{
        navigate("/signup")

    }





    return(
        <div className="main-div">
            <div className="sub-div">
                <h1 className="main-head">Login To Continue</h1>

                <form onSubmit={loginHandler}>
                    <input type="email" name="email" placeholder="Enter Your Email"
                    onChange={(e) =>{
                        setLogInEmail(e.target.value)

                    }}
                    />
                    <input type="password"  placeholder="Enter Your Password"
                    onChange={(e) =>{
                        setLogInPassword(e.target.value)

                    }}
                    />
                    
                    <p className="register" onClick={signUpPageHandler}>
                      Didn't have an account?Sign Up</p>


                    <button type="submit">Log In</button>
                </form>
            </div>

        </div>
    )

}

export default Login