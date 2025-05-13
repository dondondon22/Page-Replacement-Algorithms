// Paging Algorithms
class PagingAlgorithms {
    static fifoWithMemoryStates(pages, frameSize) {
        let frames = [];
        let pageFaults = 0;
        let memoryStates = []; // Array to store memory states

        pages.forEach(page => {
            if (!frames.includes(page)) {
                if (frames.length === frameSize) {
                    frames.shift(); // Remove the oldest page
                }
                frames.push(page);
                pageFaults++;
            }

            // Store a copy of the current state of frames
            memoryStates.push([...frames]);
        });

        return {memoryStates, pageFaults}; // Return all memory states
    }

    // static fifo(pages, frameSize) {
    //     let frames = [];
    //     let pageFaults = 0;

    //     pages.forEach(page => {
    //         if (!frames.includes(page)) {
    //             if (frames.length === frameSize) {
    //                 frames.shift(); // Remove the oldest page
    //             }
    //             frames.push(page);
    //             pageFaults++;
    //         }
    //     });

    //     return frames;
    // }

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
                    let lruPage = [...recentUsage.entries()].sort((a, b) => a[1] - b[1])[0][0];
                    frames.splice(frames.indexOf(lruPage), 1);
                    recentUsage.delete(lruPage);
                }
                frames.push(page);
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
