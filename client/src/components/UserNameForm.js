import React from "react";

export const UserNameForm = (props) => {
    return (
        <div className={'form-container'}>
           <form>
               <input
                   className='form-input'
                   placeholder="Username..."
                   type="text"
                   value={props.userName}
                   onChange={props.onChange}
               />
               <button className='form-btn' onClick={(e)=>props.connect(e)}>Connect</button>
               {
                   props.showAlert && <p className={'username-alert'}>Please enter a  username</p>
               }
           </form>
        </div>
    )
}
