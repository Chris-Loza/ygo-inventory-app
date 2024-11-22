import { useRef, useState } from "react";
import "./login.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import upload from "../../lib/upload";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Login = ({ onRegister }) => {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (avatar.file === null) {
      toast.error("Please provide a Profile Picture!");
    } else {
      const formData = new FormData(e.target);
      const { username, email, password } = Object.fromEntries(formData);

      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const imageURL = await upload(avatar.file);

        await setDoc(doc(db, "users", res.user.uid), {
          username,
          email,
          avatar: imageURL,
          id: res.user.uid,
          wishlist: [],
          inventory: [],
        });

        onRegister();

        toast.success("Account Created!");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    setLoading(false);
  };

  const handleScrollIntoView = (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth" });
    }, 100)
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="content">
        <h2>Sign In</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="content" >
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img
              src={avatar.url || "/images/AddPhotoAlternateNoFill.svg"}
              alt="user avatar"
            />
            Upload an Image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" onFocus={handleScrollIntoView} />
          <input type="text" placeholder="Email" name="email" onFocus={handleScrollIntoView} />
          <input type="password" placeholder="Password" name="password" onFocus={handleScrollIntoView} />
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
