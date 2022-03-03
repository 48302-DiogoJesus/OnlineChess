/**
 * Piece Object
 * Schema of a PieceObject
 * @property {color} Color of the piece: Black or White
 * @property {type} Piece type: Pawn, Rook, Knight, King, Queen, Bishop
 */
 export interface PieceObject {
    color: PieceColor,
    type: PieceType
}

/**
 * Piece Color
 */
export enum PieceColor { 
    BLACK = 'b', 
    WHITE = 'w'
}

/**
 * Select by PieceColor
 * @param {piece} PieceObject to evaluate the color from
 * @param {ifWhite} Return this value if [piece] is white
 * @param {ifBlack} Return this value if [piece] is black
 * @returns {ifWhite} if {piece} is white, {ifBlack} if {ifWhite} is black
 */
export function selectByPieceColor<T>(piece: PieceObject, ifWhite: T, ifBlack: T) : T {
    return piece.color === PieceColor.WHITE ? ifWhite : ifBlack
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

/**
 * Char to Piece
 * Convert a char to a valid Piece if possible
 * If [char] is a valid piece find its color:
 * - If char in CAPS: WHITE
 * - Else: BLACK
 * @param {char} Character to try convert to a PieceObject
 * @returns A new PieceObject built from the [char] if valid, null if not
 */
export function charToPiece(char: string): PieceObject | null {
    if (char.length !== 1)
        return null
    // array.find returns the element if it finds it (a PieceType)
    const pieceType = [PieceType.PAWN, PieceType.KING, PieceType.QUEEN, PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP]
    .find(elem => char.toLowerCase() === elem)

    if (pieceType === undefined)
        return null
    return {
        color: char.toUpperCase() === char ? PieceColor.WHITE : PieceColor.BLACK,
        type: pieceType
    }
}