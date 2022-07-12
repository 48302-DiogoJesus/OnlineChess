"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pieceToChar = exports.charToPiece = exports.Pawn = exports.Knight = exports.Queen = exports.Bishop = exports.Rook = exports.King = exports.Piece = exports.MoveState = exports.PieceType = exports.selectByPieceColor = exports.getOpponent = exports.PieceColor = void 0;
const position_1 = require("./position");
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
var PieceColor;
(function (PieceColor) {
    PieceColor["BLACK"] = "b";
    PieceColor["WHITE"] = "w";
})(PieceColor = exports.PieceColor || (exports.PieceColor = {}));
function getOpponent(pieceColor) {
    return pieceColor === PieceColor.BLACK ? PieceColor.WHITE : PieceColor.BLACK;
}
exports.getOpponent = getOpponent;
/**
 * Select by PieceColor
 * @param {piece} PieceObject to evaluate the color from
 * @param {ifWhite} Return this value if [piece] is white
 * @param {ifBlack} Return this value if [piece] is black
 * @returns {ifWhite} if {piece} is white, {ifBlack} if {ifWhite} is black
 */
function selectByPieceColor(pieceColor, ifWhite, ifBlack) {
    return pieceColor === PieceColor.WHITE ? ifWhite : ifBlack;
}
exports.selectByPieceColor = selectByPieceColor;
/**
 * Piece Type
 */
