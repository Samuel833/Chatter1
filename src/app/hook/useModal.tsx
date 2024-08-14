// hooks/useModal.ts
import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const createModalHook = () => create<ModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export const useEditModal = createModalHook();
export const useLogoutModal = createModalHook();
export const useLoginModal = createModalHook();
