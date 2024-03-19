import { useEffect, useState } from 'react';
import '../App.css';
import axios from "axios";

function ChooseCodeBlock({ setActiveCodeBlock }) {
    const [blockNames, setBlockNames] = useState([])
    useEffect(() =>{
        const APP_URL = process.env.REACT_APP_APP_URL || 'http://localhost:3001';
        
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
            <h4>Please choose code block</h4>
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
