import { Button } from "components/button";
import { Field } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import { Input } from "components/input";
import { Label } from "components/label";
import { useAuth } from "contexts/auth-context";
import { auth, db } from "firebase-app/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useFirebaseImage from "hooks/useFirebaseImage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Textarea } from "components/textarea";
import { updatePassword } from "firebase/auth";
import InputPasswordToggle from "components/input/InputPasswordToggle";

const schema = yup.object({
  fullname: yup
    .string()
    .required("Please enter your fullname")
    .min(6, "Fullname must be at least 6 characters or greater"),
  username: yup
    .string()
    .required("Please enter your username")
    .min(6, "Username must be at least 6 characters or greater"),
  email: yup
    .string()
    .required("Please enter your email address")
    .email("Please enter valid email address"),
  birthday: yup
    .string()
    .required("Please select your birthday")
    .matches(
      // eslint-disable-next-line no-useless-escape
      /((19|20)\d{2}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01]))/,
      "Please enter the date in the format MM/DD/YYYY"
    ),
  phone: yup
    .string()
    .required("Please select your phone number")
    .matches(
      /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
      "Please enter valid phone number"
    ),
  password: yup
    .string()
    .required("Please enter password")
    .min(8, "Password must be at least 8 characters or greater"),
  confirmPassword: yup.string().required("Please enter comfirm password"),
});

const UserProfile = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, isSubmitting, errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl); // để lấy image name của avatar lưu trên storage
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  async function deleteAvatar() {
    const colRef = doc(db, "users", userInfo.uid);
    await updateDoc(colRef, {
      avatar: "",
    });
  }

  // chạy useEffect để lưu url đường dẫn của avatar để có thể truyền vào image ở Thẻ ImageUpload
  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  useEffect(() => {
    reset({
      fullname: userInfo.fullname,
      email: userInfo.email,
      username: userInfo.username,
      avatar: userInfo?.avatar,
      image_name: userInfo?.image_name || "",
      description: userInfo?.description || "",
      phone: userInfo?.phone || "",
      birthday: userInfo?.birthday || "",
      password: userInfo?.password || "",
      confirmPassword: "",
    });
  }, [userInfo, reset]);

  useEffect(() => {
    const arrErroes = Object.values(errors);
    if (arrErroes.length > 0) {
      toast.error(arrErroes[0]?.message, {
        pauseOnHover: false,
        delay: 0,
      });
    }
  }, [errors]);

  const handleUpdateProfile = async (values) => {
    if (!isValid) return;

    try {
      const newValues = { ...values };
      if (newValues.password !== newValues.confirmPassword) {
        toast.error("Please make sure your passwords match!");
      } else {
        if (!image) toast.error("Please choose avatar");
        else {
          const colRef = doc(db, "users", userInfo.uid);
          const { confirmPassword, ...restValues } = newValues;
          await updateDoc(colRef, {
            ...restValues,
            avatar: image,
          });
          await updatePassword(auth.currentUser, newValues.password);
          toast.success("Update profile information successfully!");
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Update profile failed!");
    }
  };

  return (
    <div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="text-center mb-10">
          <ImageUpload
            className="!w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"
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
              control={control}
              name="fullname"
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              control={control}
              name="username"
              placeholder="Enter your username"
              readOnly={true}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email address"
              readOnly={true}
            ></Input>
          </Field>
          <Field>
            <Label>Date of Birth</Label>
            <Input
              type="date"
              control={control}
              name="birthday"
              placeholder="dd/mm/yyyy"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea name="description" control={control}></Textarea>
          </Field>
          <Field>
            <Label htmlFor="phone">Mobile Number</Label>
            <Input
              control={control}
              type="text"
              name="phone"
              placeholder="Enter your phone number"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label htmlFor="password">New Password</Label>
            <InputPasswordToggle control={control}></InputPasswordToggle>
          </Field>
          <Field>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputPasswordToggle
              control={control}
              name="confirmPassword"
            ></InputPasswordToggle>
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

export default UserProfile;
