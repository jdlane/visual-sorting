import React, { useState } from 'react'
import SortBox from './SortBox.js'
import './App.css';

// returns a shuffled copy of the given array
const shuffle = (bars) => {
  let arr2 = [];
  while(bars.length > 0) {
    // get random index of bars
    let rand = Math.floor(Math.random()*bars.length);
    // push random bar from bars to arr2
    arr2.push(bars[rand]);
    // remove bar from bars
    bars.splice(rand, 1);
  }
  return arr2;
}

// performs one step of a bubble sort, returning an object containing 
// information about the state of the sort
const bubbleSort = (data) => {
  let barsTemp = [...data.bars];

  // initialize the state data for the sort if not yet done
  if(data.sortInfo.i === undefined) {
    data.sortInfo.i = 0;
    data.sortInfo.j = 0;
  }

  // if j index reaches end, move back to start and increment i
  if (data.sortInfo.j === barsTemp.length - 1) {
    data.sortInfo.j = 0;
    data.sortInfo.i = data.sortInfo.i + 1;
  }
  // if the current element is greater, swap it with its successor
  if (barsTemp[data.sortInfo.j] > barsTemp[data.sortInfo.j+1]) {
    let temp = barsTemp[data.sortInfo.j];
    barsTemp[data.sortInfo.j] = barsTemp[data.sortInfo.j+1];
    barsTemp[data.sortInfo.j+1] = temp;
  }

  // return sorting data, i is outer index, j is inner
  return {
    bars: barsTemp,
    sortInfo: {
      i: data.sortInfo.i,
      // increment i for next iteration
      j: data.sortInfo.j + 1
    },
    // sorting is done when i reaches the array's length
    done: data.sortInfo.i > barsTemp.length - 1
  };
}

// performs one step of an insertion sort, returning an object containing 
// information about the state of the sort
const insertionSort = (data) => {

  // if sorting data not initialized, initialize it
  if(data.sortInfo.i === undefined) {
    data.sortInfo.i = 0;
    data.sortInfo.j = 0;
  }

  let barsTemp = [...data.bars];

  let doneInner = false;

  if (barsTemp[data.sortInfo.j - 1] > barsTemp[data.sortInfo.j]) {
    let temp = barsTemp[data.sortInfo.j];
    barsTemp[data.sortInfo.j] = barsTemp[data.sortInfo.j - 1];
    barsTemp[data.sortInfo.j - 1] = temp;
  } else {
    doneInner = true;
  }

  return {
    bars: barsTemp,
    sortInfo: {
      i: data.sortInfo.j === 0 || doneInner ? data.sortInfo.i + 1 : data.sortInfo.i,
      j: data.sortInfo.j === 0 || doneInner ? data.sortInfo.i + 1 : data.sortInfo.j - 1
    },
    done: data.sortInfo.i > barsTemp.length - 1
  }
}

// performs one step of a selection sort, returning an object containing 
// information about the state of the sort
const selectionSort = (data) => {
  if (data.sortInfo.max === undefined) {
    data.sortInfo.max = 0;
    data.sortInfo.j = 0;
    data.sortInfo.i = 0;
  }

  let barsTemp = [...data.bars];

  let newMax = barsTemp[data.sortInfo.j] > barsTemp[data.sortInfo.max] ? data.sortInfo.j : data.sortInfo.max;

  if (data.sortInfo.j > barsTemp.length - data.sortInfo.i - 2){
    let temp = barsTemp[data.sortInfo.j];
    barsTemp[data.sortInfo.j] = barsTemp[newMax];
    barsTemp[newMax] = temp;
    newMax = 0;
  }

  return {
    bars: barsTemp,
    sortInfo: {
      i: data.sortInfo.j > barsTemp.length - data.sortInfo.i - 2 ? data.sortInfo.i + 1 : data.sortInfo.i,
      j: data.sortInfo.j > barsTemp.length - data.sortInfo.i - 2 ? 0 : data.sortInfo.j + 1,
      max: newMax
    },
    done: data.i > barsTemp.length - 1
  }
  
}

