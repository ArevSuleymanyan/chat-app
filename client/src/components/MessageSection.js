import React, {Fragment, useEffect,useRef} from "react";

export const MessageSection = ({messages, currentUser}) => {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);
    return (
        <>
            {
                messages.map((message, index) => {
                    const className = currentUser.id === message.id ? 'sender-content' : 'receiver-content'
                    const classNameSender = currentUser.id === message.id ? 'sender' : 'receiver'
                    return (
                        <Fragment key={index}>
                            <p className={className} key={index}>{message.content}</p>
                            <p className={classNameSender}>{message.id === currentUser.id ? 'You': message.sender}</p>
                        </Fragment>
                    )
                })
            }
            <div ref={bottomRef} />
        </>
    )
}
