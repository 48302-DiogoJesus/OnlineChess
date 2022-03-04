import { BoardObject } from "./board"
import { MoveObject, Position } from "./position"

/**
 * Piece Object
 * Schema of a PieceObject
 * @property {color} Color of the piece: Black or White
 * @property {type} Piece type: Pawn, Rook, Knight, King, Queen, Bishop

 export interface PieceObject {
    color: PieceColor,
    type: PieceType
}
 */
/**
 * Piece Color
 */

export enum PieceColor {
  BLACK = 'b',
  WHITE = 'w',
}

export function getOpponent(pieceColor: PieceColor) {
    return pieceColor === PieceColor.BLACK ? PieceColor.WHITE : PieceColor.BLACK;
}

/**
 * Select by PieceColor
 * @param {piece} PieceObject to evaluate the color from
 * @param {ifWhite} Return this value if [piece] is white
 * @param {ifBlack} Return this value if [piece] is black
 * @returns {ifWhite} if {piece} is white, {ifBlack} if {ifWhite} is black
 */
export function selectByPieceColor<T>(pieceColor: PieceColor, ifWhite: T, ifBlack: T) : T {
    return pieceColor === PieceColor.WHITE ? ifWhite : ifBlack
}

/**
 * Piece Type
 */
export enum PieceType {
    PAWN = 'p', 
    KING = 'k', 
    QUEEN = 'q', 
    ROOK = 'r', 
    KNIGHT = 'n',
    BISHOP = 'b'
}

enum Direction { UP, DOWN, LEFT, RIGHT } 

export enum MoveState { OK, NO_CHANGE, PATH_INVALID, PATH_BLOCKED, DEST_BLOCKED }

function calculateDirection(move: MoveObject) {
    const result = new Set()
    
    if (move.end.row < move.start.row)
        result.add(Direction.UP)
    else if (move.end.row > move.start.row)
        result.add(Direction.DOWN)
    
    if (move.end.column < move.start.column)
        result.add(Direction.LEFT)
    else if (move.end.column > move.start.column)
        result.add(Direction.RIGHT)
    
    return result
}

export abstract class Piece {
    abstract color: PieceColor;
    abstract validPath: (move: MoveObject, board: BoardObject) => boolean;
    pathBlocked = (move: MoveObject, board: BoardObject): boolean => {
        const direction = calculateDirection(move)
        const current = Position(move.start.column, move.start.row)

        while (true) {
            if (direction.has(Direction.UP)) 
                current.row--
            if (direction.has(Direction.DOWN))
                current.row++
            if (direction.has(Direction.LEFT))
                current.column--
            if (direction.has(Direction.RIGHT))
                current.column++

            if (current.column == move.end.column && current.row == move.end.row) {
                return false
            }
            
            if (board.getPieceAt(current) !== null) 
                return true
        }
    };
    destinationBlocked = (move: MoveObject, board: BoardObject): boolean => {
        const other = board.getPieceAt(move.end)
        if (other == null || other == undefined)
            return false
        return other.color == this.color
    };
    checkMove(move: MoveObject, board: BoardObject): MoveState {
        if (move.start == move.end)
            return MoveState.NO_CHANGE
        if (!this.validPath(move, board))
            return MoveState.PATH_INVALID
        if (!(board.getPieceAt(move.start) instanceof Knight) && this.pathBlocked(move, board))
            return MoveState.PATH_BLOCKED
        if (this.destinationBlocked(move, board))
            return MoveState.DEST_BLOCKED

        return MoveState.OK
    };
    abstract toString(): string;
} 

export class King extends Piece {
    color: PieceColor
    constructor(pieceColor: PieceColor) {
        super()
        this.color = pieceColor
    }
    override validPath = (move: MoveObject, board: BoardObject): boolean => {
        const absoluteRow = Math.abs(move.start.row - move.end.row)
        const absoluteColumn = Math.abs(move.start.column - move.end.column)
        return absoluteRow <= 1 && absoluteColumn <= 1
    }
    toString = (): string => pieceToChar(this)
}

export class Rook extends Piece {
    color: PieceColor
    constructor(pieceColor: PieceColor) {
        super()
        this.color = pieceColor
    }
    override validPath = (move: MoveObject, board: BoardObject): boolean => {
        return move.start.column == move.end.column || move.start.row == move.end.row
    }
    toString = (): string => pieceToChar(this)
}

export class Bishop extends Piece {
    color: PieceColor
    constructor(pieceColor: PieceColor) {
        super()
        this.color = pieceColor
    }
    override validPath = (move: MoveObject, board: BoardObject): boolean => {
        return Math.abs(move.start.column - move.end.column) == Math.abs(move.start.row - move.end.row)
    }
    toString = (): string => pieceToChar(this)
}

export class Queen extends Piece {
    color: PieceColor
    constructor(pieceColor: PieceColor) {
        super()
        this.color = pieceColor
    }
    override validPath = (move: MoveObject, board: BoardObject): boolean => {
        return move.start.row == move.end.row
            || move.start.column == move.end.column
            || Math.abs(move.start.row - move.end.row) == Math.abs(move.start.column - move.end.column)
    }
    toString = (): string => pieceToChar(this)
}

export class Knight extends Piece {
    color: PieceColor
    constructor(pieceColor: PieceColor) {
        super()
        this.color = pieceColor
    }
    override validPath = (move: MoveObject, board: BoardObject): boolean => {
        return Math.abs(move.end.column - move.start.column) == 2 && Math.abs(move.end.row - move.start.row) == 1
        || Math.abs(move.end.column - move.start.column) == 1 && Math.abs(move.end.row - move.start.row) == 2
    }
    toString = (): string => pieceToChar(this)
}

export class Pawn extends Piece {

    hasMoved = false
    color: PieceColor

    constructor(pieceColor: PieceColor) {
        super()
        this.color = pieceColor
    }
    override validPath = (move: MoveObject, board: BoardObject): boolean => {
        const steps = this.hasMoved ? 1 : 2
        const direction = selectByPieceColor(this.color, -1, 1)
        
        return (
                // Vertical movement
                move.start.column == move.end.column
                && (direction == -1 ?
                    (board.getPieceAt(move.end) == null && move.start.row > move.end.row && move.start.row - move.end.row <= steps)
                    :
                    (board.getPieceAt(move.end) == null && move.end.row > move.start.row && move.end.row - move.start.row <= steps)
                )
            ) 
            || 
            (
                // Horizontal movement
                Math.abs(move.start.column - move.end.column) == 1
                && move.end.row - move.start.row == direction
                && board.getPieceAt(move.end) != null
            )
    }
    toString = (): string => pieceToChar(this)
}

const charPieceMap = {
    'K': King,
    'R': Rook,
    'B': Bishop,
    'Q': Queen,
    'N': Knight,
    'P': Pawn
}

export const charToPiece = (char: string) => {
    for (const entry of Object.entries(charPieceMap)) {
        if (entry[0] === char.toUpperCase()) {
            const color = char === char.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK
            return new entry[1](color)
        }
    }
    return null
}

export const pieceToChar = (piece: Piece) => {
    let pieceChar
    if (piece instanceof Knight) {
        pieceChar = 'N'
    } else {
        pieceChar = piece.constructor.name[0]
    }
    return selectByPieceColor(piece.color, pieceChar.toUpperCase(), pieceChar.toLowerCase())
}