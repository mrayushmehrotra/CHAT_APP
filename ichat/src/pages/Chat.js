import React, { useEffect, useState } from 'react'
import {user} from "./index.js"
import socketIO from "socket.io-client"
import styles from "./../styles/Chat.module.css"
import Message from './messages/message.js'
import ReactScrollToBottom from "react-scroll-to-bottom";
import { useRouter } from 'next/router'


const ENDPOINT = "http://localhost:4500/";

let socket;

const Chat = () => {
  const router = useRouter()
 const [id,setid] = useState("")
 const [messages, setmessages] = useState([])
const send =()=>{
  let message = document.getElementById("chatInput").value

  socket.emit("message", {message, id});
  message = document.getElementById("chatInput").value=""
}

  useEffect(() => {
      socket = socketIO(ENDPOINT, {transports: ['websocket']});
    socket.on("connect", (data)=>{
      setid(socket.id)
      setmessages([...messages,data])
    })
      socket.emit("joined", {user})
      socket.on("welcome", (data)=>{
        setmessages([...messages,data])
      })

      socket.on("userJoined", (data)=>{
        setmessages([...messages,data])
      })

      socket.on("leave", (data)=>{
        setmessages([...messages,data])
      })

     return () => {
       socket.emit("disconnected");
       socket.off()
     }
   }, [])
   
   useEffect(() => {
     socket.on("sendMessage", (data)=>{
      setmessages([...messages,data])
     })
   
     return () => {
       socket.off()
     }
   }, [messages])
   

  return (
   <>
   <div className={styles.chatPage}>
    <div className={styles.chatContainer}>
      <div className={styles.header}>
      <h2>ICHAT</h2>
      <h1 onClick={()=>{
        router.push("/")
      }}>X</h1>
      </div>
        <ReactScrollToBottom className={styles.chatBox}>

        {messages && messages.map((item, index) => (
          item ?
              <Message key={index} user={item.id===id?"":item.user} message={item.message}/>:
              null

            ))}

        </ReactScrollToBottom>
        <div className={styles.inputBox}>
          <input onKeyPress={(event)=>event.key === "Enter"? send(): null} type="text" id="chatInput" className={styles.chatInput} />
          <button onClick={send} className={styles.sendBtn}><h3>Send</h3></button>
        </div>
      </div>
    </div>
   </>
  )
}

export default Chat