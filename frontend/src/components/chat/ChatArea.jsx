import React, { useEffect } from 'react'
import { Card, Avatar } from 'flowbite-react'
import { useSelector } from 'react-redux'
import telegramLogo from '../../assets/images/image.png'
import Button from '../ui/Button'

// eslint-disable-next-line no-unused-vars
const Message = ({ id, date, text, sender_id, sender_name, is_outgoing }) => {
    if (!id) return null;
    return (
        <div className={`flex ${is_outgoing ? 'justify-end' : 'justify-start'} mb-4`}>
            {!is_outgoing && (
                <Avatar
                    img={telegramLogo}
                    rounded
                    size="sm"
                    className="mr-2 items-start"
                />
            )}
            <div className={`${is_outgoing ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'} space-y-2 rounded-lg px-4 py-2 max-w-[70%]`}>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{sender_name}</span>
                <div>
                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{text}</p>
                    <span className={`text-xs ${is_outgoing ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'} block mt-1`}>
                        {new Date(date).toLocaleString()}
                    </span>
                </div>
            </div>
            {is_outgoing && (
                <Avatar
                    img={telegramLogo}
                    rounded
                    size="sm"
                    className="ml-2 items-start"
                />
            )}
        </div>
    )
}



const ChatArea = () => {
    const { messages, fetchingMessages } = useSelector((state) => state.chat);
    const chatAreaRef = React.useRef(null);
    useEffect(() => {
        if (chatAreaRef.current) {
            const scrollElement = chatAreaRef.current.querySelector('.overflow-y-auto');
            if (scrollElement) {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }
        }
    }, [messages])
    return (
        <Card className="h-full overflow-hidden" ref={chatAreaRef}>
            {
                fetchingMessages && (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                )
            }
            {
                !fetchingMessages && messages?.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">No messages, Please chose a conversation to get started</div>
                    </div>
                )
            }
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4">
                    {messages?.length > 0 && messages?.map((message) => (
                        <Message key={message.id} {...message} />
                    ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            disabled
                            className="flex-grow rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
                            placeholder="Type your message..."
                        />
                        <Button disabled textContent={"Send"} />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ChatArea