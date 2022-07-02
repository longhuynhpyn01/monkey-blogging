import { db } from "firebase-app/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AuthorBox = ({ userId = "" }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      const docRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.data()) {
        setUser(docSnapshot.data());
      }
    }
    fetchUserData();
  }, [userId]);

  if (!userId || !user.username) return null;

  return (
    <div className="author">
      <div className="author-image">
        <img src={user?.avatar} alt="user-avatar" />
      </div>
      <div className="author-content">
        <Link to={`/author/${user?.username}`}>
          <h3 className="author-name">{user?.fullname}</h3>
        </Link>
        <p className="author-desc">{user?.description}</p>
      </div>
    </div>
  );
};

export default AuthorBox;
