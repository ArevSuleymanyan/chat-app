import React, {useCallback, useEffect, useState} from "react";
import {MessageSection} from "./MessageSection";
import {useNavigate} from "react-router-dom";

export const Chat = (props) => {
    const {allUsers,newUser, currentUser, messages, sendMessage} = props
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleChange = useCallback((e) => {
        setMessage(e.target.value)
    },[])
    const onKeyPress = (event) => {
        if(event.key === 'Enter'){
            sendMessage(message)
            setMessage('')
        }
    }
    useEffect(() => {
        if(!currentUser.id){
            navigate('/')
        }
        console.log('currentUser',currentUser)
    },[currentUser])
    return (
        <div className={'chat-container'}>

            <div className={'user-section'}>
                <h4 className={'user-title'}>Online users:</h4>
                <div className={'online-users'}>
                    {
                        allUsers && allUsers.map((user, index) => {
                            return(
                            <div key={index}  className={currentUser.id === user.id ? 'user-row current' : 'user-row'}>
                                <p
                                    key={index}>
                                    {user.userName}
                                </p>
                                <div className='circle'/>
                            </div>
                            )
                        })
                    }
                </div>
                {
                   newUser && ( <p className={'new-user'}>
                        {newUser} join to chat
                    </p>)
                }
            </div>
            <div className={'message-section'}>
                <div className={'message-box'}>
                    {
                        messages && <MessageSection messages={messages} currentUser={currentUser}/>
                    }
                </div>
                <div className={'input-box'}>
                    <input value={message} className={'message-input'} onChange={handleChange} onKeyPress={onKeyPress}/>
                </div>
            </div>
        </div>
    )
}


