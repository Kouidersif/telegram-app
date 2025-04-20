import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { getConversations } from '../store/slices/chatSlice'

const AppLayout = () => {
    const dispatch = useDispatch();
    const { tg_ssid } = useSelector((state) => state.user);
    useEffect(() => {
        if (tg_ssid) {
            dispatch(getConversations(tg_ssid));
        }
    }, [tg_ssid])
    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 h-screen">
            {/* Sidebar */}
            <Sidebar />
            <main className="flex-1  rounded-none h-auto">
                <Outlet />
            </main>
        </div>

    )
}

export default AppLayout