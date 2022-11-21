import { useState, useEffect, } from "react";
import { getAuth, signInWithEmailAndPassword, FacebookAuthProvider,signInWithPopup,GithubAuthProvider,GoogleAuthProvider, } from "firebase/auth";
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

    const facebookloginHandler = () =>{
        const provider = new FacebookAuthProvider();
        provider.addScope("email, user_birthday")
        // firebase.auth().useDeviceLanguage();
        provider.setCustomParameters({
            'display': 'popup'
          });
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;
                console.log("User", user)

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                navigate("/")

            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);
                console.log("Facebook Error")

                
            });



    }

    const githubloginHandler = () =>{
        const provider = new GithubAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                // navigate("/")

                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                console.log("Git Error")

            });


    }

    const googleloginHandler = () =>{
        const provider = new GoogleAuthProvider();
        // provider.setCustomParameters({
        //     'login_hint': 'user@example.com'
        //   });

        const auth = getAuth();
            signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    const user = result.user;
                    navigate("/")

                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    console.log("Google Error")

                });


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


                    <button type="submit" className="log">Log In</button>
                </form>
                <div className="login-methods">
                    < button onClick={facebookloginHandler}>Sign In With Facebook</button>
                    <button onClick={githubloginHandler}>Sign In With Github</button>
                    <button onClick={googleloginHandler}>Sign In With Google</button>
                    

                </div>
            </div>
            

        </div>
    )

}

export default Login