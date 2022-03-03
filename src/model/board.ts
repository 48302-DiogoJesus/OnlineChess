import { PieceObject, charToPiece, selectByPieceColor } from './piece'
import { PositionObject, Position } from './position'

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

/**
 * Board Object
 * Representation of a board and all it's permitted operations
 */
export class BoardObject {

  /**
   * BoardObject Class contructor
   * @param {initBoard} If true it will initialize this.board with pieces at default positions (true by default)
   * @returns A new instance of BoardObject
   */ 
  constructor(initBoard: boolean = true) {
    if (initBoard) {
      this.initBoard()
    }
  }

  // The board representation itelf. a matrix with 8 rows and 8 columns
  board: Array<Array<PieceObject | null>> = Array(BOARD_HEIGHT).fill(null).map(()=>Array(BOARD_WIDTH).fill(null));

  /**
   * Set Piece At
   * Set a piece at a certain board position
   * @param {position} Position in the board to put the new piece. Has a row and a column
   * @param {piece} Piece to place at [position] in the board
   * @returns A PieceObject if there is a piece at [position], null if not
   */
  setPieceAt = (position: PositionObject, piece: PieceObject | null) => this.board[position.row][position.column] = piece

  /**
   * Get Piece At
   * Get the piece at a certain board position
   * @param {position} Position in the board. Has a row and a column
   * @returns A PieceObject if there is a piece at [position], null if not
   */
  getPieceAt = (position: PositionObject) => this.board[position.row][position.column]

  /**
   * Board to String
   * Convert the current board to a string
   * @returns a string representation of this.board
   */
  toString() {
    var boardAsString: string = ""
    this.board.map((row, rowIdx) => row.map((col, colIdx) => { 
      const piece = this.getPieceAt(Position(colIdx, rowIdx))
      if (piece == null) {
        boardAsString += " "
      } else { 
        boardAsString += selectByPieceColor(piece, piece.type.toUpperCase(), piece.type)
      }
    }))
    return boardAsString
  }

  /**
   * Set Board Row
   * Sets the pieces for a specific row on the board
   * @param {rowStr} Representation of the row as a string of [BOARD_WIDTH] characters
   * @param {rowNum} Row number to identify the row. From 0 to [BOARD_HEIGHT]
   */
  setRow = (rowStr: string, rowNum: number) => {
    for (let colNum = 0; colNum < BOARD_WIDTH; colNum++) {
      const pieceChar = rowStr[colNum]
      if (pieceChar !== undefined) {
        this.setPieceAt(Position(colNum, rowNum), charToPiece(rowStr[colNum]))
      }
    }
  }

  /**
   * Initialize Board
   * Set the default rows with the default chess pieces in the current board
   */
  initBoard() {
    // Set White pieces
    this.setRow("rnbqkbnr", 0)
    this.setRow("pppppppp", 1)
    // Set Black pieces
    this.setRow("PPPPPPPP", BOARD_HEIGHT - 2)
    this.setRow("RNBQKBNR", BOARD_HEIGHT - 1)
  }
}

/**
 * String to Board
 * Convert a string to a board
 * If a char corresponds to a valid piece set that piece in the {newBoard}, if not set an empty Tile in the {newBoard}
 * @param {boardAsString} Example of a default board: "rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR"
 * @returns A new BoardObject if {boardAsString} is convertible to a board, null if not
 */
function stringToBoard(boardAsString: string): BoardObject | null {
  if (boardAsString.length < BOARD_WIDTH * BOARD_HEIGHT)
    return null
  const newBoard = new BoardObject()
  for (let row = 0, currChar = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++, currChar++) {
      const pieceChar = boardAsString[currChar]
        const piece: PieceObject | null = charToPiece(pieceChar)
        // [piece] will be null if char does not correspond to a piece. Case of the " " representing an empty Tile
        newBoard.setPieceAt(Position(col, row), piece)
    }
  }
  return newBoard
}