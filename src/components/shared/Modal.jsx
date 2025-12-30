import { createPortal } from "react-dom";

const Modal = ({ show, setShow, title, save, cancel, children }) => {
    if (!show) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white rounded-xl shadow-lg w-xl overflow-hidden">
            {/* Header */}
            <h2 className="text-lg bg-main text-white p-4">{title}</h2>

            {/* Body */}
            <div className="flex flex-col items-center justify-center w-full p-4 font-light">
            {children}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 p-4 font-light">
            <button
                onClick={cancel}
                className="text-main border border-main bg-white px-3 py-1.5 rounded"
            >
                Cancel
            </button>
            <button
                onClick={save}
                className="bg-main text-white px-3 py-1.5 rounded"
                type="button"
            >
                Submit
            </button>
            </div>
        </div>
        </div>,
        document.getElementById("modal-root")
    );
    };

export default Modal;
