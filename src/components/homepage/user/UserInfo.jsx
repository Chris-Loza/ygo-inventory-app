import React, { useEffect, useState } from "react";
import "./userInfo.css";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import upload from "../../../lib/upload";
import { toast } from "react-toastify";

const UserInfo = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [updatedPicture, setUpdatedPicture] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    if (!auth.currentUser) return;
    const fetchUserInfo = async (uid) => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      setCurrentUser(docSnap.data());
    };

    return () => {
      if (!auth.currentUser) return;
      fetchUserInfo(auth?.currentUser.uid);
    };
  }, [auth.currentUser]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedPicture({
        file: file,
        url: URL.createObjectURL(file),
      });

      try {
        const imageURL = await upload(file);

        const docRef = doc(db, "users", auth?.currentUser.uid);
        await updateDoc(docRef, {
          avatar: imageURL,
        });

        setCurrentUser((prevState) => ({
          ...prevState,
          avatar: imageURL,
        }));

        toast.success("Profile Picture Changed!");
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="userInfo">
      <div className="user">
        <label htmlFor="file">
          <img
            src={currentUser?.avatar || "../../../images/UserIconNoFill.svg"}
            alt="User Icon"
          />
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleProfilePicChange}
        />
        <h3>{currentUser?.username}</h3>
      </div>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default UserInfo;
