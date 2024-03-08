import './App.css';
import ChooseCodeBlock from './components/ChooseCodeBlock';
import CodeBlock from './components/CodeBlock';
import { Suspense, useState } from 'react';

const Indexes = [0,1,2,3]
function App() {
  const [activeCodeBlock, setActiveCodeBlock] = useState(-1)

  return (
    <div className="App">
      <header className="App-header">
        <ChooseCodeBlock setActiveCodeBlock={setActiveCodeBlock}/>
        {Indexes.map(index => 
                <Suspense fallback="loading"><CodeBlock index={index} notChosen={activeCodeBlock === -1} isActive={activeCodeBlock === index}/></Suspense>
            )}
      </header>
    </div>
  );
}

export default App;
