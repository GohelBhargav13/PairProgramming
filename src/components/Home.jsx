import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid"

function Home() {

    const navigate = useNavigate();
    const [roomId,setRoomId] = useState("");
    const [username,setUserName] = useState("");

    console.log("username is ",username);

    //create a new room with new ID
    const createNewRoom = (e) => {
        e.preventDefault();

        const id = uuid();
        setRoomId(id);
        navigator.clipboard.writeText(id);
        toast.success("Created a new room");
    }

    //JOIN the room function
    const joinRoom = () => {
        if(!roomId || !username){
            toast.error("ROOM ID & USERNAME is required");
            return;
        }

        //Redirect to join
        navigate(`/editor/${roomId}`,{ state: {username} })
    }

    //handel the key press
    const handleKeyEvent = (e) => {
        if(e.code === "Enter"){
            joinRoom();
        }
    }
  return (
   <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img src='./code-image.png' alt='code-image' />
            <h4 className='mainLabel'>paste invitation Room Id</h4>
            <div className='inputGroup'>
                <input type='text' onChange={(e) => setRoomId(e.target.value)} value={roomId} 
                className='inputBox' placeholder='ROOM ID' onKeyUp={(e) => handleKeyEvent(e)}  />

                <input type='text' onChange={(e) => setUserName(e.target.value)} value={username} 
                className='inputBox' placeholder='USERNAME' onKeyUp={(e) => handleKeyEvent(e)}  />
                <button className='btn joinbtn' onClick={joinRoom}>JOIN</button>
                <span className='createInfo'>
                    if you don't have room id &nbsp;
                    <a onClick={createNewRoom} href='' className='createRoom'>Create Room</a>
                </span>
            </div>
        </div>
        <footer>
            <h4 className='footerText'>Build by ❤️ <span className='footerSpan'>Bhargav</span></h4>
        </footer>
    </div>
  )
}

export default Home