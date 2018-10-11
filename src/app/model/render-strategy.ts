import { BathtubCell } from './bathtub-cell';
import { tempToColor } from './utilities';

export abstract class RenderStrategy {
  private enabled: boolean;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  render(cell: BathtubCell) {
    if (this.enabled) {
      this.show(cell);
    }
  }

  protected abstract show(cell: BathtubCell);
  protected abstract hide(cell: BathtubCell);
  abstract getName();

}

export class RenderCell extends RenderStrategy {

  protected show(cell: BathtubCell) {
    cell.ref.attr('fill', tempToColor(cell.temp));
  }

  protected hide(cell: BathtubCell) {
    cell.ref.attr('visibility', 'hidden');
  }

  getName() {
    return 'render-cell';
  }
}

export class RenderDiagonal extends RenderStrategy {

  protected show(cell: BathtubCell) {
    // throw new Error("Method not implemented.");
  }

  protected hide(cell: BathtubCell) {
    // throw new Error("Method not implemented.");
  }

  getName() {
    return 'render-diagonal';
  }


}
