import { Move, moveToString, Position, positionToString, stringToMove, stringToPosition } from "../../model/position"
import ERRORS, { ErrorObject } from '../../errors/errors'
import { Bishop, charToPiece, King, Knight, MoveState, Pawn, Piece, PieceColor, pieceToChar, Queen, Rook } from "../../model/piece"
import { BoardObject, stringToBoard } from "../../model/board"

describe('Board Game Tests',() => {

    const expectThrow = ((block: (...args: any[]) => any, ...args: any[]) => {
        try {
            block(...args)
        } catch (err) {
            return (err as ErrorObject)
        }
    })

    afterEach(() => {

    })

    beforeEach(() => {

    })
    
    describe('Position Tests', () => {
        test('Valid String to Position 1', () => {
            const position = stringToPosition("a2")
            expect(position.column).toBe(0)
            expect(position.row).toBe(6)
        })

        test('Valid String to Position 2', () => {
            const position = stringToPosition("h8")
            expect(position.column).toBe(7)
            expect(position.row).toBe(0)
        })

        test('Invalid String to Position 1', () => {
            expect(expectThrow(stringToPosition, "i1")!!.message).toBe(ERRORS.INVALID_POSITION_CONVERSION.message)
        })

        test('Invalid String to Position 2', () => {
            expect(expectThrow(stringToPosition, "a9")!!.message).toBe(ERRORS.INVALID_POSITION_CONVERSION.message)
        })

        test('Valid Position to String 1', () => {
            const string = positionToString(Position(0, 0))
            expect(string).toBe("a8")
        })

        test('Valid Position to String 2', () => {
            const string = positionToString(Position(7, 7))
            expect(string).toBe("h1")
        })

        test('Valid Position to String 3', () => {
            const string = positionToString(Position(1, 6))
            expect(string).toBe("b2")
        })
    })

    describe('Move Tests', () => {
        test('Valid String to Move 1', () => {
            const move = stringToMove("pb2b4")
            expect(move.toString()).toBe(Move('p', stringToPosition("b2"), stringToPosition("b4")).toString())
        })

        test('Valid String to Move 2', () => {
            const move = stringToMove("na1h8")
            expect(move.toString()).toBe(Move('n', stringToPosition("a1"), stringToPosition("h8")).toString())
        })

        test('Invalid String to Move 1', () => {
            expect(expectThrow(stringToMove, 'lb2b4')!!.message).toBe(ERRORS.INVALID_MOVE_CONVERSION.message)
        })

        test('Invalid String to Move 2', () => {
            expect(expectThrow(stringToMove, 'pb9b4')!!.message).toBe(ERRORS.INVALID_POSITION_CONVERSION.message)
        })

        test('Valid Move to String 1', () => {
            expect(moveToString(Move('p', stringToPosition("b2"), stringToPosition("b4")))).toBe("pb2b4")
        })

        test('Valid Move to String 2', () => {
            expect(moveToString(Move('n', stringToPosition("a1"), stringToPosition("h8")))).toBe("na1h8")
        })
    })

    describe('Piece Tests', () => {
        
        test('Init King piece', () => {
            const king = new King(PieceColor.BLACK)
            expect(king.color).toBe(PieceColor.BLACK)
            expect(king.toString()).toBe('k')
        })

        test('Init Rook piece', () => {
            const rook = new Rook(PieceColor.WHITE)
            expect(rook.color).toBe(PieceColor.WHITE)
            expect(rook.toString()).toBe('R')
        })

        test('Init Bishop piece', () => {
            const bishop = new Bishop(PieceColor.BLACK)
            expect(bishop.color).toBe(PieceColor.BLACK)
            expect(bishop.toString()).toBe('b')
        })
        
        test('Init Queen piece', () => {
            const queen = new Queen(PieceColor.WHITE)
            expect(queen.color).toBe(PieceColor.WHITE)
            expect(queen.toString()).toBe('Q')
        })

        test('Init Knight piece', () => {
            const knight = new Knight(PieceColor.BLACK)
            expect(knight.color).toBe(PieceColor.BLACK)
            expect(knight.toString()).toBe('n')
        })

        test('Init Pawn piece', () => {
            const pawn = new Pawn(PieceColor.WHITE)
            expect(pawn.color).toBe(PieceColor.WHITE)
            expect(pawn.toString()).toBe('P')
        })

        test('Valid Char to Piece', () => {
            const piece1 = charToPiece('n')
            expect(piece1!!.color).toBe(PieceColor.BLACK)
            expect(piece1!!.toString()).toBe('n')
            const piece2 = charToPiece('N')
            expect(piece2!!.color).toBe(PieceColor.WHITE)
            expect(piece2!!.toString()).toBe('N')
            const piece3 = charToPiece('p')
            expect(piece3!!.color).toBe(PieceColor.BLACK)
            expect(piece3!!.toString()).toBe('p')
        })

        test('Invalid Char to Piece', () => {
            expect(charToPiece('L')).toBeNull()
            expect(charToPiece('z')).toBeNull()
        })

        test('Piece to Char', () => {
            expect(pieceToChar(new King(PieceColor.WHITE))).toBe('K')
            expect(pieceToChar(new Pawn(PieceColor.WHITE))).toBe('P')
            expect(pieceToChar(new Bishop(PieceColor.BLACK))).toBe('b')
            expect(pieceToChar(new Rook(PieceColor.WHITE))).toBe('R')
        })
        
    })

    describe('Board Tests', () => {
        
        test('Init Default Board', () => {
            const board = new BoardObject()
            expect(board.board.length).toBe(8)
            expect(board.board[0].length).toBe(8)
            expect(board.board[7].length).toBe(8)
            expect(board.turn).toBe(PieceColor.WHITE)
            expect(board.winner).toBeNull()
            expect(board.toString()).toBe('rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR')
        })

        test('Set Piece and Get Piece 1', () => {
            const board = new BoardObject()
            board.setPieceAt(stringToPosition("b2"), new Knight(PieceColor.WHITE))
            expect(board.getPieceAt(stringToPosition("b2"))!!.toString()).toBe((new Knight(PieceColor.WHITE)).toString())
        })

        test('Set Piece and Get Piece 2', () => {
            const board = new BoardObject()
            board.setPieceAt(stringToPosition("h7"), new Pawn(PieceColor.WHITE))
            expect(board.getPieceAt(stringToPosition("h2"))!!.toString()).toBe((new Pawn(PieceColor.WHITE)).toString())
            expect(board.getPieceAt(stringToPosition("h7"))!!.toString()).toBe((new Pawn(PieceColor.WHITE)).toString())
            expect(board.toString()).toBe('rnbqkbnrpppppppP                                PPPPPPPPRNBQKBNR')
            board.setPieceAt(stringToPosition("a1"), new Pawn(PieceColor.BLACK))
            expect(board.toString()).toBe('rnbqkbnrpppppppP                                PPPPPPPPpNBQKBNR')
        })
        
    })

    describe('Board Moves Tests', () => {
        
        test('Make initial pawn move 2 steps', () => {
            const board = new BoardObject()
            const testMove = "pb2b4"

            expect(board.getPieceAt(stringToPosition("b2"))!!.checkMove(stringToMove("pb2b4"), board)).toBe(MoveState.OK)
            expect(board.getPieceAt(stringToPosition("b2"))!!.checkMove(stringToMove("pb2b3"), board)).toBe(MoveState.OK)
            expect(board.getPieceAt(stringToPosition("b2"))!!.checkMove(stringToMove("pb2a1"), board)).toBe(MoveState.PATH_INVALID)
            
            board.makeMove(testMove)

            expect(board.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR')
        })
        
        test('Make knight move', () => {
            const board = new BoardObject()
            
            expect(board.getPieceAt(stringToPosition("b1"))?.checkMove(stringToMove("nb1a3"), board)).toBe(MoveState.OK)
            
            board.makeMove("nb1a3")

            expect(board.getPieceAt(stringToPosition("a3"))?.toString()).toBe((new Knight(PieceColor.WHITE).toString()))
        })
        
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
        
        test('Test eating king', () => {
            const board = new BoardObject()

            board.setPieceAt(stringToPosition('c8'), new Queen(PieceColor.WHITE))
            expect(board.getPieceAt(stringToPosition('c8'))?.toString()).toBe('Q')
            board.setPieceAt(stringToPosition('d8'), null)
            board.makeMove("qc8e8")
            expect(board.winner).toBe(PieceColor.WHITE)
            board.turn = PieceColor.BLACK
            // Doesnt matter if is valid or not
            expect(expectThrow(board.makeMove, "pb2b4")!!.message).toBe(ERRORS.ALREADY_OVER.message)
        })
        

        test('Test promotion', () => {
            const board = new BoardObject()

            board.setPieceAt(stringToPosition('c7'), new Pawn(PieceColor.WHITE))
            expect(board.getPieceAt(stringToPosition('c7'))?.toString()).toBe('P')
            board.makeMove("qc7b8")
            // Doesnt matter if is valid or not
            expect(board.getPieceAt(stringToPosition("b8"))!!.toString()).toBe("Q")
        })

        test('Test find king position', () => {
            const board = new BoardObject()

            board.setPieceAt(stringToPosition('e2'), null)
            board.setPieceAt(stringToPosition('f2'), null)
            expect(board.getPieceAt(stringToPosition('f2'))).toBeNull()
            board.makeMove("ke1f2")
            // Doesnt matter if is valid or not
            expect(board.getPieceAt(stringToPosition("f2"))!!.toString()).toBe("K")
            
            expect(board.findKingPosition()!!.toString()).toBe(stringToPosition("e8").toString())

            board.turn = PieceColor.WHITE

            expect(board.findKingPosition()!!.toString()).toBe(stringToPosition("f2").toString())
        })

        test('Board to String default', () => {
            const board = new BoardObject()
            expect(board.toString()).toBe('rnbqkbnrpppppppp                                PPPPPPPPRNBQKBNR')
        })

        test('Board to String with move', () => {
            const board = new BoardObject()
            board.makeMove("pb2b4")
            expect(board.toString()).toBe('rnbqkbnrpppppppp                 P              P PPPPPPRNBQKBNR')
        })

        test('Valid String to Board', () => {
            const board = stringToBoard("rnbqkbnrppKppppp                                P PPPPPPRNBQKBNR")
            expect(board?.getPieceAt(stringToPosition("c7"))?.toString()).toBe("K")
            expect(board?.getPieceAt(stringToPosition("b2"))).toBeNull()
            expect(board?.getPieceAt(stringToPosition("a2"))?.toString()).toBe("P")
        })

        test('Invalid String to Board', () => {
            expect(expectThrow(stringToBoard, "dfgdfa")!!.message).toBe(ERRORS.BAD_BOARD_STRING.message)
        })

        test('String to Board to String to board', () => {
            const board = stringToBoard("rnbqkbnrpppppppP                                P PPPPPPRNBQKBNR")!!
            board.makeMove("pc2c4")
            expect(board?.getPieceAt(stringToPosition("c4"))?.toString()).toBe("P")
            expect(board?.getPieceAt(stringToPosition("h7"))?.toString()).toBe("P")
            expect(board.toString()).toBe('rnbqkbnrpppppppP                  P             P  PPPPPRNBQKBNR')
        })
    })
})