// performs one step of quicksort, returning an object containing 
// information about the state of the sort
const quickSort = (data) => {
  let tempStack;
  if (data.sortInfo.callStack === undefined) {
    tempStack = [];
    tempStack.push({start: 0, end: data.bars.length-1, j: 0, i: -1});
  }else{
    tempStack = [...data.sortInfo.callStack];
  }

  let barsTemp = [...data.bars];

  if (tempStack.length > 0) {
    let action = tempStack.pop();

    console.log(action);

    if (action.j >= action.end) {
        let temp = barsTemp[action.i + 1];
        barsTemp[action.i + 1] = barsTemp[action.end];
        barsTemp[action.end] = temp;

        if(action.start - action.end < -1 || action.start - action.end > 1) {
          tempStack.push({start: action.i + 1, end: action.end, j: action.i + 1, i: action.i});
          tempStack.push({start: action.start, end: action.i, j: action.start, i: action.start - 1});
        }else{
          if(barsTemp[action.start] > barsTemp[action.end]){
            let temp = barsTemp[action.start];
            barsTemp[action.start] = barsTemp[action.end];
            barsTemp[action.end] = temp;
          }
        }
    } else {
      let addI = 0;
      if (barsTemp[action.j] <= barsTemp[action.end]) {
        addI=1;

        let temp = barsTemp[action.i+1];
        barsTemp[action.i+1] = barsTemp[action.j];
        barsTemp[action.j] = temp;
      }
      tempStack.push({start: action.start, end: action.end, j: action.j + 1, i: action.i + addI});
    }
  }

  return {
    sortInfo: {callStack: tempStack},
    bars: barsTemp,
    done: tempStack.length === 0
  }
}

const heapSort = (data) => {
  let barsTemp = [...data.bars];

  if (data.sortInfo.adding === undefined) {
    data.sortInfo.adding = true;
    data.sortInfo.j = 1;
    data.sortInfo.i = 1;
  }

  let tempInfo = {
    adding: data.sortInfo.adding,
    j: data.sortInfo.j,
    i: data.sortInfo.i
  }

  if (tempInfo.adding) {
    if (tempInfo.i === barsTemp.length) {
      tempInfo.adding = false;
      tempInfo.i = 0;
      tempInfo.j = 0;
    } else {
      if (tempInfo.j > 0 && barsTemp[tempInfo.j] > (barsTemp[Math.floor((tempInfo.j-1)/2)])) {
        let temp = barsTemp[tempInfo.j];
        barsTemp[tempInfo.j] = barsTemp[Math.floor((tempInfo.j-1)/2)];
        barsTemp[Math.floor((tempInfo.j-1)/2)] = temp;

        tempInfo.j = Math.floor((tempInfo.j-1)/2);
      } else {
        tempInfo.i = tempInfo.i + 1;
        tempInfo.j = tempInfo.i;
      }
    }
  } else {
    if (tempInfo.j*2+1 < barsTemp.length - tempInfo.i - 1 && (barsTemp[tempInfo.j] < barsTemp[tempInfo.j*2 + 1] || barsTemp[tempInfo.j] < barsTemp[tempInfo.j*2 + 2])) {
      let maxIndex = barsTemp[tempInfo.j*2 + 1] > barsTemp[tempInfo.j*2 + 2] ? tempInfo.j*2 + 1 : tempInfo.j*2 + 2;
      let temp = barsTemp[tempInfo.j];
      barsTemp[tempInfo.j] = barsTemp[maxIndex];
      barsTemp[maxIndex] = temp;
      tempInfo.j = maxIndex;
    } else {
      if (barsTemp[0] > barsTemp[barsTemp.length - tempInfo.i - 1]) {
        let temp = barsTemp[0];
        barsTemp[0] = barsTemp[barsTemp.length - tempInfo.i - 1];
        barsTemp[barsTemp.length - tempInfo.i - 1] = temp;
      }

      tempInfo.i = tempInfo.i + 1;
      tempInfo.j = 0;
    }
  }

  return {
    bars: barsTemp,
    sortInfo: {
      i: tempInfo.i,
      j: tempInfo.j,
      adding: tempInfo.adding
    },
    done: (!tempInfo.adding && tempInfo.i > barsTemp.length - 1)
  }
}

