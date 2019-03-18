import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      // to keep track of the step that we're viewing
      stepNumber: 0,
      // setting X as first player
      xIsNext: true
    };
  }

  handleClick(i) {
    // This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // if calculateWinner is true or a square is occupied then DON'T continue to handleClick
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // ternary operator alternates "player values" and symbols in array
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // sets state of current player to alternate player after turn is taken
    this.setState({
      history: history.concat([
        {
          // replaces old copy of array with new copy
          squares: squares
        }
      ]),
      // ensures we dont get stuck showing the same move after a new one has been made
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  // allows user to access history in buttons
  jumpTo(step) {
    this.setState({
      // keeps track of each current step
      stepNumber: step,
      // toggles on each step
      // X starts and goes on every even turn
      xIsNext: step % 2 === 0
    });
  }

  render() {
    // allows access to board's history
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the history of the board can be accessed through these buttons
    // buttons are mapped with history array data
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      // .map generates a list
      return (
        /* here we added move indices as the key for each list item */
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
// calculate whether a player has won
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
