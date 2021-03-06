import Layout from "components/layout/Layout";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import PostCategory from "module/post/PostCategory";
import PostImage from "module/post/PostImage";
import PostMeta from "module/post/PostMeta";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import PageNotFound from "./PageNotFound";
// import parse from "html-react-parser";
import AuthorBox from "components/author/AuthorBox";
import PostRelated from "module/post/PostRelated";
import { useAuth } from "contexts/auth-context";
import { postStatus, userRole } from "utils/constants";
import slugify from "slugify";

const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 40px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      max-width: 75%;
      margin: 40px auto;
      background-color: inherit;
      &-image {
        margin: 0 auto;
        width: 300px;
        height: 300px;
        border-radius: 100rem;
      }
      &-content {
        margin-top: 20px;
        background-color: ${(props) => props.theme.grayF3};
        border-radius: inherit;
      }
    }
  }
  @media screen and (max-width: 767.98px) {
    .author {
      max-width: 85%;
      &-image {
        width: 200px;
        height: 200px;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const colRef = query(collection(db, "posts"), where("slug", "==", slug));
      onSnapshot(colRef, (snapshot) => {
        snapshot.forEach((doc) => {
          doc.data() &&
            setPostInfo({
              id: doc.id,
              ...doc.data(),
            });
        });
      });
    }
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (postInfo?.title)
      document.title = `Monkey Blogging - ${postInfo?.title}`;
  }, [postInfo.title]);

  useEffect(() => {
    // ????? khi nh???n b??i vi???t th?? ch???y l??n tr??n ?????u trang
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);

  const { userInfo } = useAuth();

  if (!slug) return <PageNotFound></PageNotFound>;
  if (!postInfo.title) return null;

  const date = postInfo?.createdAt?.seconds
    ? new Date(postInfo?.createdAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");

  if (
    userInfo.role !== userRole.ADMIN &&
    Number(postInfo.status) !== postStatus.APPROVED
  ) {
    return <PageNotFound></PageNotFound>;
  }

  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={postInfo.image}
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory className="mb-6" to={postInfo.category?.slug}>
                {postInfo.category?.name}
              </PostCategory>
              <h1 className="post-heading">{postInfo.title}</h1>
              <PostMeta
                to={slugify(postInfo?.user?.username || "", { lower: true })}
                authorName={postInfo?.user?.fullname}
                date={formatDate}
              ></PostMeta>
              {userInfo?.role === userRole.ADMIN && (
                <Link
                  to={`/manage/update-post?id=${postInfo?.id}`}
                  className="mt-5 inline-block py-2 px-4 border border-gray-400 rounded-md text-sm"
                >
                  Edit post
                </Link>
              )}
            </div>
          </div>
          <div className="post-content">
            <div
              className="entry-content"
              dangerouslySetInnerHTML={{
                __html: postInfo?.content || "",
              }}
            >
              {/* {parse(postInfo?.content || "")} */}
            </div>
            <AuthorBox userId={postInfo?.user?.id}></AuthorBox>
          </div>
          <PostRelated categoryId={postInfo?.category?.id}></PostRelated>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
