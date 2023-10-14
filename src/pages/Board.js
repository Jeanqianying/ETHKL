import React, { useState } from 'react';
import styled from 'styled-components';
import "./Board.css";
//import MetaMaskButton from './MetaMaskButton';
//import Web3 from 'web3';


const ChessBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
  background-color: #1e90ff;
  border: 2px solid #000000;
  width: 408px;
  height: 408px;
`;

const ChessSquare = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${(props) => (props.isBlack ? '#1e90ff' : '#ffffff')};
`;



function Board() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null); 
  
 
  const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];



  const handleSquareClick = (row, col) => {
    if (!selectedPiece) {
      if (board[row][col]) {
        setSelectedPiece({ piece: board[row][col], row, col });
      }
    } else {
      const { piece, row: fromRow, col: fromCol } = selectedPiece;
      const newBoard = [...board];
      newBoard[row][col] = piece;
      newBoard[fromRow][fromCol] = null;
      setBoard(newBoard);
      setSelectedPiece(null);
    }
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) =>
      row.map((piece, colIndex) => (
        <ChessSquare
          key={rowIndex * 8 + colIndex}
          isBlack={(rowIndex + colIndex) % 2 === 1}
          onClick={() => handleSquareClick(rowIndex, colIndex)}
        >
          {piece}
        </ChessSquare>
      ))
    );
  };

  
  return (
    <div className="Board">
      <h1>2-Player Chess</h1>
      
      <ChessBoard className='mainBoard'>{renderBoard()}</ChessBoard>
    </div>
  );
};


export default Board;
