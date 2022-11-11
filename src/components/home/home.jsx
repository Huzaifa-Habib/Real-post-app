import './home.css';
import {useState, useEffect} from "react"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc,getDocs,doc, onSnapshot,query,serverTimestamp
        , orderBy, limit, deleteDoc,updateDoc,getDoc
      } 
 from "firebase/firestore"; 
import moment from "moment"
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {Routes, Route, Link,useNavigate} from "react-router-dom"
import Login from "../login/login"
import Signup from "../signup/signup"
import {getAuth,  createUserWithEmailAndPassword,onAuthStateChanged, signOut,sendPasswordResetEmail  } from "firebase/auth"
import logout from "../../assest/logout.png"
import deletee from "../../assest/delete.png"
import edit from "../../assest/edit.png"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import { Button,Modal } from 'bootstrap';
import accountImg from "../../assest/account.png"
import reset from "../../assest/reset.png"




const firebaseConfig = {
    apiKey: "AIzaSyCJzLmYvoQ-yuvsdEIyNkOTlKS5MXt6f10",
    authDomain: "posts-app-with-database.firebaseapp.com",
    projectId: "posts-app-with-database",
    storageBucket: "posts-app-with-database.appspot.com",
    messagingSenderId: "645970223404",
    appId: "1:645970223404:web:ab9b476b8e9686d3a24c89",
    measurementId: "G-K1GHTW8D2F" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);





function Home() {
  const [aboutPost, setAboutPost] = useState("");
  const [posts, setPosts] = useState([]);
  const[file,setFile] = useState(null)
  const [editing, setEditing] = useState({
    editingId : null,
    editingTxt: ""
  }) 

  const[userProfile, setUserProfile] = useState(null)
  const[userEmail, setUsersEmail] = useState(null)
  const[userName, setUserName] = useState(null)

  const navigate = useNavigate();





  const logOutHandler =async () =>{
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("signout successful");
      alert("You are successfully logout")
      navigate("/")
      // window.location.reload()
    }).catch((error) => {
      // An error happened.
      console.log("signout failed");
    });




  }


  const formik = useFormik({
    initialValues: {
      text: "",
    },
    validationSchema: yup.object({
      

      text: yup
        .string('Please enter your post text')
        .required('Post text is required')
        .min(10, "Please enter at least 10 characters in post")
        .max(300, '300 Characters Allowed'),

    }),
    onSubmit : async (values) =>{


    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", "postImages");
    cloudinaryData.append("cloud_name","dqiraxirr");
    console.log(cloudinaryData);
    axios?.post(`https://api.cloudinary.com/v1_1/dqiraxirr/image/upload/`,
    cloudinaryData,

     {
      headers:{"Content-Type" : "multipart/form-data"}
    })
        .then( async res => {
            
            console.log("from then", res.data);
            console.log("Value", values)
            try {
              const docRef = await addDoc(collection(db, "userPosts"), {
                text: values.text,
                img : res?.data?.url,
                userProfileImg : auth?.currentUser?.photoURL,
                user:auth?.currentUser?.displayName,
                date: serverTimestamp()

              });
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }

            setUserName(auth.currentUser.displayName )
        
        })
        .catch(err => {
            console.log("from catch", err);
        })
   
    },
  });





  
