import type { ReactNode } from "react";
import { RxCross1 } from "react-icons/rx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div
        className="modal-content dark:bg-neutral bg-primary  rounded-lg
                            shadow-lg p-6 max-w-md
                            w-full relative  text-white"
      >
        <button
          className="absolute top-3 right-3 text-gray-100 dark:text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          <RxCross1 size={"20px"} />
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;
