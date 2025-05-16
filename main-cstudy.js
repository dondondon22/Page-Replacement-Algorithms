// Paging Algorithms
class PagingAlgorithms {
    static fifoWithMemoryStates(pages, frameSize) {
        let frames = [];
        let pageFaults = 0;
        let memoryStates = []; // Array to store memory states
        let fifoPointer = 0; // Points to the next frame to replace

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

    static optimal(pages, frameSize) {
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

    static lru(pages, frameSize) {
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

// Example Usage
const pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
const frameSize = 3;

console.log('FIFO Memory States:', PagingAlgorithms.fifoWithMemoryStates(pages, frameSize));
console.log('LRU Memory States:', PagingAlgorithms.lru(pages, frameSize));
console.log('Optimal Memory States:', PagingAlgorithms.optimal(pages, frameSize));


//TO Do
/*
1) Indexing replacement, shifting the array to the left and adding the new page at the end. needs fixing
instead replace and not shift to the left
2) Add function to generate random pages from 0 to 9 only
3) Pass the number of page frames to the program at startup
4) Create a button to generate random pages 0 to 9, 30 max
5) Create a button to calculate the page replacement algorithms
6) Create a box to input the pages, 0-9 number only, 30 max
7) Create a box to input the number of frames, 1-10 number only
*/