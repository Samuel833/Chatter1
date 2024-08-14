"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { useLoginModal } from "../hook/useModal";
import LoginModal from "../components/Modal/LoginModal";

export default function PostLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const loginModal = useLoginModal();
  return <SessionProvider>{children}{loginModal.isOpen && <LoginModal />}</SessionProvider>;
}