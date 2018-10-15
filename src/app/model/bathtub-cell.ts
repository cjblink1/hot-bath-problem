import { UpdateStrategy } from './update-strategy';

export class BathtubCell {

  public centerX: number;
  public centerY: number;
  public temp: number;
  public newTemp: number;
  public flowVector: number[];
  public newFlowVector: number[];
  public div: number;
  public p: number;
  public columnWidth: number;
  public rowHeight: number;
  public northCell: BathtubCell;
  public southCell: BathtubCell;
  public eastCell: BathtubCell;
  public westCell: BathtubCell;
  private updateStrategies: UpdateStrategy[];
  private currentStrategy: UpdateStrategy;
  private currentStrategyIndex: number;

  constructor(
    centerX: number,
    centerY: number,
    columnWidth: number,
    rowHeight: number,
    initialTemp: number,
    initialFlowVector: number[],
    ...updateStrategies: UpdateStrategy[]
    ) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.columnWidth = columnWidth;
      this.rowHeight = rowHeight;
      this.updateStrategies = updateStrategies;
      this.currentStrategyIndex = 0;
      this.currentStrategy = this.updateStrategies[this.currentStrategyIndex];
      this.currentStrategy.onEntry(this);
      this.temp = initialTemp;
      this.newTemp = initialTemp;
      this.flowVector = initialFlowVector;
      this.newFlowVector = initialFlowVector;
      this.p = 0;
      this.div = 0;
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

  toggle() {
    this.currentStrategy.onExit();
    this.currentStrategyIndex = (this.currentStrategyIndex + 1) % this.updateStrategies.length;
    this.currentStrategy = this.updateStrategies[this.currentStrategyIndex];
    this.currentStrategy.onEntry(this);
  }

  update() {
    this.currentStrategy.update();
  }

  diffuse() {
    this.currentStrategy.diffuse();
  }

  shouldAdvect(): boolean {
    return this.currentStrategy.shouldAdvect();
  }

  setBoundary() {
    this.currentStrategy.setBoundary();
  }

  diffuseFlow() {
    this.currentStrategy.diffuseFlow();
  }

  shouldAdvectFlow(): boolean {
    return this.currentStrategy.shouldAdvectFlow();
  }

  setFlowBoundary() {
    this.currentStrategy.setFlowBoundary();
  }

  calculateDiv() {
    this.currentStrategy.calculateDiv();
  }

  calculateP() {
    this.currentStrategy.calculateP();
  }

  correctFlow() {
    this.currentStrategy.correctFlow();
  }

  commit() {
    this.temp = this.newTemp;
  }

  commitFlow() {
    this.flowVector = this.newFlowVector;
  }
}
