import './tile.css'
import { Piece as PieceObject } from '../../../../../domain/piece';
import Piece from '../Piece/Piece'
import { PositionObject } from '../../../../../domain/position';

export enum TileColor { DARK, LIGHT }

export default function Tile(
  props: {
    selected: boolean,
    target: boolean,
    lastMove: boolean,

    position: PositionObject,
    color: TileColor,
    piece: PieceObject | null,
    onTileClick: () => void,
  }) {

  const calcTileBackground = () => {
    if (props.selected)
      return 'selected'

    if (props.target)
      if (props.piece == null)
        return 'target'
      else
        return 'targetpiece'

    if (props.lastMove) {
      return 'lastmove'
    }

    if (props.color === TileColor.DARK)
      return 'dark'
    else if (props.color === TileColor.LIGHT)
      return 'light'

  }

  return (
    <div className={'tile ' + calcTileBackground()} onClick={props.onTileClick}>
      {
        props.piece === null
          ?
          null
          :
          <Piece piece={props.piece} />
      }
    </div>
  );
}
