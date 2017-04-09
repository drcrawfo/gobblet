'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Array.prototype.peek = function () {
  return this[this.length - 1];
};

function Square(props) {
  var className = 'square' + (props.isSelected ? ' selected' : '');
  className += props.player && props.player === 1 ? ' player1' : '';
  return React.createElement(
    'button',
    { className: className, onClick: function onClick() {
        return props.onClick();
      } },
    props.value
  );
}

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board() {
    _classCallCheck(this, Board);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Board.prototype.renderSquare = function renderSquare(i) {
    var _this2 = this;

    var squares = this.props.squares;
    var selectedPiece = this.props.selectedPiece;
    var isSelected = selectedPiece && selectedPiece.originType === 'board' && selectedPiece.origin === i;
    return React.createElement(Square, {
      player: squares[i].peek() && squares[i].peek().player,
      value: squares[i].peek() && squares[i].peek().size,
      isSelected: isSelected,
      onClick: function onClick() {
        return _this2.props.onClick(i);
      }
    });
  };

  Board.prototype.render = function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'board-row' },
        this.renderSquare(0),
        this.renderSquare(1),
        this.renderSquare(2),
        this.renderSquare(3)
      ),
      React.createElement(
        'div',
        { className: 'board-row' },
        this.renderSquare(4),
        this.renderSquare(5),
        this.renderSquare(6),
        this.renderSquare(7)
      ),
      React.createElement(
        'div',
        { className: 'board-row' },
        this.renderSquare(8),
        this.renderSquare(9),
        this.renderSquare(10),
        this.renderSquare(11)
      ),
      React.createElement(
        'div',
        { className: 'board-row' },
        this.renderSquare(12),
        this.renderSquare(13),
        this.renderSquare(14),
        this.renderSquare(15)
      )
    );
  };

  return Board;
}(React.Component);

