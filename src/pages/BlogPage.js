import Heading from "components/layout/Heading";
import Layout from "components/layout/Layout";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import PostItem from "module/post/PostItem";
import React, { useEffect, useState } from "react";

const CategoryPage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const docRef = collection(db, "posts");
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
  }, []);

  useEffect(() => {
    document.title = "Monkey Blogging - All posts";
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="pt-10"></div>
        <Heading className="capitalize">All Posts</Heading>
        {posts.length > 0 && (
          <div className="grid-layout grid-layout--secondary">
            {posts.map((item) => (
              <PostItem key={item.id} data={item}></PostItem>
            ))}
          </div>
        )}
        {posts.length <= 0 && (
          <div className="text-center text-lg font-medium">
            {`We don't have any posts for this category.`}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
