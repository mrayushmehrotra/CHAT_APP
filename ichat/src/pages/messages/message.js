import React from 'react'
import styles from "./message.module.css"

const message = ({user,message}) => {
    if(user){
        return (
            <>
             <div className={`${styles.messageBox} ${styles.left}`} >
         
              <div>{`${user}: ${message}`}</div>
             </div>
            </>
           )
    } else {
        return (
            <>
             <div className={`${styles.messageBox} ${styles.right}`} >
         
              <div>{`You: ${message}`}</div>
             </div>
            </>
           )
    }
 
}

export default message