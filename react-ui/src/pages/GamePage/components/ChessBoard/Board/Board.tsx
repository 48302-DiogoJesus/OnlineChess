import './board.css'

import Tile, { TileColor } from '../Tile/Tile';
import { BoardObject } from '../../../../../domain/board'
import { Move, moveToString, Position, PositionObject } from '../../../../../domain/position'
import { BoardError } from '../../../../../domain/errors';
import { Piece, PieceColor } from '../../../../../domain/piece';
import { useState } from 'react';
import Alerts from '../../../../../utils/Alerts/sa-alerts';

interface TileWrapper { tile: PositionObject | null }

const initSelectedTile: TileWrapper = { tile: null }
const initTargetTiles: PositionObject[] = []

export default function Board(
  props: {
    singleplayer: boolean

    board: BoardObject,
    local_player_pieces: PieceColor

    isViewer: boolean
    game_over: boolean

    turn: PieceColor

    onMakeMove: (move: string) => void
    onError: (error: BoardError) => void
  }
) {

  const [selectedTile, setSelectedTile] = useState(initSelectedTile)
  const [targetTiles, setTargetTiles] = useState(initTargetTiles)
  const board = props.board

  function buildTile(row: number, column: number, piece: Piece | null) {
    return (
      <Tile
        piece={board.getPieceAt(Position(column, row))}

        // Tile state
        selected={isSelected(row, column)}
        target={isTarget(row, column)}

        // DARK or LIGHT 
        color={calcTileColor(row, column)}

        // Position
        position={Position(column, row)}

        // Events
        onTileClick={() => handleTileClick(row, column, piece)}
      />
    )
  }

  const calcTileColor = (row: number, col: number) =>
    (col + row) % 2 === 0 ? TileColor.LIGHT : TileColor.DARK

  const isTarget = (row: number, col: number) =>
    !props.game_over && targetTiles.find((pos) => pos.row === row && pos.column === col) != undefined

  const isSelected = (row: number, col: number) =>
    !props.game_over && (row == selectedTile.tile?.row && col == selectedTile.tile?.column)

  const handleTileClick = (row: number, col: number, pieceClicked: Piece | null) => {
    setSelectedTile({ tile: null })
    setTargetTiles([])

    if (props.game_over || props.isViewer)
      return

    if (!props.singleplayer && board.turn != props.local_player_pieces) {
      Alerts.showNotification("Not your turn")
      return
    }

    const positionClicked = Position(col, row)

    // 1. TILE IS SELECTED
    if (selectedTile?.tile != null) {

      // CLICKED SELECTED TILE AGAIN. JUST UNSELECT
      if (isSelected(positionClicked.row, positionClicked.column)) {
        return
      }
      // CLICKED A TARGET - MAKE MOVE
      if (isTarget(positionClicked.row, positionClicked.column)) {
        const selectedPiece = board.getPieceAt(selectedTile.tile)
        // board.makeMove(moveToString(Move(selectedPiece!!.toString(), selectedTile.tile, positionClicked)))
        props.onMakeMove(moveToString(Move(selectedPiece!!.toString(), selectedTile.tile, positionClicked)))
        return
      }

      // Select a tile + Show Possible Targets
      if (pieceClicked?.color == props.local_player_pieces) {
        setSelectedTile({ tile: positionClicked })
        const targets = Array.from(board.generateAllPossibleTargets(positionClicked))
        setTargetTiles(targets)
      }
    }
    // 2. TILE IS NOT SELECTED
    else {
      // Select a tile + Show Possible Targets
      if (pieceClicked?.color == props.local_player_pieces) {
        setSelectedTile({ tile: positionClicked })
        const targets = Array.from(board.generateAllPossibleTargets(positionClicked))
        setTargetTiles(targets)
      }
    }
  }

  return (
    <div className="board">
      <div>
        {
          board.board.map((row, rowIdx) => {
            return (
              <div className="board-row">
                {row.map((piece, colIdx) => buildTile(rowIdx, colIdx, piece))}
              </div>
            )
          }
          )
        }
      </div>
    </div>
  );
}
