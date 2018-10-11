import { Selection, BaseType } from 'd3';
import { tempToColor } from './utilities';
import { UpdateStrategy } from './update-strategy';

export class BathtubCell {

  protected ref: Selection<BaseType, {}, HTMLElement, any>;
  public temp: number;
  public newTemp: number;
  public northCell: BathtubCell;
  public southCell: BathtubCell;
  public eastCell: BathtubCell;
  public westCell: BathtubCell;
  private updateStrategy: UpdateStrategy;

  constructor(ref: Selection<BaseType, {}, HTMLElement, any>, updateStrategy: UpdateStrategy, initialTemp: number) {
    this.ref = ref;
    this.updateStrategy = updateStrategy;
    this.updateStrategy.onEntry(this);
    this.temp = initialTemp;
    this.newTemp = initialTemp;
  }

  setNorth(northCell: BathtubCell) {
    this.northCell = northCell;
  }

  setSouth(southCell: BathtubCell) {
    this.southCell = southCell;
  }

  setEast(eastCell: BathtubCell) {
    this.eastCell = eastCell;
  }

  setWest(westCell: BathtubCell) {
    this.westCell = westCell;
  }

  setUpdateStrategy(updateStrategy: UpdateStrategy) {
    this.updateStrategy.onExit();
    this.updateStrategy = updateStrategy;
    this.updateStrategy.onEntry(this);
  }

  update() {
    this.updateStrategy.update();
  }

  diffuse() {
    this.updateStrategy.diffuse();
  }

  commit() {
    this.temp = this.newTemp;
  }

  render() {
    this.ref.attr('fill', tempToColor(this.temp));
  }
}
