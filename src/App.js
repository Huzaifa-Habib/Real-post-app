import './App.css';
import {Route,Routes,Link,Navigate} from "react-router-dom"
import Home from "./components/home/home"
import Login from "./components/login/login"
import Signup from "./components/signup/signup"
import {useState, useEffect} from "react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  
  useEffect(() => {

    const auth = getAuth();
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        const uid = user.uid;
        console.log("auth change: login", user);
        setIsLogin(true)

      } else {
        console.log("auth change: logout");
        // User is signed out
        setIsLogin(false)

      }
    });

    return () => {
      console.log("Cleanup function called")
      unSubscribe();
    }

  }, [])




  return (
    <div>
     { (isLogin == true) ?
      <div>
        

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="*" element={<Signup/>}/>



        </Routes>
        
    
      </div>
      :
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="*" element={<Login/>}/>
        </Routes>
       



      </div>
      }



      
    </div>
      
  );
}

export default App;
