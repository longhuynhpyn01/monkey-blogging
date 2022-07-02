// import { useAuth } from "contexts/auth-context";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
// import Swal from "sweetalert2";
// import { userRole } from "utils/constants";

export default function useFirebaseImage(
  setValue,
  getValues,
  imageName = null,
  cb = null
) {
  // const { userInfo } = useAuth();
  const [progress, setProgress] = useState(0); // lưu thanh progress khi upload hình ảnh
  const [image, setImage] = useState(""); // lưu đường dẫn image khi upload xong

  if (!setValue || !getValues) return;

  const handleUploadImage = (file) => {
    // if (userInfo?.role !== userRole.ADMIN) {
    //   Swal.fire("Failed", "You have no right to do this action", "warning");
    //   return;
    // }

    const storage = getStorage();
    // Upload file sẽ lưu đường dẫn 'images/mountains.jpg' ở trên firebase Storage
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progressPercent + "% done");

        setProgress(progressPercent);

        // trạng thái hình ảnh khi upload
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            console.log("Nothing at all");
        }
      },
      (error) => {
        console.log("Error", error);
        setImage("");
      },
      () => {
        // Upload completed successfully, now we can get the download URL => khi upload thành công
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          setImage(downloadURL); // lưu image url khi upload thành công
        });
      }
    );
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // gán giá trị file.name cho "image_name" của react-hook-form
    setValue("image_name", file.name);
    handleUploadImage(file);
  };

  // xóa image đang được upload
  const handleDeleteImage = () => {
    // if (userInfo?.role !== userRole.ADMIN) {
    //   Swal.fire("Failed", "You have no right to do this action", "warning");
    //   return;
    // }

    const storage = getStorage();
    const imageRef = ref(
      storage,
      "images/" + (imageName || getValues("image_name"))
    ); // thêm imageName để xóa trong trường hợp sửa ảnh có sẵn trong update user nhưng chưa xóa trong avatar của user
    // nên truyền callback cb vào

    deleteObject(imageRef)
      .then(() => {
        // console.log("Remove image successfully");
        // cập nhật lại image và progress
        setImage("");
        setProgress(0);
        setValue("image_name", "");
        cb && cb(); // cập nhật xóa luôn url trong database
      })
      .catch((error) => {
        console.log("handleDeleteImage ~ error", error);
        console.log("Can not delete image");
        setImage("");
      });
  };

  const handleResetUpload = () => {
    setImage("");
    setProgress(0);
  };

  return {
    image,
    setImage,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleResetUpload,
  };
}
