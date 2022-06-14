import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "components/input";
import { Label } from "components/label";
import { Field } from "components/field";
import { Button } from "components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "firebase-app/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import InputPasswordToggle from "components/input/InputPasswordToggle";
import slugify from "slugify";
import { userRole, userStatus } from "utils/constants";

const schema = yup.object({
  fullname: yup
    .string()
    .required("Please enter your fullname")
    .min(6, "Your fullname must be at least 6 characters or greater"),
  username: yup
    .string()
    .required("Please enter your username")
    .min(6, "Your username must be at least 6 characters or greater"),
  email: yup
    .string()
    .required("Please enter your email address")
    .email("Please enter valid email address"),
  password: yup
    .string()
    .required("Please enter your password")
    .min(8, "Your password must be at least 8 characters or greater"),
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema), // để validate
    mode: "onChange", // để giải quyết kết quả trả về của isValid luôn false
  });

  const handleSignUp = async (values) => {
    if (!isValid) return;

    const newValues = { ...values };
    newValues.username = slugify(newValues.username || newValues.fullname, {
      lower: true,
      trim: true,
    });

    try {
      const existUser = users.find(
        (user) => user.username === newValues.username
      );
      if (existUser) {
        toast.error("Username already exists!");
      } else {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        await updateProfile(auth.currentUser, {
          displayName: values.fullname,
          photoURL: "",
        });

        // const colRef = collection(db, "users"); // thêm 1 collection vào fireStore

        // có 2 cách để thêm dữ liệu vào Cloud Firestore
        // sử dụng addDoc ở dưới khi thêm vào collection "users" thì sẽ tự động tạo ra id nên có thể sẽ khác với uid của auth currenUser
        // sử dụng setDoc để khi tạo user với id chính là uid của currenUser hoặc có thể ghi đè dữ liệu
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          fullname: newValues.fullname,
          email: newValues.email,
          password: newValues.password,
          username: newValues.username,
          avatar: "",
          description: "",
          status: userStatus.ACTIVE,
          role: userRole.USER,
          createdAt: serverTimestamp(),
        });

        // thêm document vào collection users với id tự động tạo ra
        // await addDoc(colRef, {
        //   fullname: values.fullname,
        //   email: values.email,
        //   password: values.password,
        // });

        toast.success("Register successfully!!!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Can not create new user");
    }
  };

  useEffect(() => {
    const arrErroes = Object.values(errors);
    if (arrErroes.length > 0) {
      toast.error(arrErroes[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);

  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUsers(results);
    });
  }, []);

  useEffect(() => {
    document.title = "Register Page";
  }, []);

  return (
    <AuthenticationPage>
      <form
        className="form"
        onSubmit={handleSubmit(handleSignUp)}
        autoComplete="off"
      >
        <Field>
          <Label htmlFor="fullname">Fullname</Label>
          <Input
            type="text"
            name="fullname"
            placeholder="Enter your fullname"
            control={control}
          />
        </Field>
        <Field>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            placeholder="Enter your username"
            control={control}
          />
        </Field>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            control={control}
          />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <InputPasswordToggle control={control}></InputPasswordToggle>
        </Field>
        <div className="have-account">
          You already have an account? <NavLink to="/sign-in">Login</NavLink>
        </div>
        <Button
          type="submit"
          className="w-full max-w-[300px] mx-auto"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
