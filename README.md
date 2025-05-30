# 📔 Diary Series App

A web application that allows users to create, manage, and share personal diary entries grouped into series. Diaries and series can be marked as private or public, giving users full control over their visibility.

---

## 🚀 Features

- User authentication & authorization
- Create & manage diary series
- Add, view, and delete diary entries under a series
- Commenting system on both series and individual diaries
- Like system for diaries
- Series and diaries support rich text formatting with image embeds
- Toggle series privacy (private/public), which automatically updates all related diaries
- Browse other users' public series by clicking on their username

---

## 🔐 Privacy Behavior

- **Series Privacy Controls Diaries:**
  - If a **Series** is marked as **Private**, all **Diaries** under that series will be automatically updated to private.
  - If a **Series** is made **Public**, all its **Diaries** will also be updated to public.
  - This ensures consistent access rules across a series and its contents.
- Only the owner of a series or diary can update or delete it.

---

## 🧑‍💻 Tech Stack

- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Frontend:** EJS, HTML, CSS, JavaScript
- **Database:** MongoDB
- **Editor:** Summernote for rich text input
