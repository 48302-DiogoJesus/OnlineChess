/**
 * Position Object
 * Represents a position in a 2D environment such as a matrix
 * @property {column}
 * @property {row}
 */
export interface PositionObject {
    column: number,
    row: number
}

/**
 * Position
 * Build a position object
 * @param {column}
 * @param {row}
 * @returns a new PositionObject with the given {column} and {row}
 */
export const Position = (column: number, row: number): PositionObject => {
    return { column, row }
} 