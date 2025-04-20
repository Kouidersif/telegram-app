import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import Button from "./ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { LogoutUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LogoutModal({ open, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tg_ssid, accessToken } = useSelector((state) => state.user);
    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }
    }, [accessToken])
    const handleLogout = async () => {
        dispatch(LogoutUser(tg_ssid));
        onClose();
    }

    if (!open) return null;
    return (
        <>
            <Modal show={open} size="md" onClose={() => onClose()} popup>
                <ModalHeader />
                <ModalBody>
                    
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-200">
                            Are you sure you want to log out? This will end your platform and Telegram sessions.
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => onClose()} textContent={"No, cancel"} />
                            <Button color="gray" onClick={() => handleLogout()} textContent={"Yes, I'm sure"} />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}