var PlayerStacks = function (_React$Component2) {
  _inherits(PlayerStacks, _React$Component2);

  function PlayerStacks() {
    _classCallCheck(this, PlayerStacks);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  PlayerStacks.prototype.renderStack = function renderStack(i) {
    var _this4 = this;

    var stack = this.props.stacks[i];
    var player = this.props.player;
    var selectedPiece = this.props.selectedPiece;
    var selectedPieceFromHere = selectedPiece && selectedPiece.origin === i && selectedPiece.player === player && selectedPiece.originType === 'stack';
    var content = selectedPieceFromHere ? selectedPiece.size : stack.peek() || '—';
    var className = 'player-stack' + (selectedPieceFromHere ? ' selected' : '');
    return React.createElement(
      'div',
      { className: className, onClick: function onClick() {
          return _this4.props.onClick(i, player);
        } },
      content
    );
  };

  PlayerStacks.prototype.render = function render() {
    var className = 'stack-container';
    className += this.props.currPlayer === this.props.player ? ' active' : '';
    className += this.props.player === 1 ? ' player1' : '';
    return React.createElement(
      'div',
      { className: className },
      React.createElement(
        'div',
        null,
        this.renderStack(0),
        this.renderStack(1),
        this.renderStack(2)
      )
    );
  };

  return PlayerStacks;
}(React.Component);

var Game = function (_React$Component3) {
  _inherits(Game, _React$Component3);

  function Game() {
    _classCallCheck(this, Game);

    var _this5 = _possibleConstructorReturn(this, _React$Component3.call(this));

    _this5.state = {
      history: [{
        squares: Array(16).fill([])
      }],
      stepNumber: 0,
      xIsNext: true,
      selectedPiece: null,
      playerStacks: {
        0: [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]],
        1: [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]
      }
    };
    return _this5;
  }

  Game.prototype.handlePlayerStackClick = function handlePlayerStackClick(i, player) {
    var currentPlayer = this.state.xIsNext ? 0 : 1;
    if (currentPlayer !== player) {
      return;
    }

    var playerStacks = this.state.playerStacks;

    var newPiece = undefined;
    var currPiece = this.state.selectedPiece;
    if (currPiece && currPiece.originType === 'stack' && currPiece.origin === i) {
      newPiece = null;
    } else {
      newPiece = playerStacks[player][i].peek();
      if (newPiece === null) {
        return;
      }
    }

    var selectedPiece = newPiece && {
      player: player,
      size: newPiece,
      origin: i,
      originType: 'stack'
    };

    this.setState({
      selectedPiece: selectedPiece
    });
  };

  Game.prototype.handleBoardClick = function handleBoardClick(i) {
    var _this6 = this;

    var history = this.state.history.slice(0, this.state.stepNumber + 1);
    var current = history[history.length - 1];
    var squares = current.squares.map(function (pieces) {
      return pieces.slice();
    });
    var currentPlayer = this.state.xIsNext ? 0 : 1;

    if (!this.state.selectedPiece) {
      var potentialPiece = squares[i].peek();
      if (potentialPiece && potentialPiece.player === currentPlayer) {
        this.setState({
          selectedPiece: {
            player: currentPlayer,
            originType: 'board',
            origin: i,
            size: potentialPiece.size
          }
        });
      }
      return;
    }

    if (this.state.selectedPiece.originType === 'board' && this.state.selectedPiece.origin === i && this.state.selectedPiece.player === currentPlayer) {
      this.setState({
        selectedPiece: null
      });
      return;
    }
    if (calculateWinner(squares)) {
      return;
    }
    if (squares[i].peek() && squares[i].peek().size >= this.state.selectedPiece.size) {
      return;
    }

    squares[i].push(Object.assign({}, this.state.selectedPiece, {
      originType: 'board',
      origin: i
    }));

    if (this.state.selectedPiece.originType === 'board') {
      squares[this.state.selectedPiece.origin].pop();
    }

    var playerStacks = {
      0: this.state.playerStacks[0].map(function (stack, stackNum) {
        if (_this6.state.selectedPiece.originType === 'stack' && _this6.state.selectedPiece.player === 0 && _this6.state.selectedPiece.origin === stackNum) {
          return stack.slice(0, -1);
        }
        return stack.slice();
      }),
      1: this.state.playerStacks[1].map(function (stack, stackNum) {
        if (_this6.state.selectedPiece.originType === 'stack' && _this6.state.selectedPiece.player === 1 && _this6.state.selectedPiece.origin === stackNum) {
          return stack.slice(0, -1);
        }
        return stack.slice();
      })
    };

    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selectedPiece: null,
      playerStacks: playerStacks
    });
  };

  Game.prototype.jumpTo = function jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 ? false : true
    });
  };

  Game.prototype.render = function render() {
    var _this7 = this;

    var history = this.state.history;
    var current = history[this.state.stepNumber];

    var winner = calculateWinner(current.squares);
    var status = undefined;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    var moves = history.map(function (step, move) {
      var desc = move ? 'Move #' + move : 'Game start';
      return React.createElement(
        'li',
        { key: move },
        React.createElement(
          'a',
          { href: '#', onClick: function onClick() {
              return _this7.jumpTo(move);
            } },
          desc
        )
      );
    });

    return React.createElement(
      'div',
      { className: 'inner' },
      React.createElement(
        'div',
        null,
        React.createElement(PlayerStacks, {
          onClick: function onClick(i, p) {
            return _this7.handlePlayerStackClick(i, p);
          },
          stacks: this.state.playerStacks[0],
          player: 0,
          selectedPiece: this.state.selectedPiece,
          currPlayer: this.state.xIsNext ? 0 : 1
        })
      ),
      React.createElement(
        'div',
        { className: 'game' },
        React.createElement(
          'div',
          null,
          React.createElement(Board, {
            squares: current.squares,
            selectedPiece: this.state.selectedPiece,
            onClick: function onClick(i) {
              return _this7.handleBoardClick(i);
            }
          })
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(PlayerStacks, {
          onClick: function onClick(i, p) {
            return _this7.handlePlayerStackClick(i, p);
          },
          stacks: this.state.playerStacks[1],
          player: 1,
          selectedPiece: this.state.selectedPiece,
          currPlayer: this.state.xIsNext ? 0 : 1
        })
      )
    );
  };

  return Game;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('container'));

function calculateWinner(squares) {
  return null;
  var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (var i = 0; i < lines.length; i++) {
    var _lines$i = lines[i];
    var a = _lines$i[0];
    var b = _lines$i[1];
    var c = _lines$i[2];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}