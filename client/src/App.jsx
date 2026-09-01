import AuthPage from "./pages/authPage.jsx";
import { Homepage } from "./pages/homePage.jsx";
import { AppForm } from "./components/applicationForm.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import { Routes, Route, BrowserRouter } from "react-router";
import { useState } from "react";

export default function App() {
  const [updateId, setUpdateId] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    jobTitle: "",
    skill: "",
    link: "",
    status: "",
    note: "",
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route
          path="/home"
          element={
            <Homepage
              setUpdateForm={setUpdateForm}
              setUpdating={setUpdating}
              setUpdateId={setUpdateId}
            />
          }
        ></Route>
        <Route
          path="/addApplication"
          element={
            <AppForm
              updating={updating}
              updateForm={updateForm}
              setUpdateForm={setUpdateForm}
              setUpdating={setUpdating}
              setUpdateId={setUpdateId}
              updateId={updateId}
            />
          }
        ></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
