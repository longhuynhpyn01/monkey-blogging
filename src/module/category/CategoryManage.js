import { ActionDelete, ActionEdit, ActionView } from "components/action";
import { Button } from "components/button";
import { LabelStatus } from "components/label";
import { Table } from "components/table";
import { useAuth } from "contexts/auth-context";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  startAfter,
  where,
} from "firebase/firestore";
// import { debounce } from "lodash";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { categoryStatus, userRole } from "utils/constants";

const CATEGORY_PER_PAGE = 1000;

const CategoryManage = () => {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [filter] = useState("");
  const [lastDoc, setLastDoc] = useState(); // lưu document cuối cùng ở mỗi lần ở nhấn load more
  const [total, setTotal] = useState(0); // lưu tổng số lượng danh mục hiện có trong firestore
  const { userInfo } = useAuth();

  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "categories");
      const newRef = filter
        ? query(
            colRef,
            where("name", ">=", filter),
            where("name", "<=", filter + "utf8")
          )
        : query(colRef, limit(CATEGORY_PER_PAGE)); // phương pháp filter theo user nhập sẽ hiển thị kết quả gần đúng
      const documentSnapshots = await getDocs(newRef);
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1]; // document cuối cùng ở lần bấm load more hiện tại

      onSnapshot(colRef, (snapshot) => {
        setTotal(snapshot.size); // lưu số lượng danh mục hiện đã fetch về, đó chính là số lượng category
      });

      onSnapshot(newRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setCategoryList(results);
      });

      setLastDoc(lastVisible);
    }

    fetchData();
  }, [filter]);

  const handleDeleteCategory = async (docId) => {
    if (userInfo?.role !== userRole.ADMIN) {
      Swal.fire("Failed", "You have no right to do this action", "warning");
      return;
    }

    const colRef = doc(db, "categories", docId); // lấy 1 document từ collection categories với docId
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  // const handleInputFilter = debounce((e) => {
  //   setFilter(e.target.value);
  // }, 500);

  const handleLoadMoreCategory = async () => {
    // query kết quả kết tiếp từ lastDoc
    const nextRef = query(
      collection(db, "categories"),
      startAfter(lastDoc || 0),
      limit(CATEGORY_PER_PAGE)
    );

    onSnapshot(nextRef, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategoryList([...categoryList, ...results]); // lấy giá trị loadmore mới concat với list hiện có sẵn
    });

    const documentSnapshots = await getDocs(nextRef);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    setLastDoc(lastVisible);
  };

  useEffect(() => {
    document.title = "Monkey Blogging - Manage category";
  }, []);

  return (
    <div>
      <DashboardHeading title="Categories" desc="Manage your category">
        <Button
          kind="ghost"
          height="60px"
          to="/manage/add-category"
          className={userInfo.role !== userRole.ADMIN ? "hidden" : ""}
        >
          Create category
        </Button>
      </DashboardHeading>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Slug</th>
            {userInfo.role === userRole.ADMIN && <th>Status</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList.length > 0 &&
            categoryList.map((category) => {
              if (
                (userInfo.role !== userRole.ADMIN &&
                  Number(category.status) === categoryStatus.APPROVED) ||
                userInfo.role === userRole.ADMIN
              )
                return (
                  <tr key={category.id}>
                    <td title={category.id}>
                      {category.id?.slice(0, 5) + "..."}
                    </td>
                    <td>{category.name}</td>
                    <td>
                      <span className="italic text-gray-400">
                        {category.slug}
                      </span>
                    </td>
                    {userInfo.role === userRole.ADMIN && (
                      <td>
                        {Number(category.status) ===
                          categoryStatus.APPROVED && (
                          <LabelStatus type="success">Approved</LabelStatus>
                        )}
                        {Number(category.status) ===
                          categoryStatus.UNAPPROVED && (
                          <LabelStatus type="warning">Unapproved</LabelStatus>
                        )}
                      </td>
                    )}

                    <td>
                      <div className="flex items-center gap-x-3 text-gray-500">
                        <ActionView
                          onClick={() => navigate(`/category/${category.slug}`)}
                        ></ActionView>
                        <ActionEdit
                          onClick={() =>
                            navigate(
                              `/manage/update-category?id=${category.id}`
                            )
                          }
                          className={
                            userInfo.role !== userRole.ADMIN ? "hidden" : ""
                          }
                        ></ActionEdit>
                        <ActionDelete
                          onClick={() => handleDeleteCategory(category.id)}
                          className={
                            userInfo.role !== userRole.ADMIN ? "hidden" : ""
                          }
                        ></ActionDelete>
                      </div>
                    </td>
                  </tr>
                );
              return null;
            })}
        </tbody>
      </Table>
      {total > categoryList.length && (
        <div className="mt-10">
          <Button onClick={handleLoadMoreCategory} className="mx-auto">
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryManage;
