"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const position_1 = require("../../model/position");
const errors_1 = __importDefault(require("../../errors/errors"));
const piece_1 = require("../../model/piece");
const board_1 = require("../../model/board");
describe('Board Game Tests', () => {
    const expectThrow = ((block, ...args) => {
        try {
            block(...args);
        }
        catch (err) {
            return err;
        }
    });
    afterEach(() => {
    });
    beforeEach(() => {
    });
    describe('Position Tests', () => {
        test('Valid String to Position 1', () => {
            const position = (0, position_1.stringToPosition)("a2");
            expect(position.column).toBe(0);
            expect(position.row).toBe(6);
        });
        test('Valid String to Position 2', () => {
            const position = (0, position_1.stringToPosition)("h8");
            expect(position.column).toBe(7);
            expect(position.row).toBe(0);
        });
        test('Invalid String to Position 1', () => {
            expect(expectThrow(position_1.stringToPosition, "i1").message).toBe(errors_1.default.INVALID_POSITION_CONVERSION.message);
        });
        test('Invalid String to Position 2', () => {
            expect(expectThrow(position_1.stringToPosition, "a9").message).toBe(errors_1.default.INVALID_POSITION_CONVERSION.message);
        });
        test('Valid Position to String 1', () => {
            const string = (0, position_1.positionToString)((0, position_1.Position)(0, 0));
            expect(string).toBe("a8");
        });
        test('Valid Position to String 2', () => {
            const string = (0, position_1.positionToString)((0, position_1.Position)(7, 7));
            expect(string).toBe("h1");
        });
        test('Valid Position to String 3', () => {
            const string = (0, position_1.positionToString)((0, position_1.Position)(1, 6));
            expect(string).toBe("b2");
        });
    });
    describe('Move Tests', () => {
        test('Valid String to Move 1', () => {
            const move = (0, position_1.stringToMove)("pb2b4");
            expect(move.toString()).toBe((0, position_1.Move)('p', (0, position_1.stringToPosition)("b2"), (0, position_1.stringToPosition)("b4")).toString());
        });
        test('Valid String to Move 2', () => {
            const move = (0, position_1.stringToMove)("na1h8");
            expect(move.toString()).toBe((0, position_1.Move)('n', (0, position_1.stringToPosition)("a1"), (0, position_1.stringToPosition)("h8")).toString());
        });
        test('Invalid String to Move 1', () => {
            expect(expectThrow(position_1.stringToMove, 'lb2b4').message).toBe(errors_1.default.INVALID_MOVE_CONVERSION.message);
        });
        test('Invalid String to Move 2', () => {
            expect(expectThrow(position_1.stringToMove, 'pb9b4').message).toBe(errors_1.default.INVALID_POSITION_CONVERSION.message);
        });
        test('Valid Move to String 1', () => {
            expect((0, position_1.moveToString)((0, position_1.Move)('p', (0, position_1.stringToPosition)("b2"), (0, position_1.stringToPosition)("b4")))).toBe("pb2b4");
        });
        test('Valid Move to String 2', () => {
            expect((0, position_1.moveToString)((0, position_1.Move)('n', (0, position_1.stringToPosition)("a1"), (0, position_1.stringToPosition)("h8")))).toBe("na1h8");
        });
    });
    describe('Piece Tests', () => {
        test('Init King piece', () => {
            const king = new piece_1.King(piece_1.PieceColor.BLACK);
            expect(king.color).toBe(piece_1.PieceColor.BLACK);
            expect(king.toString()).toBe('k');
        });
        test('Init Rook piece', () => {
            const rook = new piece_1.Rook(piece_1.PieceColor.WHITE);
            expect(rook.color).toBe(piece_1.PieceColor.WHITE);
            expect(rook.toString()).toBe('R');
        });
        test('Init Bishop piece', () => {
            const bishop = new piece_1.Bishop(piece_1.PieceColor.BLACK);
            expect(bishop.color).toBe(piece_1.PieceColor.BLACK);
            expect(bishop.toString()).toBe('b');
        });
        test('Init Queen piece', () => {
            const queen = new piece_1.Queen(piece_1.PieceColor.WHITE);
            expect(queen.color).toBe(piece_1.PieceColor.WHITE);
            expect(queen.toString()).toBe('Q');
        });
        test('Init Knight piece', () => {
            const knight = new piece_1.Knight(piece_1.PieceColor.BLACK);
            expect(knight.color).toBe(piece_1.PieceColor.BLACK);
            expect(knight.toString()).toBe('n');
        });
        test('Init Pawn piece', () => {
            const pawn = new piece_1.Pawn(piece_1.PieceColor.WHITE);
            expect(pawn.color).toBe(piece_1.PieceColor.WHITE);
            expect(pawn.toString()).toBe('P');
        });
        test('Valid Char to Piece', () => {
            const piece1 = (0, piece_1.charToPiece)('n');
            expect(piece1.color).toBe(piece_1.PieceColor.BLACK);
            expect(piece1.toString()).toBe('n');
            const piece2 = (0, piece_1.charToPiece)('N');
            expect(piece2.color).toBe(piece_1.PieceColor.WHITE);
            expect(piece2.toString()).toBe('N');
            const piece3 = (0, piece_1.charToPiece)('p');
            expect(piece3.color).toBe(piece_1.PieceColor.BLACK);
            expect(piece3.toString()).toBe('p');
        });
        test('Invalid Char to Piece', () => {
            expect((0, piece_1.charToPiece)('L')).toBeNull();
            expect((0, piece_1.charToPiece)('z')).toBeNull();
        });
        test('Piece to Char', () => {
            expect((0, piece_1.pieceToChar)(new piece_1.King(piece_1.PieceColor.WHITE))).toBe('K');
            expect((0, piece_1.pieceToChar)(new piece_1.Pawn(piece_1.PieceColor.WHITE))).toBe('P');
            expect((0, piece_1.pieceToChar)(new piece_1.Bishop(piece_1.PieceColor.BLACK))).toBe('b');
            expect((0, piece_1.pieceToChar)(new piece_1.Rook(piece_1.PieceColor.WHITE))).toBe('R');
        });
    });
    describe('Board Tests', () => {
        test('Init Default Board', () => {
            const board = new board_1.BoardObject();
            expect(board.board.length).toBe(8);
            expect(board.board[0].length).toBe(8);
            expect(board.board[7].length).toBe(8);
            expect(board.turn).toBe(piece_1.PieceColor.WHITE);
            expect(board.winner).toBeNull();
            expect(board.toString()).toBe('rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR');
        });
        test('Set Piece and Get Piece 1', () => {
            const board = new board_1.BoardObject();
            board.setPieceAt((0, position_1.stringToPosition)("b2"), new piece_1.Knight(piece_1.PieceColor.WHITE));
            expect(board.getPieceAt((0, position_1.stringToPosition)("b2")).toString()).toBe((new piece_1.Knight(piece_1.PieceColor.WHITE)).toString());
        });
        test('Set Piece and Get Piece 2', () => {
            const board = new board_1.BoardObject();
            board.setPieceAt((0, position_1.stringToPosition)("h7"), new piece_1.Pawn(piece_1.PieceColor.WHITE));
            expect(board.getPieceAt((0, position_1.stringToPosition)("h2")).toString()).toBe((new piece_1.Pawn(piece_1.PieceColor.WHITE)).toString());
            expect(board.getPieceAt((0, position_1.stringToPosition)("h7")).toString()).toBe((new piece_1.Pawn(piece_1.PieceColor.WHITE)).toString());
            expect(board.toString()).toBe('rnbqkbnrpppppppP                                PPPPPPPPRNBQKBNR');
            board.setPieceAt((0, position_1.stringToPosition)("a1"), new piece_1.Pawn(piece_1.PieceColor.BLACK));
            expect(board.toString()).toBe('rnbqkbnrpppppppP                                PPPPPPPPpNBQKBNR');
        });
    });
    describe('Board Moves Tests', () => {
        test('Make initial pawn move 2 steps', () => {
            const board = new board_1.BoardObject();
            const testMove = "pb2b4";
            expect(board.getPieceAt((0, position_1.stringToPosition)("b2")).checkMove((0, position_1.stringToMove)("pb2b4"), board)).toBe(piece_1.MoveState.OK);
            expect(board.getPieceAt((0, position_1.stringToPosition)("b2")).checkMove((0, position_1.stringToMove)("pb2b3"), board)).toBe(piece_1.MoveState.OK);
            expect(board.getPieceAt((0, position_1.stringToPosition)("b2")).checkMove((0, position_1.stringToMove)("pb2a1"), board)).toBe(piece_1.MoveState.PATH_INVALID);
            board.makeMove(testMove);
            expect(board.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR');
        });
        test('Make knight move', () => {
            var _a, _b;
            const board = new board_1.BoardObject();
            expect((_a = board.getPieceAt((0, position_1.stringToPosition)("b1"))) === null || _a === void 0 ? void 0 : _a.checkMove((0, position_1.stringToMove)("nb1a3"), board)).toBe(piece_1.MoveState.OK);
            board.makeMove("nb1a3");
            expect((_b = board.getPieceAt((0, position_1.stringToPosition)("a3"))) === null || _b === void 0 ? void 0 : _b.toString()).toBe((new piece_1.Knight(piece_1.PieceColor.WHITE).toString()));
        });
        /*
        test('Test king in check', () => {
            const board = new BoardObject()

            board.setPieceAt(stringToPosition('d7'), new Pawn(PieceColor.WHITE))
            expect(board.getPieceAt(stringToPosition('d7'))?.toString()).toBe('P')
            expect(board.turn).toBe(PieceColor.WHITE)
            board.turn = PieceColor.BLACK
            expect(board.turn).toBe(PieceColor.BLACK)
            expect(board.isInCheck()).toBe(true)
        })

        test('Test king in checkmate', () => {
            const board = new BoardObject()

            board.setPieceAt(stringToPosition('c8'), new Queen(PieceColor.WHITE))
            expect(board.getPieceAt(stringToPosition('c8'))?.toString()).toBe('Q')
            board.setPieceAt(stringToPosition('d8'), null)
            expect(board.turn).toBe(PieceColor.WHITE)
            board.turn = PieceColor.BLACK
            expect(board.turn).toBe(PieceColor.BLACK)
            expect(board.isInCheckMate()).toBe(true)
        })
        */
        test('Test eating king', () => {
            var _a;
            const board = new board_1.BoardObject();
            board.setPieceAt((0, position_1.stringToPosition)('c8'), new piece_1.Queen(piece_1.PieceColor.WHITE));
            expect((_a = board.getPieceAt((0, position_1.stringToPosition)('c8'))) === null || _a === void 0 ? void 0 : _a.toString()).toBe('Q');
            board.setPieceAt((0, position_1.stringToPosition)('d8'), null);
            board.makeMove("qc8e8");
            expect(board.winner).toBe(piece_1.PieceColor.WHITE);
            board.turn = piece_1.PieceColor.BLACK;
            // Doesnt matter if is valid or not
            expect(expectThrow(board.makeMove, "pb2b4").message).toBe(errors_1.default.ALREADY_OVER.message);
        });
        test('Test promotion', () => {
            var _a;
            const board = new board_1.BoardObject();
            board.setPieceAt((0, position_1.stringToPosition)('c7'), new piece_1.Pawn(piece_1.PieceColor.WHITE));
            expect((_a = board.getPieceAt((0, position_1.stringToPosition)('c7'))) === null || _a === void 0 ? void 0 : _a.toString()).toBe('P');
            board.makeMove("qc7b8");
            // Doesnt matter if is valid or not
            expect(board.getPieceAt((0, position_1.stringToPosition)("b8")).toString()).toBe("Q");
        });
        test('Test find king position', () => {
            const board = new board_1.BoardObject();
            board.setPieceAt((0, position_1.stringToPosition)('e2'), null);
            board.setPieceAt((0, position_1.stringToPosition)('f2'), null);
            expect(board.getPieceAt((0, position_1.stringToPosition)('f2'))).toBeNull();
            board.makeMove("ke1f2");
            // Doesnt matter if is valid or not
            expect(board.getPieceAt((0, position_1.stringToPosition)("f2")).toString()).toBe("K");
            expect(board.findKingPosition().toString()).toBe((0, position_1.stringToPosition)("e8").toString());
            board.turn = piece_1.PieceColor.WHITE;
            expect(board.findKingPosition().toString()).toBe((0, position_1.stringToPosition)("f2").toString());
        });
        test('Board to String default', () => {
            const board = new board_1.BoardObject();
            expect(board.toString()).toBe('rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR');
        });
        test('Board to String with move', () => {
            const board = new board_1.BoardObject();
            board.makeMove("pb2b4");
            expect(board.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR');
        });
    });
});