var PieceType;
(function (PieceType) {
    PieceType["PAWN"] = "p";
    PieceType["KING"] = "k";
    PieceType["QUEEN"] = "q";
    PieceType["ROOK"] = "r";
    PieceType["KNIGHT"] = "n";
    PieceType["BISHOP"] = "b";
})(PieceType = exports.PieceType || (exports.PieceType = {}));
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
var MoveState;
(function (MoveState) {
    MoveState[MoveState["OK"] = 0] = "OK";
    MoveState[MoveState["NO_CHANGE"] = 1] = "NO_CHANGE";
    MoveState[MoveState["PATH_INVALID"] = 2] = "PATH_INVALID";
    MoveState[MoveState["PATH_BLOCKED"] = 3] = "PATH_BLOCKED";
    MoveState[MoveState["DEST_BLOCKED"] = 4] = "DEST_BLOCKED";
})(MoveState = exports.MoveState || (exports.MoveState = {}));
function calculateDirection(move) {
    const result = new Set();
    if (move.end.row < move.start.row)
        result.add(Direction.UP);
    else if (move.end.row > move.start.row)
        result.add(Direction.DOWN);
    if (move.end.column < move.start.column)
        result.add(Direction.LEFT);
    else if (move.end.column > move.start.column)
        result.add(Direction.RIGHT);
    return result;
}
class Piece {
    constructor() {
        this.pathBlocked = (move, board) => {
            const direction = calculateDirection(move);
            const current = (0, position_1.Position)(move.start.column, move.start.row);
            while (true) {
                if (direction.has(Direction.UP))
                    current.row--;
                if (direction.has(Direction.DOWN))
                    current.row++;
                if (direction.has(Direction.LEFT))
                    current.column--;
                if (direction.has(Direction.RIGHT))
                    current.column++;
                if (current.column == move.end.column && current.row == move.end.row) {
                    return false;
                }
                if (board.getPieceAt(current) !== null)
                    return true;
            }
        };
        this.destinationBlocked = (move, board) => {
            const other = board.getPieceAt(move.end);
            if (other == null || other == undefined)
                return false;
            return other.color == this.color;
        };
    }
    checkMove(move, board) {
        if (move.start == move.end)
            return MoveState.NO_CHANGE;
        if (!this.validPath(move, board))
            return MoveState.PATH_INVALID;
        if (!(board.getPieceAt(move.start) instanceof Knight) && this.pathBlocked(move, board))
            return MoveState.PATH_BLOCKED;
        if (this.destinationBlocked(move, board))
            return MoveState.DEST_BLOCKED;
        return MoveState.OK;
    }
    ;
}
exports.Piece = Piece;
class King extends Piece {
    constructor(pieceColor) {
        super();
        this.validPath = (move, board) => {
            const absoluteRow = Math.abs(move.start.row - move.end.row);
            const absoluteColumn = Math.abs(move.start.column - move.end.column);
            return absoluteRow <= 1 && absoluteColumn <= 1;
        };
        this.toString = () => this.color == PieceColor.WHITE ? 'K' : 'k';
        this.color = pieceColor;
    }
}
exports.King = King;
class Rook extends Piece {
    constructor(pieceColor) {
        super();
        this.validPath = (move, board) => {
            return move.start.column == move.end.column || move.start.row == move.end.row;
        };
        this.toString = () => this.color == PieceColor.WHITE ? 'R' : 'r';
        this.color = pieceColor;
    }
}
exports.Rook = Rook;
class Bishop extends Piece {
    constructor(pieceColor) {
        super();
        this.validPath = (move, board) => {
            return Math.abs(move.start.column - move.end.column) == Math.abs(move.start.row - move.end.row);
        };
        this.toString = () => this.color == PieceColor.WHITE ? 'B' : 'b';
        this.color = pieceColor;
    }
}
exports.Bishop = Bishop;
class Queen extends Piece {
    constructor(pieceColor) {
        super();
        this.validPath = (move, board) => {
            return move.start.row == move.end.row
                || move.start.column == move.end.column
                || Math.abs(move.start.row - move.end.row) == Math.abs(move.start.column - move.end.column);
        };
        this.toString = () => this.color == PieceColor.WHITE ? 'Q' : 'q';
        this.color = pieceColor;
    }
}
exports.Queen = Queen;
class Knight extends Piece {
    constructor(pieceColor) {
        super();
        this.validPath = (move, board) => {
            return Math.abs(move.end.column - move.start.column) == 2 && Math.abs(move.end.row - move.start.row) == 1
                || Math.abs(move.end.column - move.start.column) == 1 && Math.abs(move.end.row - move.start.row) == 2;
        };
        this.toString = () => this.color == PieceColor.WHITE ? 'N' : 'n';
        this.color = pieceColor;
    }
}
exports.Knight = Knight;
class Pawn extends Piece {
    constructor(pieceColor) {
        super();
        this.hasMoved = false;
        this.validPath = (move, board) => {
            const steps = this.hasMoved ? 1 : 2;
            const direction = selectByPieceColor(this.color, -1, 1);
            return (
            // Vertical movement
            move.start.column == move.end.column
                && (direction == -1 ?
                    (board.getPieceAt(move.end) == null && move.start.row > move.end.row && move.start.row - move.end.row <= steps)
                    :
                        (board.getPieceAt(move.end) == null && move.end.row > move.start.row && move.end.row - move.start.row <= steps)))
                ||
                    (
                    // Horizontal movement
                    Math.abs(move.start.column - move.end.column) == 1
                        && move.end.row - move.start.row == direction
                        && board.getPieceAt(move.end) != null);
        };
        this.toString = () => this.color == PieceColor.WHITE ? 'P' : 'p';
        this.color = pieceColor;
    }
}
exports.Pawn = Pawn;
const charPieceMap = {
    'K': King,
    'R': Rook,
    'B': Bishop,
    'Q': Queen,
    'N': Knight,
    'P': Pawn,
};
const charToPiece = (char) => {
    const charUpper = char.toUpperCase();
    const color = char === char.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK;
    for (const entry of Object.entries(charPieceMap)) {
        const pieceChar = entry[0];
        const pieceClass = entry[1];
        if (pieceChar === charUpper) {
            const newPiece = new pieceClass(color);
            return newPiece;
        }
    }
    return null;
};
exports.charToPiece = charToPiece;
const pieceToChar = (piece) => {
    let pieceChar;
    if (piece instanceof Knight) {
        pieceChar = 'N';
    }
    else {
        pieceChar = piece.constructor.name[0];
    }
    return selectByPieceColor(piece.color, pieceChar.toUpperCase(), pieceChar.toLowerCase());
};
exports.pieceToChar = pieceToChar;
