import { Sidebar as FlowBiteSidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { Avatar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { getConversationMessages } from "../store/slices/chatSlice";
import telegramLogo from '../assets/images/image.png'
import LogoutModal from "./LogoutModal";
import { useState } from "react";



// eslint-disable-next-line no-unused-vars
export function UserChat({ title, type, unread_count }) {
    return (
        <Avatar img={telegramLogo} rounded>
            <div className="space-y-1 font-medium dark:text-white flex-1">
                <div>{title?.slice(0, 25)}{title?.length > 25 && "..."}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
            </div>
        </Avatar>
    );
}


export default function SideBar() {
    const { tg_ssid } = useSelector((state) => state.user);
    const { conversations, loading } = useSelector((state) => state.chat);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dispatch = useDispatch();
    const handleChatClick = (id) => {
        dispatch(getConversationMessages({ sessionId: tg_ssid, conversationId: id }))
    }
    return (
        <FlowBiteSidebar className="h-full w-96">
            <div className="flex justify-between items-center h-12 mb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white ">
                Conversations
            </h2>
            <button onClick={()=> setShowLogoutModal(!showLogoutModal)} className="text-blue-500 cursor-pointer">
                Logout
            </button>
            </div>
            {
                loading && (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                )
            }
            <SidebarItems>
                <SidebarItemGroup>
                    {
                        conversations?.length > 0 ? conversations?.map((item) => {
                            return (
                                <div role="button"
                                    onClick={() => {
                                        if (!loading) {
                                            handleChatClick(item?.id)
                                        }
                                    }}
                                    className="px-1 flex 
                                cursor-pointer
                                items-center rounded-lg py-2 
                                text-base font-normal 
                                text-gray-900 hover:bg-gray-100 
                                dark:text-white dark:hover:bg-gray-700" key={item?.id}>
                                    <UserChat {...item} />
                                </div>
                            )
                        })
                            :
                            <div className="py-2
                                text-base font-normal
                                text-gray-900 hover:bg-gray-100
                                dark:text-white dark:hover:bg-gray-700">
                                No conversations
                            </div>
                    }
                </SidebarItemGroup>
            </SidebarItems>
            <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(!showLogoutModal)} />
        </FlowBiteSidebar>
    );
}
