// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from "./components/Auth/LoginForm";
import Dashboard from "./components/Pages/Dashboard";
import AddData from "./components/Pages/KIB/addData";
import AddDataKir from "./components/Pages/KIR/addDataKir";
import DetailKir from "./components/Pages/KIR/DetailKir";

import ProtectedRoute from "./middleware/ProtectedRoute";
import RoleRoute from "./middleware/RoleRoute";
import GuestRoute from "./middleware/GuestRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDataKib from "./components/Pages/KIB/EditDataKib";
import UpdateKir from "./components/Pages/KIR/UpdateKir";
import AddUser from "./components/Pages/User/AddUser";
import EditUser from "./components/Pages/User/UpdateUser";
import UpdateUser from "./components/Pages/User/UpdateUser";
import Laporan from "./components/Pages/Laporan/laporan";


function App() {
  // const userRole = localStorage.getItem("role"); // ambil role user
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Login */}
        <Route path="/" element={
          <GuestRoute>
          <LoginForm />
          </GuestRoute>
          } />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
                <Dashboard initialMenuId="dashboard" />
            </ProtectedRoute>
          }
        />
        {/* KELURAHAN */}
        <Route
          path="/data-induk"
          element={
            <ProtectedRoute >
              <RoleRoute roles={["admin", "kelurahan"]} userRole={localStorage.getItem("role")}>
                <Dashboard initialMenuId="kib" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-induk/tambah"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin", "kelurahan"]} userRole={localStorage.getItem("role")}>
              <AddData initialMenuId="AddData" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-induk/edit/:id"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin", "kelurahan"]} userRole={localStorage.getItem("role")}>
              <EditDataKib initialMenuId="EditDataKib" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* REPORTS (bisa diakses dua role) */}
        <Route
          path="/laporan-kir"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <Dashboard initialMenuId="reports" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/laporan-kir/tambah"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <AddDataKir initialMenuId="AddDataKir" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kir/:id"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <DetailKir initialMenuId="DetailKir" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laporan-kir/edit/:id"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <UpdateKir initialMenuId="UpdateKir" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* LABEL PRINT */}
        <Route
          path="/label"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <Dashboard initialMenuId="print_labels" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        {/* Laporan */}
         <Route
          path="/laporan"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <Dashboard initialMenuId="laporan" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        {/* USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <Dashboard initialMenuId="user" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tambah"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <AddUser initialMenuId="AddUser" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit/:id"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin"]} userRole={localStorage.getItem("role")}>
              <UpdateUser initialMenuId="UpdateUser" />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
