import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

  var isWinner = props.winner && props.winner.indexOf(props.squareIndex) > -1;

  return (
    <button
      className={isWinner? "square winner":"square"}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
        key={i}
        winner={winner}
        squareIndex={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
    var rows = [];
    for (var i = 0; i < 3; i++) {
      var cells = [];
      for (var j = i * 3; j < (i + 1) * 3; j++) {
        cells.push(this.renderSquare(j, this.props.winner));
      }
      rows.push(<div key={i} className="board-row">{cells}</div>);
    }
    
    return (
      <div>
        {rows}        
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null
      }],
      stepNumber: 0,
      xIsNext: true,
      currentSort: 'asc'
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;

    this.setState({
      history: history.concat([{
        squares: squares,
        row: row,
        col: col
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  toggleSort() {
    const newSort = this.state.currentSort === 'asc'? 'desc' : 'asc';
    this.setState({
      currentSort: newSort
    });    
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Ni dia: ", {prevProps, prevState});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = 
        move && move === this.state.stepNumber ?
          <b>Go to move # {move} ({step.row},{step.col})</b> :
        move ?
          <span>Go to move # {move} ({step.row},{step.col})</span> :
        'Phuc dont know React';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    if(this.state.currentSort == 'desc'){
      moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else if (this.state.stepNumber === 9) {
      status = 'It is a Draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let sortButton = moves.length > 1? 
      <ol>
        <button onClick={() => this.toggleSort()}>{(this.state.currentSort === 'asc'? 'Sort Desc' : 'Sort Asc')}</button>
      </ol> :
      '';

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winner={winner}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {status}
          </div>
          <ol>{moves}</ol>
          {sortButton}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
