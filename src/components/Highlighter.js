import React, { useEffect, useRef } from 'react';
import '../App.css';
import hljs from '../../node_modules/highlight.js/lib/core';
import javascript from '../../node_modules/highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

const Highlighter = ({ code }) => {
    const codeRef = useRef(null);

    useEffect(() => {
        if (codeRef.current) {
            delete codeRef.current.dataset.highlighted;
            hljs.highlightElement(codeRef.current);
        }
    }, [code]);

    return (
        <pre id="highlighting">
                    <code id="highlighting-content" ref={codeRef} className="language-javascript">
                        {code}
                    </code>
                </pre>
    );
};

export default Highlighter;