import { 
  Piece,
  charToPiece,
  selectByPieceColor,
  PieceColor,
  King,
  Pawn,
  Knight,
  Queen,
  Rook,
  Bishop, 
  getOpponent,
  pieceToChar,
  MoveState
} from './piece'
import { PositionObject, Position, stringToMove, range, Move } from './position'
import ERRORS from './model-errors'

export const BOARD_WIDTH = 8;
export const BOARD_HEIGHT = 8;

/**
 * Board Object
 * Representation of a board and all it's permitted operations
 */
export class BoardObject {

  board: Array<Array<Piece | null>> = Array(BOARD_HEIGHT).fill(null).map(()=>Array(BOARD_WIDTH).fill(null));
  winner: PieceColor | null = null
  turn: PieceColor = PieceColor.WHITE

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

  /**
   * Set Piece At
   * Set a piece at a certain board position
   * @param {position} Position in the board to put the new piece. Has a row and a column
   * @param {piece} Piece to place at [position] in the board
   * @returns A Piece if there is a piece at [position], null if not
   */
  setPieceAt = (position: PositionObject, piece: Piece | null) => this.board[position.row][position.column] = piece

  /**
   * Get Piece At
   * Get the piece at a certain board position
   * @param {position} Position in the board. Has a row and a column
   * @returns A Piece if there is a piece at [position], null if not
   */
  getPieceAt = (position: PositionObject) => this.board[position.row][position.column]

