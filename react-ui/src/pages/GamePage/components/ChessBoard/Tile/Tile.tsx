import './tile.css'
import { Piece as PieceObject } from '../../../../../domain/piece';
import Piece from '../Piece/Piece'
import { PositionObject } from '../../../../../domain/position';

export enum TileColor { DARK, LIGHT }

export default function Tile(
  props: {
    selected: boolean,
    target: boolean,
    position: PositionObject,
    color: TileColor,
    piece: PieceObject | null,
    onTileClick: () => void,
  }) {

  const calcTileBackground = () => {
    if (props.selected)
      return 'tile selected'

    if (props.target)
      return 'tile target'

    if (props.color === TileColor.DARK)
      return 'tile dark'
    else if (props.color === TileColor.LIGHT)
      return 'tile light'

  }

  return (
    <div className={calcTileBackground()} onClick={props.onTileClick}>
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
