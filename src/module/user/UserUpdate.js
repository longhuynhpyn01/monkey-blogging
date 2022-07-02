import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Field, FieldCheckboxes } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import { Label } from "components/label";
import { Textarea } from "components/textarea";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import useFirebaseImage from "hooks/useFirebaseImage";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userRole, userStatus } from "utils/constants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import slugify from "slugify";
import Swal from "sweetalert2";
import { useAuth } from "contexts/auth-context";

const schema = yup.object({
  fullname: yup
    .string()
    .required("Please enter fullname")
    .min(6, "Fullname must be at least 6 characters or greater"),
  username: yup
    .string()
    .required("Please enter username")
    .min(6, "Username must be at least 6 characters or greater"),
  email: yup
    .string()
    .required("Please enter email address")
    .email("Please enter valid email address"),
  password: yup
    .string()
    .required("Please enter password")
    .min(8, "Your password must be at least 8 characters or greater"),
});

const UserUpdate = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { isValid, isSubmitting, errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      username: "",
      avatar: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: new Date(),
    },
  });
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const userId = params.get("id");
  const watchStatus = watch("status");
  const watchRole = watch("role");
  const [users, setUsers] = useState([]);
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl); // để lấy image name của avatar lưu trên storage
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);
  const { userInfo } = useAuth();

  const handleUpdateUser = async (values) => {
    if (!isValid) return;

    if (userInfo?.role !== userRole.ADMIN) {
      Swal.fire("Failed", "You have no right to do this action", "warning");
      return;
    }

    const newValues = { ...values };
    newValues.username = slugify(newValues.username || newValues.fullname, {
      lower: true,
      trim: true,
    });
    newValues.status = Number(newValues.status);
    newValues.role = Number(newValues.role);

    try {
      const newUsers = users.filter(
        (user) => user.username !== newValues.currentUsername
      );
      const existUser = newUsers.find(
        (user) => user.username === newValues.username
      );

      if (existUser) {
        toast.error("Username already exists!");
      } else {
        if (!image) toast.error("Please choose avatar");
        else {
          const colRef = doc(db, "users", userId);
          await updateDoc(colRef, {
            fullname: newValues.fullname,
            email: newValues.email,
            password: newValues.password,
            username: newValues.username,
            avatar: image,
            description: newValues.description,
            status: newValues.status,
            role: newValues.role,
          });
          toast.success("Update user information successfully!");
          navigate("/manage/user");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Update user failed!");
    }
  };

  // callback để cập nhật giá trị avatar thành rỗng trong database
  async function deleteAvatar() {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }

  // chạy useEffect để lưu url đường dẫn của avatar để có thể truyền vào image ở Thẻ ImageUpload
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      const colRef = doc(db, "users", userId);
      const docData = await getDoc(colRef);
      reset(docData && docData.data());
      setValue("currentUsername", docData.data().username);
    }
    fetchData();
  }, [userId, reset, setValue]);

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
    document.title = "Monkey Blogging - Update user";
  }, []);

  if (!userId) return null;

  return (
    <div>
      <DashboardHeading
        title="Update user"
        desc="Update user information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
          <ImageUpload
            className="!rounded-full h-full"
            onChange={handleSelectImage}
            handleDeleteImage={handleDeleteImage}
            progress={progress}
            image={image}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label htmlFor="fullname">Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
              readOnly={true}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
              readOnly={true}
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
              readOnly={true}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea name="description" control={control}></Textarea>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserUpdate;