useEffect(() =>{

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "userPosts"));
    querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `,doc.data());
    setPosts((prev) =>{
      let newArray = [...prev,doc.data()  ]
      return(newArray)

    })
  });

  }
  // getData();
  let unsubscribe = null
  const realTimeData = async () =>{
    const q = query(collection(db, "userPosts"), orderBy("date", "desc"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      
      posts.push({id:doc.id, ...doc.data()});
  });

  // if (posts.length !== 0 ) {
      console.log("Post", posts); 
      setPosts(posts)


    
  // }
  });


  


   
  }

  realTimeData();

 


  return () =>{
    console.log("Clean up")
    unsubscribe();
  }
  


},[])

  
  const getPosts = async (e) =>{
    e.preventDefault()
    console.log(aboutPost)
   
    

  }

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "userPosts", postId))

  }


  const updatedPost = async (e) =>{
    e.preventDefault();

    await updateDoc(doc(db, "userPosts", editing.editingId), {
      text: editing.editingTxt
    });

    setEditing({
      editingId: null,
      editingTxt: ""
    }) 
  }

  const resetPass = () =>{
    const auth = getAuth();
    const userEmail = auth.currentUser.email
    // console.log("USer", user.email)
    console.log(auth)
    sendPasswordResetEmail(auth, userEmail)
    .then(() => {
      alert("A link has been sent to your email")
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode,errorMessage)
      // ..
    });


  }

  // For Updatting User profile==========================================================

const auth = getAuth();
const user = auth.currentUser;


  const openProfile = () =>{
    if (user !== null) {
      user.providerData.forEach((profile) => {
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
        setUserName(profile?.displayName)
        setUserProfile(profile?.photoURL)
        setUsersEmail(profile?.email)
        
      });
      }

    }

    const post = () =>{
      const imgInput = document.getElementById("imgInput")
      const txtInput=document.getElementById("txtInput")
      console.log("txt" + txtInput.value)
      imgInput.value = ""
      txtInput.value = ""

    }
      

  




  return (
    <div className='parent-div'>

  <div className="navbar navbar-expand-sm bg-dark navbar-dark">
    <div className="container-fluid">
      <div className='logo'>
            <h2>Post App</h2>


      </div>
      

      <div className='logout'>
          <img src={logout} alt="logout" height="35" width="35" title='logout' onClick={logOutHandler}/>

      </div>
      <div className='reset' >
        <img src={reset} alt="reset password" onClick={resetPass} height = "35" width="35" title='Change Password?'/>

      </div>
      <div className='profileModal'>
    <div className="container mt-3">

  
  <img src={auth?.currentUser?.photoURL} data-bs-toggle="modal" id='profileImg'
  data-bs-target="#myModal" onClick={openProfile} height="35" width="35" title='My Profile' className='profilePic'/>
</div>

<div className="modal" id="myModal">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">

      <div className="modal-header">
        <h2 className='title'>My Profile</h2>
        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div className="modal-body">
       
        <div className='userImage'>
          <img src={userProfile} alt="profileImage"/>

        </div>

        <div className='userInfo'>
          <p>Name: {auth?.currentUser?.displayName}</p>
          <p>Email: {userEmail}</p>

        </div>


      </div>
    </div>
  </div>
</div>


        </div>
      

    </div>
 

      </div>

      {/* End Of */}
      <div className='child-div'>

      <div className='post-input'>
        <form onSubmit={formik.handleSubmit}>
      
          <textarea type="text" name = "text" id='txtInput' value={formik.values.text} onChange={formik.handleChange}
          placeholder = "What's in your mind...?"
           
          />
          <span className='errors'>
              {formik.touched.text && formik.errors.text}
          </span>
          <br />

          <input type="file" name='profilePic' id='imgInput' onChange={(e) => {
            console.log(e.target.files[0])
            setFile(e.target.files[0])

          }}/>
          <br />

          <button type='submit' onClick={post}>Post</button>
        </form>

      </div>

      <div className='display-post'>
      
        {
          posts.map((eachPost,i) => (

            <div className='postText' key={i}>
              <div className='about-post'>
                <div className='avatar'>
                      <img src={eachPost?.userProfileImg} alt="" height="50" width="50"/>
                    

                </div>

                <div className='info'>
                  <p>{eachPost?.user}</p> 
                        <p className='date'> {moment((eachPost?.date?.seconds)? eachPost.date.seconds*1000 : undefined)
                  .format('MMM Do YY,h:mm a')}</p>


                </div>

                  
                <div className='btns'>
                  <img src={deletee} title = "delete post" height="40" width="40" onClick={() =>{
                    deletePost(eachPost?.id)
                  }}/>

                  {(editing.editingId === eachPost?.id)?null : <img src={edit} title = "edit text" height="40" width="40" onClick={() => {
                    setEditing({
                      editingId:eachPost?.id,
                      editingTxt:eachPost?.text
                
                    })
                  }}
                  
                  />}
                </div>



              </div>
                
          
              <p className = "text">{(eachPost.id === editing.editingId)?
              <form onSubmit={updatedPost} className = "update">
                 <input type="text" value={editing.editingTxt} 
                 onChange = {(e) =>{
                  setEditing({...editing, editingTxt: e.target.value})

                 }}/>
                <button type='submit'>Update</button>

              </form>
                :eachPost?.text}</p>
              

              <div className='post-img'>
                 <img src= {eachPost?.img} alt="" height="400" width="450" />


              </div>






            </div>
          ))}

      </div>
      </div>

    </div>
    
    
  );
}

export default Home;