import {Box} from '@mui/material';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useEffect ,useState} from 'react';
import styled from '@emotion/styled';
import {io} from 'socket.io-client';
import { useParams } from 'react-router-dom';


const Component = styled.div`
    background : #F5F5F5;
`


const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];


const Editor = ()=>{


  const [socket,setSocket] = useState();
  const [quill , setQuill] = useState();

  const {id} = useParams();



    useEffect(()=>{ // for editor 
       const quillServer =  new Quill('#container',{theme : 'snow',modules:{toolbar:toolbarOptions}})
       quillServer.disable();  // server disable untill  exist doc load
       quillServer.setText('Loading the document please wait for a moment ...')
       setQuill(quillServer);
    },[]);

    useEffect (()=>{  // for socket connection

      const socketServer = io('http://localhost:3022');  // create connetion

      setSocket(socketServer);

      return ()=>{
        // socket.off();
        socketServer.disconnect();    // close connection
      }

    },[])

    useEffect(()=>{  // detect realtime changes at own side and send to server

        if(socket===null || quill === null)return;

      const handleChange = (delta,oldData,source)=>{

        if(source !== 'user')return;

       socket && socket.emit('send-changes',delta);
      }

      quill && quill.on('text-change',handleChange);

      return ()=>{
       quill && quill.off('text-change',handleChange)
      }

      
    },[quill,socket]);


    useEffect(()=>{  // detect realtime changes from other users and update your docs

      if(socket===null || quill === null)return;

    const handleChange = (delta)=>{  // recived only changes so no need other variables

     // update chanes with the help of quill
     quill.updateContents(delta);

     
    }

    socket && socket.on('receive-changes',handleChange);

    return ()=>{
      socket && socket.off('receive-changes',handleChange)
    }

    
  },[quill,socket])


  useEffect(()=>{    // apply some validation on changes based on id

    if(socket===null || quill === null)return;

    socket && socket.once('load-document',document =>{
     quill && quill.setContents(document);
      quill && quill.enable();
    })

    socket && socket.emit('get-document',id);


  },[quill,socket,id]);



    return (

       <Component>
         <Box id="container" className="container"> </Box>
       </Component>
            
       
    )
}


export default Editor;