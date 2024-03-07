import './App.css';
import ChooseCodeBlock from './components/ChooseCodeBlock';
import CodeBlock from './components/CodeBlock';
import { Suspense, useState } from 'react';

const Indexes = [0,1,2,3]
function App() {
  const [activeCodeBlock, setActiveCodeBlock] = useState(-1)
  const [isMentor, setIsMentor] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <ChooseCodeBlock setActiveCodeBlock={setActiveCodeBlock} notChosen={activeCodeBlock === -1} isMentor={isMentor}/>
        {Indexes.map(index => 
                <Suspense fallback="loading"><CodeBlock index={index} isActive={activeCodeBlock === index}
                            isMentor={isMentor} setIsMentor={setIsMentor}/></Suspense>
            )}
      </header>
    </div>
  );
}

export default App;
