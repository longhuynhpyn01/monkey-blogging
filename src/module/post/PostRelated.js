import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { postStatus } from "utils/constants";
import PostItem from "./PostItem";

const PostRelated = ({ categoryId = "" }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let docRef = query(
      collection(db, "posts"),
      where("category.id", "==", categoryId)
    );
    docRef = query(docRef, where("status", "==", postStatus.APPROVED));
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
  }, [categoryId]);

  if (!categoryId || posts.length <= 0) return null;

  return (
    <div className="post-related">
      <Heading>Related posts</Heading>
      <div className="grid-layout grid-layout--primary">
        {posts.map((item) => (
          <PostItem key={item.id} data={item}></PostItem>
        ))}
      </div>
    </div>
  );
};

export default PostRelated;
