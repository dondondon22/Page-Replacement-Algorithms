class PagingAlgorithms {
    
    static fifoAlgo(pages, frameSize) {
        let frames = [];
        let pageFaults = 0;
        let memoryStates = []; 
        let fifoPointer = 0; 

        pages.forEach(page => {
            if (!frames.includes(page)) {
                if (frames.length === frameSize) {
                    // Replace the page at fifoPointer instead of shifting
                    frames[fifoPointer] = page;
                    fifoPointer = (fifoPointer + 1) % frameSize;
                } else {
                    frames.push(page);
                }
                pageFaults++;
            }
            // Store a copy of the current state of frames
            memoryStates.push([...frames]);
        });

        return {memoryStates, pageFaults}; // Return all memory states
    }

    static optimalAlgo(pages, frameSize) {
        let frames = [];
        let pageFaults = 0;
        let memoryStates = []; // Array to store memory states

        pages.forEach((page, index) => {
            if (!frames.includes(page)) {
                if (frames.length === frameSize) {
                    let futureIndexes = frames.map(frame =>
                        pages.slice(index + 1).indexOf(frame)
                    );
                    let farthestIndex = futureIndexes.indexOf(-1) !== -1
                        ? futureIndexes.indexOf(-1)
                        : futureIndexes.indexOf(Math.max(...futureIndexes));
                    frames[farthestIndex] = page;
                } else {
                    frames.push(page);
                }
                pageFaults++;
            }

            // Store a copy of the current state of frames
            memoryStates.push([...frames]);
        });

        return {memoryStates, pageFaults}; // Return all memory states
    }

    static lruAlgo(pages, frameSize) {
        let frames = [];
        let pageFaults = 0;
        let recentUsage = new Map();
        let memoryStates = []; // Array to store memory states
    
        pages.forEach((page, index) => {
            if (!frames.includes(page)) {
                if (frames.length === frameSize) {
                    // Find the least recently used page's index
                    let lruPage = [...recentUsage.entries()].sort((a, b) => a[1] - b[1])[0][0];
                    let lruIndex = frames.indexOf(lruPage);
                    // Replace the LRU page at its index instead of shifting
                    frames[lruIndex] = page;
                    recentUsage.delete(lruPage);
                } else {
                    frames.push(page);
                }
                pageFaults++;
            }
            recentUsage.set(page, index);
    
            // Store a copy of the current state of frames
            memoryStates.push([...frames]);
        });
    
        return {memoryStates, pageFaults}; // Return all memory states
    }
}

function generateRandomPages(length = 30) {
    const maxPages = Math.min(length, 30);
    let pages = [];
    for (let i = 0; i < maxPages; i++) {
        pages.push(Math.floor(Math.random() * 10));
    }
    return pages;
}

// Example Usage
const pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
const frameSize = 3;
//try on terminal
console.log('FIFO Memory States:', PagingAlgorithms.fifoAlgo(pages, frameSize));
console.log('LRU Memory States:', PagingAlgorithms.lruAlgo(pages, frameSize));
console.log('Optimal Memory States:', PagingAlgorithms.optimalAlgo(pages, frameSize));

