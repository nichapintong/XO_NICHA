import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [boardSize, setBoardSize] = useState(3)
  const [winLine, setWinline] = useState(3);

  const [id, setId] = useState(0);

  const [his, setHis] = useState([]);

  const [board, setBoard] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(""))
  );

  const [showTableSize, setShowTableSize] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [saveWin, setSaveWin] = useState("X");

  function checkWinner(board, winLine) {
    const size = board.length;

    const directions = [
      { dr: 0, dc: 1 }, // →
      { dr: 1, dc: 0 }, // ↓
      { dr: 1, dc: 1 }, // ↘
      { dr: 1, dc: -1 }, // ↙
    ];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const current = board[r][c];
        if (current === "") continue;

        for (let { dr, dc } of directions) {
          let count = 1;
          let nr = r + dr;
          let nc = c + dc;

          while (
            count < winLine &&
            nr >= 0 &&
            nc >= 0 &&
            nr < size &&
            nc < size &&
            board[nr][nc] === current
          ) {
            count++;
            nr += dr;
            nc += dc;
          }

          if (count === winLine) {
            return current;
          }
        }
      }
    }

    return null;
  }

  function isBoardFull(board) {
    return board.every((row) => row.every((cell) => cell !== ""));
  }

  const handlePosition = async (ids, position, user) => {
    try {
      const response = await axios.post("http://localhost:3000/save_history", {
        id: ids,
        position: JSON.stringify(position),
      });

      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }

    const winner = checkWinner(position, winLine);

    if (winner) {
      console.log(`ผู้ชนะคือ: ${user}`);
      setId(0);
      setBoard(
        Array(boardSize)
          .fill(null)
          .map(() => Array(boardSize).fill(""))
      );
      setShowModal(true);
      setSaveWin(user);
      return true;
    } else if (isBoardFull(position)) {
      console.log("เสมอ (Draw)");
      setId(0);
      setBoard(
        Array(boardSize)
          .fill(null)
          .map(() => Array(boardSize).fill(""))
      );
      setShowModal(true);
      setSaveWin("เสมอ");
      return true;
    } else {
      console.log("ยังไม่มีผู้ชนะ");
      return false;
    }
  };

  const handleClick = async (rowIndex, colIndex) => {
    
    if (board[rowIndex][colIndex] !== "") return;

    
    const newBoard = board.map((row) => [...row]);

    
    newBoard[rowIndex][colIndex] = "X";

    const final = await handlePosition(id, newBoard, "X");

    if (!final) {
      
      const emptyCells = [];
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board.length; c++) {
          if (newBoard[r][c] === "") {
            emptyCells.push({ r, c });
          }
        }
      }

      
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { r, c } = emptyCells[randomIndex];
        newBoard[r][c] = "O";
      }

      const secondFinal = await handlePosition(id, newBoard, "O");
    }

    setBoard(newBoard);
  };

  const selectSize = (value) => {
    const intValue = parseInt(value, 10);
    console.log(intValue);

    setBoardSize(intValue);

    setBoard(
      Array(intValue)
        .fill(null)
        .map(() => Array(intValue).fill(""))
    );

    switch (intValue) {
      case 3:
        setWinline(3);
        break;
      case 4:
        setWinline(4);
        break;
      case 5:
        setWinline(4);
        break;
      default:
        setWinline(5);
        break;
    }
  };

  const handleSubmit = async () => {
    setBoard(
      Array(boardSize)
        .fill(null)
        .map(() => Array(boardSize).fill(""))
    );
    setHis(1);
    setShowTableSize(true);
    try {
      const response = await axios.post("http://localhost:3000/save_round");

      console.log(response);
      setId(response.data.id);
    } catch (error) {
      console.error("Error:", error);
    }
    setBoardSize(3);
  };

  const callHistory = async () => {
    setId(0);
    setBoard([]);
    try {
      const response2 = await axios.get("http://localhost:3000/call_history");
      

      const saveHis = response2.data.reduce((acc, obj) => {
        
        if (!acc[obj.idgameround]) {
          acc[obj.idgameround] = []; 
        }
        acc[obj.idgameround].push(obj); 
        return acc; 
      }, {});

      console.log(Object.entries(saveHis));

      setHis(Object.entries(saveHis));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  function getDifferencesFromString2(str1, str2) {
    const result = [];
    const maxLength = Math.max(str1.length, str2.length);

    for (let i = 0; i < maxLength; i++) {
      if (str1[i] !== str2[i]) {
        result.push({
          index: i,
          char: str2[i] || "ไม่มี",
        });
      }
    }

    return result;
  }

  const showHistory = async (values) => {
    setId(1);
    for (let i = 0; i < values.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBoard(JSON.parse(values[i].position));

      console.log(values[i]);
    }


  };

  const showRefresh = () =>{
    setId(0);

    setBoard(
      Array(boardSize)
        .fill(null)
        .map(() => Array(boardSize).fill(""))
    );

    setHis([]);

    setBoardSize(3);

  }

  return (
    <div>
      <div style={{ height: 20, width: "60vw", textAlign: "right" }}>
        <button
          className="history-button"
          style={{ height: 70, width: 140 }}
          onClick={callHistory}
        >
          HISTORY
        </button>
      </div>

      <div className="content">
        <h1 className="game-title">XO GAME</h1>
        {id === 0 && (
          <div className="size-select">
            <select
              id="sizeSelect"
              onChange={(e) => selectSize(e.target.value)}
              className="size-dropdown"
            >
              {[...Array(9)].map((_, i) => (
                <option key={i} value={i + 3}>
                  {i + 3}x{i + 3}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="buttons">
          <button
            className="play-button"
            style={{ height: 70, width: 140 }}
            onClick={handleSubmit}
          >
            PLAY
          </button>
          <button
            className="history-button"
            style={{ height: 70, width: 140, backgroundColor: "blue" }}
            onClick={showRefresh}
          >
            Refresh
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>ผู้ชนะคือ {saveWin}</h2>
              <button onClick={() => setShowModal(false)}>ปิด</button>
            </div>
          </div>
        )}

        {id !== 0 && (
          <table className="board-table">
            <tbody>
              {board.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className="board-cell"
                      onClick={() => handleClick(rowIndex, colIndex)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {his.length > 0 && (
          <div className="history">
            <h2>ประวัติการเล่น</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Game Round</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {his.map((item, index) => (
                  <tr key={index}>
                    <td>เกมรอบที่ {index + 1}</td>
                    <td>
                      <button
                        className="history-button"
                        onClick={() => showHistory(item[1])}
                      >
                        ตรวจสอบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
