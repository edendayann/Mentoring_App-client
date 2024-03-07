import { useEffect, useState } from 'react';
import '../App.css';
import axios from "axios";

function ChooseCodeBlock({ setActiveCodeBlock, notChosen, isMentor }) {
    const [blockNames, setBlockNames] = useState([])
    useEffect(() =>{
        //const APP_URL = process.env.APP_URL || 'http://localhost:3002';
        const APP_URL = 'https://mentoring-app-client.onrender.com:3002';
        axios.get(`${APP_URL}/names`)
            .then(response => {
                delete response.data.data._id;
                setBlockNames(Object.values(response.data.data));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
          
    },[]);
    return (
        <div className="ChooseCodeBlock">
            <h4>{notChosen ? "Please choose code block" : isMentor ? "Welcome, Tom :)" : "Welcome, Josh :)" }</h4>
        {blockNames.map((name, index) => 
            <p key={index}>
                <button onClick={() => setActiveCodeBlock(index)}>{name}</button>
            </p>)}
            <p>
                <button onClick={() => setActiveCodeBlock(-1)}>
                    Close All
                </button>
            </p>
        </div>
    )
}

export default ChooseCodeBlock;
