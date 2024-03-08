import { useState, useRef, useEffect, Suspense } from "react";
import '../App.css';
import axios from "axios";
import hljs from '../../node_modules/highlight.js/lib/core';
import javascript from '../../node_modules/highlight.js/lib/languages/javascript';
import smiley from "../smiley.png";
import Highlighter from "./Highlighter";
import '../../node_modules/highlight.js/styles/github.css';
hljs.registerLanguage('javascript', javascript);

function CodeBlock({ index, notChosen, isActive }) {
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [solution, setSolution] = useState("");
    const [ws, setWS] = useState(null);
    const [success, setSuccess] = useState(false);
    const initialCode = useRef("");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMentor, setIsMentor] = useState(true);

    useEffect(() =>{
      setLoading(true);
      
      //const APP_URL = process.env.APP_URL || 'http://localhost:3001';
      const APP_URL = 'https://mentoring-app-server.onrender.com';
      //const SOCKET_URL = process.env.SOCKET_URL || 'ws://localhost:3001';
      const SOCKET_URL = 'wss://mentoring-app-server.onrender.com';

      const socket = new WebSocket(SOCKET_URL);
      const fetchData = async () => {
        try{
          const response = await axios.get(`${APP_URL}/codeBlock/${index}`);
          if(response){
            const block = response.data.block;
            setTitle(block.title);
            setCode(block.code);
            setSolution(block.solution);
            initialCode.current = block.code;
          }
          else{
            console.error('Error fetching data: not found');
          }
        } catch(error){
            console.error('Error fetching data:', error);
        }
      }
      fetchData();
  
      socket.addEventListener('open', () => { 
        console.log('Connected to WebSocket');
        setConnected(true);
      });

      socket.addEventListener('error', err => { 
        console.log(err);
      });
  
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data); 
        if (data.type === 'mentor' && data.index === index) {
          if(isMentor && data.data === false)
            setIsMentor(false);
          else if(!isMentor && data.data === true)
            setIsMentor(true);
        } 
        else if (data.type === 'code') {
          if(data.index === index)
            setCode(data.code);
        }
      });
  
      socket.addEventListener('close', () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      });
  
      setWS(socket);
      setLoading(false);
  
      return () => {
        if(isMentor){
          socket.send(JSON.stringify({ type: 'closeMentor' , index: index}));
          setIsMentor(false)
        }
        socket.close();
        setConnected(false);
      };
    }, []);

    useEffect(() => {
      if(connected){
        if(isActive){
          ws.send(JSON.stringify({ type: 'joinCodeBlock', index: index }));
        }
        else if(isMentor){
          setIsMentor(false);
          ws.send(JSON.stringify({ type: 'closeMentor' , index: index}));
        }
      }
    }, [isActive, isMentor, index])


    const handleCodeChange = (event) => {
        ws.send(JSON.stringify({ type: 'changeCode', index: index, newCode: event.target.value}));
        setCode(event.target.value);
    }

    const handleReset = () => {
      if(initialCode.current != ""){
        ws.send(JSON.stringify({ type: 'changeCode', newCode: initialCode.current}));
        setCode(initialCode.current);
      }
    }
    const handleSubmit = () => {
      const cleanCode = code.replace(/\s/g, '')
      if(cleanCode === solution.replace(/\s/g, '')) {
        setSuccess(true)
      } else {
        alert("The solution is not done yet,\nTry again")
      }
    }

    if(isActive){
      if (success) {
        return (
          <div className="finished">
            <h2>Good Job!</h2>
            <a href="/">
              <img src={smiley} className="smiley" />
            </a>
          </div>
        )
      }
      if(loading){
        return <h2>Loading..</h2>;
      }
      return (<>
        <div className="codeTitle">
          <h4>{isMentor ? "Welcome, Tom :)" : "Welcome, Josh :)"}</h4>
          {title}</div>
            <div id={index} className="CodeBlock">
                    {!isMentor && <textarea id="editing"
                        onChange={handleCodeChange}
                        placeholder="Press reset to go back to the start"
                        value={code}
                        spellCheck="false"
                        readOnly={isMentor}
                    />}
                    <Highlighter code={code}/>
                </div>
                <div className="button-container">
                  <button onClick={handleReset} disabled={isMentor}>Reset</button>
                  <button onClick={handleSubmit} disabled={isMentor}>Submit</button>
              </div></>

        )
    }
}

export default CodeBlock;
