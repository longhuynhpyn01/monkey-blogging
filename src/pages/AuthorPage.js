import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import PostItem from "module/post/PostItem";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AuthorPage = () => {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "users"),
        where("username", "==", params.username)
      );
      onSnapshot(docRef, (snapshot) => {
        snapshot.forEach((doc) => {
          setUser({ id: doc.id, ...doc.data() });
        });
      });
    }
    fetchData();
  }, [params.username]);

  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("user.username", "==", params.username)
      );
      onSnapshot(docRef, (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(results);
      });
    }
    fetchData();
  }, [params.username]);

  useEffect(() => {
    if (user?.fullname) document.title = `Monkey Blogging - ${user?.fullname}`;
  }, [user.fullname]);

  if (user && Object.keys(user).length === 0) {
    return null;
  }

  return (
    <Layout>
      <div className="container">
        <div className="py-10">
          <div className="flex gap-8 mb-0 md:mb-10 flex-col md:flex-row">
            <img
              src={user?.avatar ? user.avatar : "/AvatarNotFound.svg"}
              className={`max-w-full aspect-square w-[350px] md:h-[350px] object-cover rounded-full mx-auto md:mx-0 flex-shrink-0 
            ${user?.avatar ? "" : "shadow-type1"}`}
              alt=""
            />
            <div className="mt-8 mb-0 md:mx-8 md:mb-5">
              <h1 className="text-center text-5xl font-bold mb-10">
                {user?.fullname}
              </h1>
              <Heading>Biography</Heading>
              <p className="text-lg mx-auto mb-5">
                {user?.description
                  ? user.description
                  : `We don't have a description for ${user.fullname}.`}
              </p>
            </div>
          </div>
          <div className="pt-0 md:pt-10">
            <Heading>Personal Details</Heading>
            <div className="personal-detail">
              <h2 className="text-base font-bold leading-loose">
                Full Name:{" "}
                <span className="text-base font-normal">{user?.fullname}</span>
              </h2>
              <h2 className="text-base font-bold leading-loose">
                Email:{" "}
                <span className="text-base font-normal">{user?.email}</span>
              </h2>
              <h2 className="text-base font-bold leading-loose">
                Username:{" "}
                <span className="text-base font-normal">{user?.username}</span>
              </h2>
              <h2 className="text-base font-bold leading-loose">
                Birthday:{" "}
                <span className="text-base font-normal">{user?.birthday}</span>
              </h2>
              <h2 className="text-base font-bold leading-loose">
                Phone:{" "}
                <span className="text-base font-normal">{user?.phone}</span>
              </h2>
              <h2 className="text-base font-bold leading-loose">
                Role:{" "}
                <span className="text-base font-normal">
                  {user?.role === 1
                    ? "Admin"
                    : user?.role === 2
                    ? "Moderator"
                    : "User"}
                </span>
              </h2>
            </div>
          </div>
          {posts.length > 0 && (
            <div className="pt-5 md:pt-10">
              <Heading>Posts</Heading>
              <div className="grid-layout grid-layout--secondary">
                {posts.map((item) => (
                  <PostItem key={item.id} data={item}></PostItem>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthorPage;
