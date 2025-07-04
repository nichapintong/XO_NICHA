import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [winLine, setWinline] = useState(3);

  const [id, setId] = useState(0);

  const [his, setHis] = useState([]);

  const [board, setBoard] = useState(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(""))
  );

  const [showTableSize, setShowTableSize] = useState(false);

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
      // setId(response.data.id);
    } catch (error) {
      console.error("Error:", error);
    }

    const winner = checkWinner(position, winLine);

    if (winner) {
      console.log(`ผู้ชนะคือ: ${user}`);
      setId(0);
      setBoard(
        Array(winLine)
          .fill(null)
          .map(() => Array(winLine).fill(""))
      );
      return true;
    } else if (isBoardFull(position)) {
      console.log("เสมอ (Draw)");
      setId(0);
      setBoard(
        Array(winLine)
          .fill(null)
          .map(() => Array(winLine).fill(""))
      );
      return true;
    } else {
      console.log("ยังไม่มีผู้ชนะ");
      return false;
    }
  };

  const handleClick = async (rowIndex, colIndex) => {
    // ถ้ามี X หรือ O อยู่แล้ว ไม่ให้คลิก
    if (board[rowIndex][colIndex] !== "") return;

    // สร้างสำเนา board
    const newBoard = board.map((row) => [...row]);

    // ใส่ X ก่อน
    newBoard[rowIndex][colIndex] = "X";

    const final = await handlePosition(id, newBoard, "X");

    if (!final) {
      // หา cell ว่างอันแรกแล้วใส่ O (แบบง่าย ๆ)
      const emptyCells = [];
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board.length; c++) {
          if (newBoard[r][c] === "") {
            emptyCells.push({ r, c });
          }
        }
      }

      // ถ้ามีช่องว่างเหลือ → ให้ O เลือกแบบสุ่ม
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
      Array(winLine)
        .fill(null)
        .map(() => Array(winLine).fill(""))
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
  };

  const callHistory = async () => {
    setId(0);
    setBoard([]);
    try {
      const response2 = await axios.get("http://localhost:3000/call_history");
      // console.log(response2);

      const saveHis = response2.data.reduce((acc, obj) => {
        // เช็คว่ามี key ที่ตรงกับ id หรือยัง
        if (!acc[obj.idgameround]) {
          acc[obj.idgameround] = []; // ถ้าไม่มี ให้สร้างอาเรย์ว่างๆ
        }
        acc[obj.idgameround].push(obj); // เพิ่มอ็อบเจกต์ในอาเรย์ตาม id
        return acc; // ส่งผลลัพธ์กลับ
      }, {});

      console.log(Object.entries(saveHis));

      setHis(Object.entries(saveHis));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showHistory = async (values) => {
    setId(1);
    for (let i = 0; i < values.length; i++) {
      // Wait for 1 second before proceeding to the next iteration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Parse the position and update the board
      setBoard(JSON.parse(values[i].position));

      // Optionally log the item to see the history
      console.log(values[i]);
    }

    // setId(0);
    console.log(values);
  };

  return (
    <>
      <div className="content">
        <h1 className="game-title">XO GAME</h1>
        <div className="buttons">
          <button className="play-button" onClick={handleSubmit}>
            PLAY
          </button>
          <button className="history-button" onClick={callHistory}>
            HISTORY
          </button>
        </div>

        {showTableSize && (
          <div className="size-select">
            <label htmlFor="sizeSelect" className="size-label">
              เลือกขนาดตาราง :{" "}
            </label>
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
    </>
  );
}

export default App;
