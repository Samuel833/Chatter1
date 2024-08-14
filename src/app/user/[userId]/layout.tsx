"use client"
// app/settings/layout.tsx
import React from 'react';
import { useEditModal } from '../../hook/useModal';
import EditModal from '../../components/Modal/EditModal';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const editModal = useEditModal();

  return (
    <div>
      {children}
      {editModal.isOpen && <EditModal />}
    </div>
  );
}
