"use client";

import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "./QueryProvider/Provider";
import Toast from "./components/Toast";
import { useLogoutModal } from "./hook/useModal";
import LogoutModal from "./components/Modal/LogoutModal";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const logoutModal = useLogoutModal();
  return (
    <html lang="en">
      <head>
        <title>Chatter App</title>
        <link rel="icon" href="/logo.jpg" />
        <meta name="description" content="A Chattable App" />
      </head>
      <SessionProvider>
        <Providers>
          <body className={inter.className}>
            <Toast />
            {children}
            {logoutModal.isOpen && <LogoutModal />} </body>
        </Providers>
      </SessionProvider>
    </html>
  );
}
