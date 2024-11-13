import { useEffect, useState } from "react";
import "./App.css";
import Homepage from "./components/homepage/Homepage";
import Login from "./components/login/Login";
import Notifications from "./components/notifications/Notifications";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./lib/firebase.js";
import { GlobalStateProvider } from "./lib/globalState.jsx";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  const handleSuccessfulRegistration = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }

      setIsLoadingUserData(false);
    });

    return () => {
      unSub();
    };
  }, []);

  return (
    <GlobalStateProvider>
      <div className="container">
        {isLoadingUserData ? (
          <Login onRegister={handleSuccessfulRegistration} />
        ) : isLoggedIn ? (
          <Homepage />
        ) : (
          <Login onRegister={handleSuccessfulRegistration} />
        )}
        {/* <div className="myLinks">Created and Developed by Christian Loza </div> */}
        <Notifications />
      </div>
    </GlobalStateProvider>
  );
}

export default App;
