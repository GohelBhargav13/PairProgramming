import React, { useEffect, useRef, useState } from 'react'
import Client from './Client'
import Editor from './Editor'
import ACTIONS from '../Actions';

//TO GET THE STATE DATA...
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import socket from '../server';

function EditorPage() {

  const sockerRef = useRef(null);
  
  const [clients,setClients] = useState([])

  //FOR TAKE THE DATA FROM THE STATE
  const location = useLocation();
  const navigate = useNavigate();

  const { roomId } = useParams()

  async function copiedId(){
    try {
        await navigator.clipboard.writeText(roomId);
        toast.success("RoomId Copied")
    } catch (error) {
        toast.error("Failed to copy RoomId")
        console.log(error);
    }
  }

  useEffect(() => {

    //MAKE A EDITOR REF
  
    const init = async() => {
      sockerRef.current = socket;

      // ERROR HANDLER
      function handleError(e){
        console.log("Error is : ",e);
        toast.error("connection Failed with WebApp....",{ duration: 1000 })
        navigate("/")
      }

      //CHECK FOR THE ANY ERROR IN THE CONNECTION
      sockerRef.current.on('connect_error',(err) => handleError(err))
      sockerRef.current.on('connect_failed',(err) => handleError(err))


      sockerRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username,
      });

      console.log(location.state);

      sockerRef.current.on(ACTIONS.JOINED,({ socketId,username,client}) => {
          if(username !== location.state?.username){
            toast.success(`${username} Joined`)
            console.log(`${username} Joined`);
          }

          console.log(client)
          setClients(client)
      })

      sockerRef.current.on(ACTIONS.DISCONNECTED,({socketId,username}) => {
          toast.success(`${username} is left Room`)
          console.log(`${username} left Room`)

          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId )
          })
      })
    }
    init();

    return () => {
        // sockerRef.current.disconnect();
        sockerRef.current.off(ACTIONS.JOINED)
        sockerRef.current.off(ACTIONS.DISCONNECTED)
    }
  },[])

  console.log(sockerRef.current);


  if(!location.state){
    return navigate("/")
  }
  return (
    <>
        <div className='mainWrapper'>
            <div className='aside'>
              <div className='asideInner'>
                <div className='Logo'>
                  <span>Image Here</span>
                </div>
                <h3>Connected</h3>
                <div className='connectedUsers'>
                  {clients.map((client) => (
                        <Client key={client.socketId} username={client.username} />
                  )) }
                </div>
              </div>
              <button className='btn copyBtn' onClick={copiedId}>Copy ROOM ID</button>
              <button className='btn leaveBtn'>Leave</button>
            </div>
            <div className='editorWrap'>
              <Editor sockerRef={sockerRef} roomId={roomId} />
            </div>
        </div>
    </>
  )
}

export default EditorPage