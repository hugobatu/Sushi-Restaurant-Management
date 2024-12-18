'use client';

import React, { useState } from 'react';

import { Button } from "@/components/ui/button"

type addStaffPropTypes = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const AddStaffModal: React.FC<addStaffPropTypes> = ({ open, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}
      onClick={onClose}
    >
        <div
          className={`bg-white rounded-lg shadow p-6 transition-all max-w-md 
          ${open ? "scale-100 opacity-100" : "scale-110 opacitiy-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
        {children}
      </div>
    </div>
  )
};
export default AddStaffModal;