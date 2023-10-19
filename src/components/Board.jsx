import {useEffect, useState} from 'react'
import "./board.css"

const Xoxo = () => {
    const [board, setBoard] = useState([])
    const [xIsNext, setXIsNext] = useState(true)
    const [winner, setWinner] = useState(null)
    const [isDraw, setIsDraw] = useState(false)

    useEffect(() => {
        setWinner(checkWinner(board))
        checkDraw(board) && setIsDraw(true)
    }, [board])

    useEffect(() => {
        if(winner || isDraw) {
            const timeout = setTimeout(() => {
                setBoard([])
                setIsDraw(false)
                setWinner(null)
                setXIsNext(true)
            }, 3000)
            return () => {
                clearInterval(timeout)
            }
        }
    }, [winner, isDraw])

    function checkDraw(board) {
        return !winner && board.length && board.every(column => column.every(cell => cell))
    }

    function checkWinner(board) {
        for(let i = 0; i < board.length; i++) {
            if(board[i][0] && board[i].every(cell => cell === board[i][0])) {
                return board[i][0]
            }
        }
        for(let i = 0; i < board.length; i++) {
            if(board[0][i] && board.every(column => column[i] === board[0][i])) {
                return board[0][i]
            }
        }
        if(board.length && board[0][0] && board.every((column, index) => column[index] === board[0][0])) {
            return board[0][0]
        }
        if(board.length && board[0][board.length - 1] && board.every((column, index) => column[board.length - index - 1] === board[0][board.length - 1])) {
            return board[0][board.length - 1]
        }
        return null
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const num = +e.target.number.value
        if(num < 3 || num > 10) {
            return
        }
        setXIsNext(true)
        const array = new Array(num).fill(null).map(() => new Array(num).fill(null))
        setBoard(array)
        e.target.reset()
    }

    const handleClick = (e, columnIndex, cellIndex) => {
        const newBoard = [...board]
        if(newBoard[columnIndex][cellIndex] || winner) {
            return
        }
        newBoard[columnIndex][cellIndex] = xIsNext ? "X" : "O"
        setXIsNext(prev => !prev) 
        setBoard(newBoard)
    }

    return (
    <>
        <form action="" onSubmit={handleSubmit}>
            <input type="number" name='number' placeholder='Set the number of rows' required />
            <button type='submit'>Set</button>
        </form>
        {!!board.length && <div className='board' style={{gridTemplateColumns: `repeat(${board.length}, 1fr)`}} >
            {board.map((column, columnIndex) => {
                return <div key={columnIndex} className='column'>
                    {column.map((_, cellIndex) => {
                        return <div key={cellIndex} className='cell' onClick={(e) => handleClick(e, columnIndex, cellIndex)}>{board[columnIndex][cellIndex]}</div>
                    })}
                </div>
            })}
        </div>}
        {<div className="winner">{winner ? `${winner} wins!` : (isDraw ? "Draw!" : "")}</div>}
    </>
  )
}

export default Xoxo