window.onload = function() {
    function getPagesInput() {
        const val = document.getElementById('pagesInput').value;
        return val.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x) && x >= 0 && x <= 9).slice(0, 30);
    }
    function getFramesInput() {
        const val = parseInt(document.getElementById('framesInput').value, 10);
        return Math.max(1, Math.min(10, isNaN(val) ? 3 : val));
    }
    function setPagesInput(pagesArr) {
        document.getElementById('pagesInput').value = pagesArr.join(',');
    }
    document.getElementById('randomPagesBtn').onclick = function() {
        const len = Math.floor(Math.random() * 30) + 1;
        const pages = Array.from({length: len}, () => Math.floor(Math.random() * 10));
        setPagesInput(pages);
    };

    const algoDisplayNames = {
    'FIFO': 'First In, First Out (FIFO)',
    'LRU': 'Least Recently Used (LRU)',
    'Optimal': 'Optimal Page Replacement (OPT)'
    };

    document.getElementById('runAlgosBtn').onclick = function() {
        const pages = getPagesInput();
        const frameSize = getFramesInput();
        const fifo = PagingAlgorithms.fifoAlgo(pages, frameSize);
        const lru = PagingAlgorithms.lruAlgo(pages, frameSize);
        const optimal = PagingAlgorithms.optimalAlgo(pages, frameSize);

        let currentStep = 0;
        let currentAlgo = 'FIFO';

        function renderStep(algoName, algoResult) {
            let h = `<h2>${algoDisplayNames[algoName]}</h2>`;
            h += `<div style="margin-bottom:1em;">Step ${currentStep + 1} of ${algoResult.memoryStates.length} (Page: <b>${pages[currentStep]}</b>)</div>`;
            h += `<table style="text-align:center;"><tr><th>Frame</th>`;
            for (let s = 0; s <= currentStep; s++) {
               // h += `<th>Step ${s + 1}<br>Page ${pages[s]}</th>`;
                 h += `<th> ${pages[s]}</th>`;
            }
            h += `</tr>`;
            for (let f = 0; f < frameSize; f++) {
                h += `<tr><td>Frame ${f + 1}</td>`;
                for (let s = 0; s <= currentStep; s++) {
                    h += `<td>${algoResult.memoryStates[s][f] !== undefined ? algoResult.memoryStates[s][f] : ''}</td>`;
                }
                h += `</tr>`;
            }
            h += `</table>`;
            // Calculate page faults so far
            let faultsSoFar = algoResult.memoryStates.slice(0, currentStep + 1).reduce((acc, state, idx) => {
                if (idx === 0) return 1;
                return acc + (algoResult.memoryStates[idx - 1].includes(pages[idx]) ? 0 : 1);
            }, 0);
            h += `<p id="pageFaults1"><strong>Page Faults:</strong> ${faultsSoFar} </p>`;
            h += `
                <button id="prevStep" ${currentStep === 0 ? 'disabled' : ''}>Previous</button>
                <button id="nextStep" ${currentStep === algoResult.memoryStates.length - 1 ? 'disabled' : ''}>Next</button>
                <button id="showAll">Show All Algorithms</button>
                <button id="showFIFO"${currentAlgo === 'FIFO' ? ' disabled' : ''}>FIFO</button>
                <button id="showLRU"${currentAlgo === 'LRU' ? ' disabled' : ''}>LRU</button>
                <button id="showOptimal"${currentAlgo === 'Optimal' ? ' disabled' : ''}>OPT</button>
            `;
            document.getElementById('results').innerHTML = h;

            document.getElementById('prevStep').onclick = function() {
                if (currentStep > 0) {
                    currentStep--;
                    renderStep(currentAlgo, getAlgoResult(currentAlgo));
                }
            };
            document.getElementById('nextStep').onclick = function() {
                if (currentStep < algoResult.memoryStates.length - 1) {
                    currentStep++;
                    renderStep(currentAlgo, getAlgoResult(currentAlgo));
                }
            };
            document.getElementById('showAll').onclick = function() {
                renderAllAlgos();
            };
            document.getElementById('showFIFO').onclick = function() {
                currentAlgo = 'FIFO';
                currentStep = 0;
                renderStep(currentAlgo, fifo);
            };
            document.getElementById('showLRU').onclick = function() {
                currentAlgo = 'LRU';
                currentStep = 0;
                renderStep(currentAlgo, lru);
            };
            document.getElementById('showOptimal').onclick = function() {
                currentAlgo = 'Optimal';
                currentStep = 0;
                renderStep(currentAlgo, optimal);
            };
        }

        function getAlgoResult(name) {
            if (name === 'FIFO') return fifo;
            if (name === 'LRU') return lru;
            if (name === 'Optimal') return optimal;
        }

        function renderAllAlgos() {
            let html = '';
            function renderResult(title, result) {
                let h = `<h2>${title}</h2>`;
                h += `<h3>Memory States:</h3>`;
                h += `<table style="text-align:center;">`;
                h += '<tr><th>Frame/Page</th>';
                for (let i = 0; i < pages.length; i++) {
                    h += `<th>${pages[i]}</th>`;
                }
                h += '</tr>';
                const maxFrames = Math.max(...result.memoryStates.map(state => state.length));
                for (let f = 0; f < maxFrames; f++) {
                    h += `<tr><td>Frame ${f + 1}</td>`;
                    for (let s = 0; s < result.memoryStates.length; s++) {
                        h += `<td>${result.memoryStates[s][f] !== undefined ? result.memoryStates[s][f] : ''}</td>`;
                    }
                    h += '</tr>';
                }
                h += `</table>`;
                h += `<p id="showPF"><strong>Page Faults:</strong> ${result.pageFaults}</p>`;
                return h;
            }
            html += renderResult('First In, First Out (FIFO)', fifo);
            html += renderResult('Least Recently Used (LRU)', lru);
            html += renderResult('Optimal Page Replacement (OPT)', optimal);

            // Add a brief summary of all page faults per algorithm
            html += `
                <div style="margin-top:2em; padding:1em; background:#e6f2ff; border-radius:8px;">
                    <h3>Page Faults Summary</h3>
                    <ul>
                        <li><strong>FIFO:</strong> ${fifo.pageFaults}</li>
                        <li><strong>LRU:</strong> ${lru.pageFaults}</li>
                        <li><strong>OPT:</strong> ${optimal.pageFaults}</li>
                    </ul>
                </div>
            `;
            document.getElementById('results').innerHTML = html;
        }

        // Start with FIFO animation
        renderStep(currentAlgo, fifo);
    };

};