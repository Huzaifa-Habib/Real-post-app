import {useState, useEffect} from "react"
import { getAuth, createUserWithEmailAndPassword,sendEmailVerification, useDeviceLanguage,updateProfile   } from "firebase/auth";
import {Link,useNavigate,Navigate} from "react-router-dom"
// import Login from "/login"
import Axios from "axios";
import "./signup.css"


const namesInput = document.getElementById("nameInput")
const emailInput = document.getElementById("emailInput")
const passInput = document.getElementById("passwordInput")
const fileInput = document.getElementById("fileInput")



    


function Signup(){
    const [userName,setUserName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    let navigate = useNavigate();
    const auth = getAuth();
    const[file,setFile] = useState(null)
    // auth.languageCode = useDeviceLanguage();
    const [usersProfileImage,setUsersProfileImage] = useState(null)


    const signupHandler = (e) =>{
        e.preventDefault();

        if (namesInput !== "" && fileInput !== "") {
            
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential)  => {
                const user = userCredential.user;
        
                sendEmailVerification(auth.currentUser)
                .then(() => {
                    alert("Verification link has been sent to your gmail")
                    const formData = new FormData()
                        formData.append("file",file)
                        formData.append("upload_preset","postImages")
                        Axios.post("https://api.cloudinary.com/v1_1/dqiraxirr/image/upload",formData,{
                            headers:{"Content-Type" : "multipart/form-data"}

                        })
                        .then(async(res)=>{
                            console.log(res?.data?.url)
                            setUsersProfileImage(res?.data?.url)

                            updateProfile(auth.currentUser, {
                                displayName: userName,
                                photoURL: res?.data?.url
                            })
                            
                        })

                       
                    let path = `newPath`; 
                       navigate("/login")
                });     
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("firebase signup error: ", error);
            });

       

            


        }

        else{
            alert("Please Fill Out All Fields!")
        }
 


    }

    const loginPageHandler = () => {
        navigate("/")


    }



    

    return(
        <div className="main-div">
             <div className="sub-div">
             <h1 className="main-head">Register Yourself</h1>
                <form onSubmit={signupHandler}>
                    <input type="text" id="nameInput" name="username" placeholder="Enter Your Username" 
                    onChange={(e) =>{
                        setUserName(e.target.value)

                    }}
                    />

                    <input type="email" id="emailInput" name="email" placeholder="Enter Your Email"
                    onChange={(e) =>{
                        setEmail(e.target.value)

                    }}
                    />
                    <input type="password" id="passwordInput"
                    placeholder="Enter Your Password"
                    onChange={(e) =>{
                        setPassword(e.target.value)

                    }}
                    />
                
                    <input type="file" id="fileInput" name='profilePic' onChange={(e) => {
                    // console.log(e.target.files[0].name)
                    setFile(e.target.files[0])

                    }}/>
                    <p className="register" onClick={loginPageHandler}>
                      Already have an account?Log In</p>

                    <button type="submit">Register</button>


                </form>
            </div>

          

        </div>
    )
}

export default Signup