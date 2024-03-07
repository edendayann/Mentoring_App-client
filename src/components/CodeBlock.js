import { ReactDOM, useState, useRef, useEffect, Suspense } from "react"
import '../App.css'
import axios from "axios";
import hljs from '../../node_modules/highlight.js/lib/core';
import javascript from '../../node_modules/highlight.js/lib/languages/javascript';
import smiley from "../smiley.png";
import '../../node_modules/highlight.js/styles/github.css';
 //background-color: #282c34;
 hljs.registerLanguage('javascript', javascript);

function CodeBlock({ index, isActive, isMentor, setIsMentor }) {
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [solution, setSolution] = useState("");
    const [ws, setWS] = useState(null);
    const [success, setSuccess] = useState(false);
    const codeRef = useRef(null);
    const initialCode = useRef("");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
      setLoading(true);
      
      const APP_URL = process.env.APP_URL || 'http://localhost:3002';
      //const APP_URL = 'https://mentoring-app-client.onrender.com/3002';
      const fetchData = async () => {
        try{
          const response = await axios.get(`${APP_URL}/codeBlock/${index}`);
          console.log(response);
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
      
      const SOCKET_URL = process.env.SOCKET_URL || 'ws://localhost:3001';
      //const SOCKET_URL = 'wss://mentoring-app-client.onrender.com:3001';
      const socket = new WebSocket(SOCKET_URL);
  
      socket.addEventListener('open', () => { 
        console.log('Connected to WebSocket');
        setConnected(true);
      });

      socket.addEventListener('error', err => { 
        console.log(err);
      });
  
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);    
        if (data.type === 'mentor') {
          if (data.data === 'true'){
            console.log('mentor is in block number ' + index);
            setIsMentor(true)
          }
          else{
            console.log('mentor is in block number ' + index);
            setIsMentor(false)
          }
        } 
        else if (data.type === 'code') {
          setCode(data.code)
        }
      });
  
      socket.addEventListener('close', () => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      });
  
      setWS(socket);
      setLoading(false);
  
      return () => {
        socket.send(JSON.stringify({ type: 'closePage', isMentor: isMentor }));
        socket.close();
        setConnected(false);
      };
    }, []);

    useEffect(() => {
      codeRef.current = document.getElementById('highlighting-content');
      if (codeRef.current) {
          delete codeRef.current.dataset.highlighted;
          hljs.highlightElement(codeRef.current);
      }
      else{
        console.log("else")
        const codeElement = document.createElement('code');
        codeElement.id = 'highlighting-content';
        codeElement.className = 'language-javascript';
        const highlightedCode = hljs.highlight(code, {language: 'javascript', ignoreIllegals: true});
        
        codeElement.innerHTML = highlightedCode.value;console.log(codeElement);
        codeRef.current = codeElement;
        //document.body.appendChild(codeElement);
        //hljs.highlightElement(codeElement);
      }
    }, [code]);

    useEffect(() => {
      if(isActive && connected)
          ws.send(JSON.stringify({ type: 'joinCodeBlock', index }));
    }, [isActive, index])


    const handleCodeChange = (event) => {
        ws.send(JSON.stringify({ type: 'changeCode', newCode: event.target.value}));
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
      //console.log(codeRef.current ? codeRef.current.innerHTML:"basa")
      return (<>
        <plaintext className="codeTitle">{title}</plaintext>
            <div id={index} className="CodeBlock">
                    {!isMentor && <textarea id="editing"
                        onChange={handleCodeChange}
                        placeholder="Press reset to go back to the start"
                        value={code}
                        spellCheck="false"
                        readOnly={isMentor}
                    />}
                <pre id="highlighting">
                    <code id="highlighting-content" ref={codeRef} className="language-javascript">
                        {code}
                    </code>
                </pre></div>
                <div className="button-container">
                  <button onClick={handleReset} disabled={isMentor}>Reset</button>
                  <button onClick={handleSubmit} disabled={isMentor}>Submit</button>
              </div></>

        )
    }
}

export default CodeBlock;