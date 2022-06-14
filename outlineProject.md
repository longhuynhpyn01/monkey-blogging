<!--
1. Cài đặt Project Boilerplate Monkey Blogging
2. Thiết lập Firebase
- Thiết lập    allow read, write: if request.auth != null;     ở https://console.firebase.google.com/u/0/project/monkey-blogging-64b20/firestore/rules


3. Thiết lập Routes
- import { BrowserRouter } from "react-router-dom"; tại index.js vào wrapper lại App
- Dùng component Routes để wrapper lại ở App.js

4. Viết auth-context để lưu trữ thông tin User

5. Code trang SignUp - UI
- Cài 2 extension là styled-components-snippets, vscode-styled-components
- Sử dụng cấu hình trong jsconfig.json để đưa vị trí gốc về .src

6. Code trang SignUp - React hook form
- npm install @hookform/resolvers
- Sử dụng react-toastify để hiển thị lỗi đẹp hơn
- Thêm
  import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
... và
 <ToastContainer></ToastContainer> dưới <App />
ở trong index.js



7. Code trang SignUp - Authentication với Firebase
8. Sử dụng PropTypes và comment params cho component
- Xem cách viết trong Button.js

9. Login UI
10. Header UI
11. Homepage UI
12. Details UI
13. Dashboard UI
14. Checkbox, radio, toggle

15. Add new post: overview, upload image, delete image, toggle hot, find category
- Cài thư viện slugify để chuyển sang dạng slug (gạch ngang)
- npm i slugify
- có thiết lập lower: false để có thể convert sang chữ thường

- search "firebase upload image" để biết cách upload image
- https://firebase.google.com/docs/storage/web/upload-files

- import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
- const storage = getStorage();

- ở trong handleUploadImage thì thêm:
// Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, "images/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);


16. Display(Pagination, Filter), Add, Update & Delete Category
- để xóa category nhiều khi cần confirm người dùng chắc chắc đã xóa chưa
=> sử dụng sweetalert2
- npm i sweetalert2
- https://sweetalert2.github.io/#examples => chọn "Confirm"-button

17. Display(Pagination, Filter), Add, Update & Delete User
- Cài đặt react pagination để phân trang
- Có thể search firestore pagination để có thể tìm hỗ trợ tốt nhất trong firestore
=> https://firebase.google.com/docs/firestore/query-data/query-cursors

18. Re-analyze database for Post
19. Display, Filter, Add, Update & Delete Post
20. Update post with React quill
- Nên search xem chi tiết
- html-react-parser để parse html code sang text
- search react quill image upload để tìm cách
=> https://codesandbox.io/s/epidw?file=/src/editor.js
-
- cài thêm quill-image-uploader
=> npm install quill-image-uploader

21. Handle upload image in React quill
- để upload file ảnh và lưu hiện ta bên ngoài trang chi tiết
=> vào imgbb, là trang upload ảnh miễn phí

22. Update auth information
23. Optimize source code(PropTypes, logic, error boundary, routes, UI UX...)
- Sử dụng lazy và Suspense để code splitting, giúp cho khi ở trang nào thì tải trang đó chứ không load tất cả từ đầu

24. Congratulations 🎉
-->

<!-- Challenges
- Update profile
- Author Page
- PropTypes
- Error boundary
- UI UX
  -->