const mergeSort = (data) => {
  let barsTemp = [...data.bars];

  let tempStack = [];
  if (data.sortInfo.callStack === undefined) {
    tempStack.push({
      start: 0,
      end: barsTemp.length - 1,
      merge: false
    });
  }else {
    tempStack = [...data.sortInfo.callStack];
  }

  let action = tempStack.pop();
  if (action.merge) {
    if (action.section.length === 0) {
      action.section = barsTemp.slice(action.k, action.end2 + action.k + 1);
    }
    if (action.j <= action.end2 || action.i <= action.end1){
      let addLeft = false;
      if (action.i > action.end1) {
        addLeft = true;
        barsTemp[action.k] = action.section[action.j];
      } else if (action.j > action.end2) {
        barsTemp[action.k] = action.section[action.i];
      } else if (action.section[action.i] < action.section[action.j]) {
        barsTemp[action.k] = action.section[action.i];
      } else {
        addLeft = true;
        barsTemp[action.k] = action.section[action.j];
      }
      tempStack.push({
        j: addLeft ? action.j + 1: action.j, 
        i: !addLeft ? action.i + 1: action.i, 
        k: action.k + 1, 
        end1: action.end1, 
        end2: action.end2,
        section: action.section,
        merge: true
      });
    }
  } else {
    if (action.start !== action.end) {
      tempStack.push({
        i: 0,
        j: Math.floor((action.end - action.start) / 2) + 1,
        k: action.start,
        end1: Math.floor((action.end - action.start) / 2),
        end2: action.end - action.start,
        section: [],
        merge: true
      });
      tempStack.push({
        start: Math.floor((action.start + action.end) / 2) + 1,
        end: action.end,
        merge: false
      });
      tempStack.push({
        start: action.start,
        end: Math.floor((action.start + action.end) / 2),
        merge: false
      });
    }
  }

  return {
    bars: barsTemp,
    sortInfo: {
      callStack: tempStack
    },
    done: tempStack.length === 0
  }

}

function App() {
  const [data, setData] = useState({bars: [], sortInfo: {}, done: false});
  const [sorting, setSorting] = useState(false);
  const [sortingMethod, setSortingMethod] = useState(() => bubbleSort);
  const [sortIntervalId, setSortIntervalId] = useState(0);

  React.useEffect(() => {
    let barsTemp = [];
      for (let i = 0; i < 100; i++){
        barsTemp.push(3*i+10);
      }
      setData((data) => {return {'bars': shuffle(barsTemp), sortInfo: {}, done: false}});
  }, []);

  React.useEffect(() => {
    if(sorting){
      if (data.bars.length > 0) {
        let barsTemp = [];
        for (let i = 0; i < 100; i++){
          barsTemp.push(3*i+10);
        }
        setData({'bars': shuffle(barsTemp), sortInfo: {}});
      }
       const id = setInterval(() => {
         setData(data => {
          const x = sortingMethod(data);
          if (x.done){
            setSorting(false);
          }
          return {...data, bars: x.bars, sortInfo: x.sortInfo}
         });
       }, 1);
       setSortIntervalId(id);
    } else {
      clearInterval(sortIntervalId);
    }
  }, [sorting]);

  return (
    <div>
    <div className='SortButtons'>
    <button className={sortingMethod === bubbleSort ? "SortMethodSelected" : ""} onClick={() => {setSorting(false); setSortingMethod(() => bubbleSort);}}>Bubble Sort</button>
    <button className={sortingMethod === insertionSort ? "SortMethodSelected" : ""} onClick={() => {setSorting(false); setSortingMethod(() => insertionSort);}}>Insertion Sort</button>
    <button className={sortingMethod === selectionSort ? "SortMethodSelected" : ""} onClick={() => {setSorting(false); setSortingMethod(() => selectionSort);}}>Selection Sort</button>
    <button className={sortingMethod === quickSort ? "SortMethodSelected" : ""} onClick={() => {setSorting(false); setSortingMethod(() => quickSort);}}>Quick Sort</button>
    <button className={sortingMethod === heapSort ? "SortMethodSelected" : ""} onClick={() => {setSorting(false); setSortingMethod(() => heapSort);}}>Heap Sort</button>
    <button className={sortingMethod === mergeSort ? "SortMethodSelected" : ""} onClick={() => {setSorting(false); setSortingMethod(() => mergeSort);}}>Merge Sort</button>
    <button className={sorting ? "SortButtonSelected" : ""} onClick={() => {setSorting(false); setSorting(true);}}>Sort!</button>
    </div>
    <div className="SortWindow">
      <SortBox bars={data.bars}></SortBox>
    </div>
    </div>
  );
}

export default App;