  findKingPosition = (): PositionObject | null => {
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
          const currentPosition = Position(col, row)
          const currentPiece = this.getPieceAt(currentPosition)
          if (currentPiece instanceof King && this.turn == currentPiece.color)
            return currentPosition
      }
    }
    return null
  }

  generateAllPossibleTargets = (piecePosition: PositionObject): Set<PositionObject> => {
    const possibleEndPositions = new Set<PositionObject>()
    const piece = this.getPieceAt(piecePosition)
    if (piece === null)
      return possibleEndPositions

      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            const currentPosition = Position(col, row)
            const pieceAtEndPos = this.getPieceAt(Position(col, row))

            // If piece is from the same player trying to make the move don't try it
            if (pieceAtEndPos != null && pieceAtEndPos.color == piece.color)
              continue
            
            const moveState = piece.checkMove(Move(pieceToChar(piece), piecePosition, currentPosition), this)

            if (moveState == MoveState.OK) {
              possibleEndPositions.add(currentPosition)
            }
        }
    }
    return possibleEndPositions
  }

  generateSafeKingTargets(): Set<PositionObject> {
    const kingPosition = this.findKingPosition()

    if (kingPosition == null)
      return new Set<PositionObject>()

    // Initial King Targets (Mutable set to remove in the end)
    // Could also return a new Set with the exclusion of both Sets
    const possibleKingTargets = this.generateAllPossibleTargets(kingPosition)

    // Set that will store the suicide positions for the King
    const collisions = new Set<PositionObject>()

    this.setPieceAt(kingPosition, null)

    for (const target of possibleKingTargets) {
        // Remove King from the board to corretly make the predictions
        // For all the board pieces
        for (let row = 0; row < BOARD_HEIGHT; row++) {
          for (let col = 0; col < BOARD_WIDTH; col++) {
                const enemyPosition = Position(col, row)
                const enemyPiece = this.getPieceAt(enemyPosition)

                const targetPiece = this.getPieceAt(target)
                this.setPieceAt(target, null)
                /*
                 If Enemy Piece Generate it's possible moves and those that match the
                 king targets are added to the "collisions" Set
                 */
                if (enemyPiece != null && enemyPiece.color != this.turn) {
                    const possibleEnemyTargets = this.generateAllPossibleTargets(enemyPosition)
                    /*
                     If piece is a pawn it can only eat in diagonal so moving forward is not a threat to King
                     */
                    if (enemyPiece instanceof Pawn) {
                        const direction = selectByPieceColor(this.turn, -1, 1)
                        // Add diagonals as Pawn targets
                        if (enemyPosition.column < BOARD_WIDTH - 1)
                            possibleEnemyTargets.add(Position(enemyPosition.column + 1, enemyPosition.row - direction))
                        if (enemyPosition.column > 0)
                            possibleEnemyTargets.add(Position(enemyPosition.column - 1, enemyPosition.row - direction))

                        // Remove targets in which pawn moves vertically
                        possibleEnemyTargets.forEach((enemyTarget: PositionObject) => {
                          if (enemyTarget.column == enemyPosition.column)
                            possibleEnemyTargets.delete(enemyTarget)
                        })
                    }
                    // Remove suicide targets
                    for (const enemyTarget of possibleEnemyTargets) {
                        for (const target of possibleKingTargets) {
                          if (enemyTarget.column === target.column && enemyTarget.row === target.row)
                            collisions.add(enemyTarget)
                        }
                    }
                }
                // Put target piece back again
                this.setPieceAt(target, targetPiece)
            }
        }
    }
    // Put King back to the board after predicting enemy targets
    this.setPieceAt(kingPosition, new King(this.turn))
    /*
     Remove from the King targets the suicide positions
     */
    possibleKingTargets.forEach((kingPos: PositionObject) => {
      for (const collision of collisions) {
        if (collision.column === kingPos.column && collision.row === kingPos.row)
          possibleKingTargets.delete(kingPos)
      }
    })
    return possibleKingTargets
  }

  isInCheckMate = () => this.isInCheck() && (this.generateSafeKingTargets().size === 0)

  isInCheck = (): boolean => {
    const kingPosition = this.findKingPosition()
    if (kingPosition === null) return false

    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        const piecePosition = Position(col, row)
        const piece = this.getPieceAt(piecePosition)
        if (piece != null && piece.color == getOpponent(this.turn)) {
          const possibleMovesForPiece = this.generateAllPossibleTargets(piecePosition)
          for (const move of possibleMovesForPiece) {
            if (move.column === kingPosition.column && move.row === kingPosition.row)  
              return true
          }
        }
      }
    }
    return false
  }

  makeMove = (moveAsString: string) => {
    const move = stringToMove(moveAsString)
    const maybePromotionPiece = charToPiece(selectByPieceColor(this.turn, move.pieceChar.toUpperCase(), move.pieceChar.toLowerCase()))!!
    const piece = this.getPieceAt(move.start) 
    const capturePiece = this.getPieceAt(move.end)

    if (this.winner !== null) {
      throw ERRORS.ALREADY_OVER
    }

    if (piece === null) throw ERRORS.NO_PIECE_AT_START_POSITION

    if (!(piece instanceof King) && this.isInCheck()) {
      throw ERRORS.KING_IN_CHECK
    }

    if (
      // When true means Promotion
      maybePromotionPiece.toString().toUpperCase() != piece.toString().toUpperCase() &&
      // Check if it is a Pawn and if it's not a game winning move
      (piece instanceof Pawn) && !(capturePiece instanceof King) &&
      // Check if it's valid promotion piece
      (maybePromotionPiece instanceof Knight || maybePromotionPiece instanceof Queen || maybePromotionPiece instanceof Bishop || maybePromotionPiece instanceof Rook)
    ) {
        // Transform pawn
        this.setPieceAt(move.end, maybePromotionPiece)
        this.setPieceAt(move.start, null)
    } else {
        this.setPieceAt(move.end, piece)
        this.setPieceAt(move.start, null)
    }

    if (piece instanceof Pawn)
        piece.hasMoved = true

    if (capturePiece instanceof King)
        this.winner = this.turn

    this.turn = getOpponent(this.turn)

    // If this move makes the other player's King be in check and with nowhere to go tell board he won
    if (this.isInCheck() && this.generateSafeKingTargets().size === 0)
        this.winner = getOpponent(this.turn)
  }

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
        boardAsString += selectByPieceColor(piece.color, piece.toString().toUpperCase(), piece.toString())
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
        this.setPieceAt(Position(colNum, rowNum), charToPiece(rowStr[colNum])!!)
      }
    }
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
        const piece: Piece | null = charToPiece(pieceChar)
        // [piece] will be null if char does not correspond to a piece. Case of the " " representing an empty Tile
        newBoard.setPieceAt(Position(col, row), piece)
    }
  }
  return newBoard
}