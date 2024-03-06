import { useState, useRef, useEffect } from "react"
import '../App.css'
import Prism from 'prismjs';
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
    const [isFinished, setIsFinished] = useState(false);
    const codeRef = useRef(null);
    const initialCode = useRef("");

    useEffect(() => {
      if (codeRef.current) {
          delete codeRef.current.dataset.highlighted;
          hljs.highlightElement(codeRef.current);
      }
  }, [code]);

    useEffect(() => {
        const SOCKET_URL = process.env.SERVER_URL || 'ws://localhost:3001';
        const socket = new WebSocket(SOCKET_URL);
    
        socket.addEventListener('open', () => { 
          console.log('Connected to WebSocket');
          if(isActive)
            socket.send(JSON.stringify({ type: 'joinCodeBlock', index }));
        });
    
        socket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);    
          if (data.type === 'mentor') {
            console.log('mentor is in block number ' + index);
            setIsMentor(true)
          } 
          else if (data.type === 'codeBlock') {
            setTitle(data.block.title)
            setCode(data.block.code)
            setSolution(data.block.solution)
            initialCode.current = data.block.code
          }
          else if (data.type === 'code') {
            setCode(data.code)
          }
        });
    
        socket.addEventListener('close', () => {
          socket.send(JSON.stringify({ type: 'closePage', isMentor: isMentor }));
          console.log('Disconnected from WebSocket');
        });
    
        setWS(socket);
    
        return () => {
          socket.send(JSON.stringify({ type: 'closePage', isMentor: isMentor }));
          socket.close();
        };
      }, [isActive, index, isMentor]);

      

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
        setIsFinished(true)
      } else {
        alert("The solution is not done yet,\nTry again")
      }
    }

    if (isFinished) {
      return (
        <div className="finished">
          <h2>Good Job!</h2>
          <a href="/">
            <img src={smiley} className="smiley" />
          </a>
        </div>
      )
    }
    if(isActive){
        return (<>
        <plaintext className="codeTitle">{title}</plaintext>
            <div id={index} className="CodeBlock">
                    <textarea id="editing"
                        onChange={handleCodeChange}
                        placeholder="Press reset to go back to the start"
                        value={code}
                        spellCheck="false"
                        readOnly={isMentor}
                    />
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