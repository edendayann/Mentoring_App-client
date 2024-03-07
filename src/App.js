import './App.css';
import ChooseCodeBlock from './components/ChooseCodeBlock';
import CodeBlock from './components/CodeBlock';
import { useState } from 'react';

const Indexes = [0,1,2,3]
function App() {
  const [activeCodeBlock, setActiveCodeBlock] = useState(-1)
  const [isMentor, setIsMentor] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <ChooseCodeBlock setActiveCodeBlock={setActiveCodeBlock} notChosen={activeCodeBlock === -1} isMentor={isMentor}/>
        {Indexes.map(index => 
                <CodeBlock index={index} isActive={activeCodeBlock === index}
                            isMentor={isMentor} setIsMentor={setIsMentor}/>
            )}
      </header>
    </div>
  );
}

export default App;
