import React from 'react'
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";

function addData() {
  return (
    <div>
      <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="print:hidden">
          <Header />
        </div>

        {/* FORM */}
        <main className="p-8 flex-1">
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">
            🌱 Tambah Data KIR
          </h2>

          
        </main>

        <footer className="p-4 text-center text-xs text-gray-500 border-t border-gray-200 print:hidden">
          &copy; 2025 SIMBADA Kecamatan Bandung Kidul. All rights reserved. V1.4.0
        </footer>
      </div>
    </div>
    </div>
  )
}

export default addData
