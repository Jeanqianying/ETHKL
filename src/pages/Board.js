import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ChessBoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChessBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
  background-color: #1e90ff;
  border: 2px solid #000000;
  width: 408px;
  height: 408px;
  pointer-events: ${(props) => (props.isEnabled ? 'auto' : 'none')};
  opacity: ${(props) => (props.isEnabled ? '1' : '0.5')};
`;

const ChessSquare = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${(props) => (props.isBlack ? '#1e90ff' : '#ffffff')};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 15px 20px; /* Increase padding to make the button bigger */
  background-color: black;
  color: white;
  border: none;
  cursor: pointer;
  margin: 10px; /* Add margin to separate the buttons */
  font-size: 18px; /* Increase font size */
 
`;

const ChessLabel = styled.div`
  color: white;
  font-size: 45px;
  font-weight: bold;
`;

const PlayerLabel = styled.div`
  font-weight: bold;
  font-size: 25px;
  margin-top: 10px;
  color: white;
`;

const Message = styled.div`
  color: green;
  font-weight: bold;
  margin-top: 10px;
`;

const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "wager",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "winnerDeposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "user1",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "user2",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "wage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

async function connectToSmartContract(){
  
  window.web3 = await new Web3(window.ethereum);
  window.contract = await new window.web3.eth.Contract(ABI, contractAddress)
  console.log("Connected to smart contract");
}

const handleWager = async () => {
  // Ensure Web3 is available
  if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);

      // Ensure the user is connected to their Ethereum wallet (e.g., MetaMask)
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        alert('Please connect to your Ethereum wallet');
        return;
      }

      // Get the contract instance (assuming contractABI and contractAddress are defined)
      const contract = new web3.eth.Contract(ABI, contractAddress);

      // Specify the amount to wager (in Wei, 1 Ether = 1e18 Wei)
      const wagerAmount = web3.utils.toWei('0.01', 'ether');

      // Send a transaction to the contract's 'wager' function
      const user = accounts[0]; // Assuming the first account is the user's
      await contract.methods.wager(user, wagerAmount).send({
        from: user,
      });

      console.log('Wager successful');
    } catch (error) {
      console.error('Error waging:', error);
    }
  } else {
    alert('Web3 is not available. Please install a Web3-enabled browser or extension.');
  }
};


const Board = () => {
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

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [betAddedByPlayer1, setBetAddedByPlayer1] = useState(false);
  const [betAddedByPlayer2, setBetAddedByPlayer2] = useState(false);
  const [gameEnabled, setGameEnabled] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameWinner, setGameWinner] = useState(null);

  useEffect(() => {
    if (betAddedByPlayer1 && betAddedByPlayer2) {
      setGameEnabled(true);
    }
  }, [betAddedByPlayer1, betAddedByPlayer2]);

  const handleSquareClick = (row, col) => {
    if (gameEnabled && !gameEnded) {
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

        // Check if one side's king is no longer on the board
        if (!newBoard.flat().includes('k')) {
          setGameEnded(true);
          setGameWinner('Player 2'); // Set the winner's name to Player 2
        } else if (!newBoard.flat().includes('K')) {
          setGameEnded(true);
          setGameWinner('Player 1'); // Set the winner's name to Player 1
        }
      }
    }
  };

  const handleAddBet = () => {
    if (!betAddedByPlayer1) {
      setBetAddedByPlayer1(true);
      setBetAddedByPlayer2(true);
      connectToSmartContract();
      handleWager();
    }
  };

  const handleRestartGame = () => {
    // Reset the game state
    setBoard(initialBoard);
    setSelectedPiece(null);
    setBetAddedByPlayer1(false);
    setBetAddedByPlayer2(false);
    setGameEnabled(false);
    setGameEnded(false);
    setGameWinner(null);
  };

  const renderMessage = () => {
    if (gameEnded) {
      return (
        <>
          <Message>{gameWinner} has won!</Message>
          <Button onClick={handleRestartGame}>Start New Game</Button>
        </>
      );
    } else if (betAddedByPlayer1 && betAddedByPlayer2) {
      return <Message>Both players have already added a bet. The game has started!</Message>;
    }
    return null;
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
    <AppContainer>
      <ChessLabel>2-Player Chess Game</ChessLabel>
      <PlayerLabel>Player 1</PlayerLabel>
      <ChessBoardContainer>
        <ChessBoard isEnabled={gameEnabled}>{renderBoard()}</ChessBoard>
      </ChessBoardContainer>
      <PlayerLabel>Player 2</PlayerLabel>
      <ButtonContainer>
        {betAddedByPlayer1 && betAddedByPlayer2 ? (
          renderMessage()
        ) : (
          <>
            <Button onClick={handleAddBet}>Add 100 Bet</Button>
          </>
        )}
      </ButtonContainer>
    </AppContainer>
  );
};

export default Board;
