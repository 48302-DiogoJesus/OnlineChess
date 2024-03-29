"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardObject = exports.BOARD_HEIGHT = exports.BOARD_WIDTH = void 0;
const piece_1 = require("./piece");
const position_1 = require("./position");
const errors_1 = __importDefault(require("../errors/errors"));
exports.BOARD_WIDTH = 8;
exports.BOARD_HEIGHT = 8;
/**
 * Board Object
 * Representation of a board and all it's permitted operations
 */
class BoardObject {
    /**
     * BoardObject Class contructor
     * @param {initBoard} If true it will initialize this.board with pieces at default positions (true by default)
     * @returns A new instance of BoardObject
     */
    constructor(initTurn = null, initBoard = true) {
        this.board = Array(exports.BOARD_HEIGHT).fill(null).map(() => Array(exports.BOARD_WIDTH).fill(null));
        this.winner = null;
        this.turn = piece_1.PieceColor.WHITE;
        this.moves = [];
        /**
         * Set Piece At
         * Set a piece at a certain board position
         * @param {position} Position in the board to put the new piece. Has a row and a column
         * @param {piece} Piece to place at [position] in the board
         * @returns A Piece if there is a piece at [position], null if not
         */
        this.setPieceAt = (position, piece) => this.board[position.row][position.column] = piece;
        /**
         * Get Piece At
         * Get the piece at a certain board position
         * @param {position} Position in the board. Has a row and a column
         * @returns A Piece if there is a piece at [position], null if not
         */
        this.getPieceAt = (position) => this.board[position.row][position.column];
        this.findKingPosition = () => {
            for (let row = 0; row < exports.BOARD_HEIGHT; row++) {
                for (let col = 0; col < exports.BOARD_WIDTH; col++) {
                    const currentPosition = (0, position_1.Position)(col, row);
                    const currentPiece = this.getPieceAt(currentPosition);
                    if (currentPiece instanceof piece_1.King && this.turn == currentPiece.color)
                        return currentPosition;
                }
            }
            return null;
        };
        this.generateAllPossibleTargets = (piecePosition) => {
            const possibleEndPositions = new Set();
            const piece = this.getPieceAt(piecePosition);
            if (piece === null)
                return new Set();
            for (let row = 0; row < exports.BOARD_HEIGHT; row++) {
                for (let col = 0; col < exports.BOARD_WIDTH; col++) {
                    const currentPosition = (0, position_1.Position)(col, row);
                    const pieceAtEndPos = this.getPieceAt((0, position_1.Position)(col, row));
                    // If piece is from the same player trying to make the move don't try it
                    if (pieceAtEndPos != null && pieceAtEndPos.color == piece.color)
                        continue;
                    const moveState = piece.checkMove((0, position_1.Move)((0, piece_1.pieceToChar)(piece), piecePosition, currentPosition), this);
                    if (moveState == piece_1.MoveState.OK) {
                        possibleEndPositions.add(currentPosition);
                    }
                }
            }
            return possibleEndPositions;
        };
        this.isInCheckMate = () => this.isInCheck() && (this.generateSafeKingTargets().size === 0);
        this.isInCheck = () => {
            const kingPosition = this.findKingPosition();
            if (kingPosition === null)
                return false;
            for (let row = 0; row < exports.BOARD_HEIGHT; row++) {
                for (let col = 0; col < exports.BOARD_WIDTH; col++) {
                    const piecePosition = (0, position_1.Position)(col, row);
                    const piece = this.getPieceAt(piecePosition);
                    if (piece != null && piece.color == (0, piece_1.getOpponent)(this.turn)) {
                        const possibleMovesForPiece = this.generateAllPossibleTargets(piecePosition);
                        possibleMovesForPiece.forEach(move => {
                            if (move.column === kingPosition.column && move.row === kingPosition.row)
                                return true;
                        });
                    }
                }
            }
            return false;
        };
        this.isPromotionMove = (moveAsString) => {
            const move = (0, position_1.stringToMove)(moveAsString);
            const piece = this.getPieceAt(move.start);
            const targetPiece = this.getPieceAt(move.end);
            if (targetPiece instanceof piece_1.King) {
                return false;
            }
            if (!(piece instanceof piece_1.Pawn)) {
                return false;
            }
            if (this.turn == piece_1.PieceColor.WHITE && move.end.row == 0) {
                return true;
            }
            if (this.turn == piece_1.PieceColor.BLACK && move.end.row == 7) {
                return true;
            }
            return false;
        };
        this.makeMove = (moveAsString) => {
            const move = (0, position_1.stringToMove)(moveAsString);
            const maybePromotionPiece = (0, piece_1.charToPiece)((0, piece_1.selectByPieceColor)(this.turn, move.pieceChar.toUpperCase(), move.pieceChar.toLowerCase()));
            const piece = this.getPieceAt(move.start);
            const capturePiece = this.getPieceAt(move.end);
            if (this.winner != null) {
                throw errors_1.default.ALREADY_OVER;
            }
            if (piece === null)
                throw errors_1.default.NO_PIECE_AT_START_POSITION;
            /*
            if (!(piece instanceof King) && this.isInCheck()) {
              throw ERROR.KING_IN_CHECK
            }
            */
            const isPromotion = maybePromotionPiece.toString().toUpperCase() != piece.toString().toUpperCase();
            if (
            // When true means Promotion
            isPromotion &&
                // Check if it is a Pawn and if it's not a game winning move
                (piece instanceof piece_1.Pawn) && !(capturePiece instanceof piece_1.King) &&
                // Check if it's valid promotion piece
                (maybePromotionPiece instanceof piece_1.Knight || maybePromotionPiece instanceof piece_1.Queen || maybePromotionPiece instanceof piece_1.Bishop || maybePromotionPiece instanceof piece_1.Rook)) {
                // Transform pawn
                this.setPieceAt(move.end, maybePromotionPiece);
                this.setPieceAt(move.start, null);
            }
            else {
                this.setPieceAt(move.end, piece);
                this.setPieceAt(move.start, null);
            }
            if (piece instanceof piece_1.Pawn)
                piece.hasMoved = true;
            // If this move makes the other player's King be in check and with nowhere to go tell board he won
            if (this.isInCheck() && this.generateSafeKingTargets().size === 0)
                this.winner = (0, piece_1.getOpponent)(this.turn);
            this.turn = (0, piece_1.getOpponent)(this.turn);
            this.updateWinner();
            this.moves.push(move);
        };
        /**
         * Set Board Row
         * Sets the pieces for a specific row on the board
         * @param {rowStr} Representation of the row as a string of [BOARD_WIDTH] characters
         * @param {rowNum} Row number to identify the row. From 0 to [BOARD_HEIGHT]
         */
        this.setRow = (rowStr, rowNum) => {
            for (let colNum = 0; colNum < exports.BOARD_WIDTH; colNum++) {
                const pieceChar = rowStr[colNum];
                if (pieceChar !== undefined) {
                    this.setPieceAt((0, position_1.Position)(colNum, rowNum), (0, piece_1.charToPiece)(pieceChar));
                }
            }
        };
        if (initBoard) {
            this.initBoard();
        }
        if (initTurn != null) {
            this.turn = initTurn;
        }
    }
    stringMoves() {
        return this.moves.map(move => (0, position_1.moveToString)(move));
    }
    /**
     * Initialize Board
     * Set the default rows with the default chess pieces in the current board
     */
    initBoard() {
        // Set White pieces
        this.setRow("rnbqkbnr", 0);
        this.setRow("pppppppp", 1);
        // Set Black pieces
        this.setRow("PPPPPPPP", exports.BOARD_HEIGHT - 2);
        this.setRow("RNBQKBNR", exports.BOARD_HEIGHT - 1);
    }
    static fromMoves(moves) {
        const baseBoard = new BoardObject();
        for (const move of moves) {
            baseBoard.makeMove(move);
        }
        return baseBoard;
    }
    generateSafeKingTargets() {
        const kingPosition = this.findKingPosition();
        if (kingPosition == null)
            return new Set();
        // Initial King Targets (Mutable set to remove in the end)
        // Could also return a new Set with the exclusion of both Sets
        const possibleKingTargets = this.generateAllPossibleTargets(kingPosition);
        // Set that will store the suicide positions for the King
        const collisions = new Set();
        this.setPieceAt(kingPosition, null);
        possibleKingTargets.forEach((target) => {
            // Remove King from the board to corretly make the predictions
            // For all the board pieces
            for (let row = 0; row < exports.BOARD_HEIGHT; row++) {
                for (let col = 0; col < exports.BOARD_WIDTH; col++) {
                    const enemyPosition = (0, position_1.Position)(col, row);
                    const enemyPiece = this.getPieceAt(enemyPosition);
                    const targetPiece = this.getPieceAt(target);
                    this.setPieceAt(target, null);
                    /*
                     If Enemy Piece Generate it's possible moves and those that match the
                     king targets are added to the "collisions" Set
                     */
                    if (enemyPiece != null && enemyPiece.color != this.turn) {
                        const possibleEnemyTargets = this.generateAllPossibleTargets(enemyPosition);
                        /*
                         If piece is a pawn it can only eat in diagonal so moving forward is not a threat to King
                         */
                        if (enemyPiece instanceof piece_1.Pawn) {
                            const direction = (0, piece_1.selectByPieceColor)(this.turn, -1, 1);
                            // Add diagonals as Pawn targets
                            if (enemyPosition.column < exports.BOARD_WIDTH - 1)
                                possibleEnemyTargets.add((0, position_1.Position)(enemyPosition.column + 1, enemyPosition.row - direction));
                            if (enemyPosition.column > 0)
                                possibleEnemyTargets.add((0, position_1.Position)(enemyPosition.column - 1, enemyPosition.row - direction));
                            // Remove targets in which pawn moves vertically
                            possibleEnemyTargets.forEach((enemyTarget) => {
                                if (enemyTarget.column == enemyPosition.column)
                                    possibleEnemyTargets.delete(enemyTarget);
                            });
                        }
                        // Remove suicide targets
                        possibleEnemyTargets.forEach((enemyTarget) => {
                            possibleKingTargets.forEach(target => {
                                if (enemyTarget.column === target.column && enemyTarget.row === target.row)
                                    collisions.add(enemyTarget);
                            });
                        });
                    }
                    // Put target piece back again
                    this.setPieceAt(target, targetPiece);
                }
            }
        });
        // Put King back to the board after predicting enemy targets
        this.setPieceAt(kingPosition, new piece_1.King(this.turn));
        /*
         Remove from the King targets the suicide positions
         */
        possibleKingTargets.forEach((kingPos) => {
            collisions.forEach(collision => {
                if (collision.column === kingPos.column && collision.row === kingPos.row)
                    possibleKingTargets.delete(kingPos);
            });
        });
        return possibleKingTargets;
    }
    updateWinner() {
        if (this.findKingPosition() == null) {
            this.winner = (0, piece_1.getOpponent)(this.turn);
        }
        const backupTurn = this.turn;
        this.turn = (0, piece_1.getOpponent)(this.turn);
        if (this.findKingPosition() == null) {
            this.winner = (0, piece_1.getOpponent)(this.turn);
        }
        this.turn = backupTurn;
    }
    /**
     * Board to String
     * Convert the current board to a string
     * @returns a string representation of this.board
     */
    toString() {
        var boardAsString = "";
        this.board.map((row, rowIdx) => row.map((col, colIdx) => {
            const piece = this.getPieceAt((0, position_1.Position)(colIdx, rowIdx));
            if (piece == null) {
                boardAsString += " ";
            }
            else {
                boardAsString += (0, piece_1.selectByPieceColor)(piece.color, piece.toString().toUpperCase(), piece.toString());
            }
        }));
        return boardAsString;
    }
}
exports.BoardObject = BoardObject;
