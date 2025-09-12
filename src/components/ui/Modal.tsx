import type { ReactNode } from "react";

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
          className="absolute top-2 right-2 text-gray-100 dark:text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          &#x2715; {/* Close button */}
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;
