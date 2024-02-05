import React, {useState, useRef, useEffect, useCallback} from "react";
import {UserNameForm} from "./components/UserNameForm";
import {io} from 'socket.io-client';
import {Chat} from "./components/Chat";
import {Routes, Route, useNavigate} from "react-router-dom";
import {
    ALL_USERS,
    CURRENT_USER,
    JOIN_SERVER,
    MESSAGES,
    NEW_MESSAGE,
    NEW_USER
} from "./types/socket-event-types";


export const App = () => {
    const [userName, setUserName] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const [currentUser, setCurrentUser] = useState({})
    const [allUsers, setAllUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [newUser, setNewUser] = useState('')
    const socketRef = useRef();
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setNewUser('')
        },3000)
    },[newUser])

    const sendMessage = (message) => {
        if(!message){
            return;
        }
        socketRef.current.emit(NEW_MESSAGE, {content:message, sender:userName, room:'chat',id:currentUser.id})
    }
    const handleChange = (e) => {
        if(showAlert){
            setShowAlert(false)
        }
        setUserName(e.target.value)
    }

    const connect = useCallback( (e) => {
        e.preventDefault()
        if(!userName){
            setShowAlert(true)
            return
        }

        socketRef.current = io.connect('http://localhost:3050', {
            transports: ['websocket']
        })
        socketRef.current.emit(JOIN_SERVER, userName, 'chat')
        socketRef.current.on(CURRENT_USER, (current) => {
            if(current.id){
                navigate('chat')
            }
            setCurrentUser(current)
        })
        socketRef.current.on(ALL_USERS, (allUsers) => {
            setAllUsers(allUsers)
        })
        socketRef.current.on(NEW_USER, (user) => {
            setNewUser(user)
        })
        socketRef.current.on(MESSAGES, (messages) => {
            setMessages(messages)
        })

        socketRef.current.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

    },[userName])

  return (
    <div className="App">
        <Routes>
            <Route path="/" element={<UserNameForm  showAlert={showAlert}
                                                    userName={userName}
                                                    onChange={handleChange}
                                                    connect={connect}/>}/>
            <Route path='/chat' element={<Chat newUser={newUser}
                                               currentUser={currentUser}
                                               allUsers={allUsers}
                                               messages={messages}
                                               sendMessage={sendMessage}/>}/>
        </Routes>
    </div>
  );
}

