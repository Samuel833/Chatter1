import React from "react";
import { useLogoutModal } from "@/app/hook/useModal";
import Modal from "../Modal";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const LogoutModal: React.FC = () => {
  const router = useRouter();
  const logoutModal = useLogoutModal();

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  return (
    <Modal
      disabled={false}
      title="Log Out"
      actionLabel="Yes"
      deactionLabel="No"
      isOpen={logoutModal.isOpen}
      onClose={logoutModal.onClose}
      onSubmit={handleLogout}
      body={
        <div className="flex flex-col gap-y-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to log out?
          </p>
        </div>
      }
    />
  );
};
export default LogoutModal;
