import { UpdateStrategy } from './update-strategy';

export class BathtubCell {

  public centerX: number;
  public centerY: number;
  public temp: number;
  public newTemp: number;
  public flowVector: number[];
  public newFlowVector: number[];
  public columnWidth: number;
  public rowHeight: number;
  public northCell: BathtubCell;
  public southCell: BathtubCell;
  public eastCell: BathtubCell;
  public westCell: BathtubCell;
  private updateStrategy: UpdateStrategy;

  constructor(
    centerX: number,
    centerY: number,
    columnWidth: number,
    rowHeight: number,
    updateStrategy: UpdateStrategy,
    initialTemp: number,
    initialFlowVector: number[]) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.columnWidth = columnWidth;
      this.rowHeight = rowHeight;
      this.updateStrategy = updateStrategy;
      this.updateStrategy.onEntry(this);
      this.temp = initialTemp;
      this.newTemp = initialTemp;
      this.flowVector = initialFlowVector;
      this.newFlowVector = initialFlowVector;
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

  diffuseFlow() {
    this.updateStrategy.diffuseFlow();
  }

  commit() {
    this.temp = this.newTemp;
  }

  commitFlow() {
    this.flowVector = this.newFlowVector;
  }
}
