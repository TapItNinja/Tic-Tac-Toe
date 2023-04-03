import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css'
const gameStyles  = {
  backgroundColor: 'salmon',
  margin: 20,
  padding: 20 ,

};
const Square=(props)=>{
  return(
    <button className='square'
    onClick={props.onClickEvent}>
      {props.value}
      </button>
  )
}
const Board= ()=>{
  // const initialSquares=[
  //   null, null, null,
  //   null, null, null,
  //   null, null, null,
  // ];
  const initialSquares=Array(9).fill(null);
  const [squares,setSquares]=useState(initialSquares);
  const [xIsNext, setxIsNext]=useState(true)
  const handleClickEvent=(i)=>{
    const newSquares=[...squares];
    const winnerDeclared= Boolean(calculateWinner(newSquares));
    const squareFilled= Boolean(newSquares[i]);
    if(winnerDeclared||squareFilled){
      return;
    }
    //1. make a copy of sate array
    // const newSquares=[...squares];
    //2.mutate the copy, setting the ith element to 'x'
    newSquares[i]= xIsNext ? 'X' : 'O';
    //3.call the setsquare function with the mutated copy
    setSquares(newSquares);
    setxIsNext(!xIsNext);
  }
  
  const rendersquare= (i)=>{
    return(
      <Square value={squares[i]}
      onClickEvent={()=>handleClickEvent(i)}/>
    );
  };
  const winner= calculateWinner(squares)
  const status=winner ?
  `winner: ${winner}`:
  `Next Player: ${xIsNext ? 'X': 'O'}`;
  return(
    <button style={{
      // backgroundColor:'skyblue',
      margin: 10,
      padding:20,
    }}className='square1'>
      <div className='status'>{status}</div>
      <button className='Board-row'>
      {rendersquare(0)}{rendersquare(1)}{rendersquare(2)}
      </button>
      <button className='Board-row'>
      {rendersquare(3)}{rendersquare(4)}{rendersquare(5)}
      </button> 
      <button className='Board-row'>
      {rendersquare(6)}{rendersquare(7)}{rendersquare(8)}
      </button>
    </button>
  )
}

const Game=()=>{
  return(
  <button
  className='game'>
    Tic-Tac-Toe
    <Board/>
  </button>);
};
ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
function calculateWinner(squares){
  const lines=[
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for(let line of lines){
    const [a,b,c]=line;
    if (squares[a] && squares[a]===squares[b] && squares[b]===squares[c]){
      return squares[a];
    }
  }
  return null;  
}