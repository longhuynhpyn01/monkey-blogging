import { Button } from "components/button";
import { Radio } from "components/checkbox";
import { Field, FieldCheckboxes } from "components/field";
import { Input } from "components/input";
import { Label } from "components/label";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import slugify from "slugify";
import { categoryStatus, userRole } from "utils/constants";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { useAuth } from "contexts/auth-context";

const schema = yup.object({
  name: yup.string().required("Please enter the category name"),
  slug: yup
    .string()
    .required("Please enter the category slug")
    .min(4, "Slug must be at least 4 characters or greater"),
});

const CategoryUpdate = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const [params] = useSearchParams();
  const categoryId = params.get("id");
  const watchStatus = watch("status");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const handleUpdateCategory = async (values) => {
    if (!isValid) return;

    if (userInfo?.role !== userRole.ADMIN) {
      Swal.fire("Failed", "You have no right to do this action", "warning");
      return;
    }

    const newValues = { ...values };
    newValues.slug = slugify(newValues.slug || newValues.name, {
      lower: true,
      trim: true,
    });
    newValues.status = Number(newValues.status);
    const colRef = doc(db, "categories", categoryId);

    try {
      const newCategories = categories.filter(
        (category) => category.slug !== newValues.currentSlug
      );
      const existSlug = newCategories.find(
        (category) => category.slug === newValues.slug
      );
      if (existSlug) {
        toast.error("The category slug already exists!");
      } else {
        await updateDoc(colRef, {
          name: newValues.name,
          slug: newValues.slug,
          status: newValues.status,
        }); // không cập nhật createdAt
        toast.success("Update category successfully!");
        navigate("/manage/category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Update category failed!");
      // toast.error(error.message);
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
    async function fetchData() {
      const colRef = doc(db, "categories", categoryId);
      const singleDoc = await getDoc(colRef);
      reset(singleDoc.data());
      setValue("currentSlug", singleDoc.data().slug);
    }
    fetchData();
  }, [categoryId, reset, setValue]);

  useEffect(() => {
    const colRef = collection(db, "categories");
    onSnapshot(colRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(results);
    });
  }, []);

  if (!categoryId) return null;

  return (
    <div>
      <DashboardHeading
        title="Update category"
        desc={`Update your category id: ${categoryId}`}
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateCategory)}>
        <div className="form-layout">
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
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
                checked={Number(watchStatus) === categoryStatus.APPROVED}
                value={categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                value={categoryStatus.UNAPPROVED}
              >
                Unapproved
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          type="submit"
          kind="primary"
          className="mx-auto w-[200px]"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Update category
        </Button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
