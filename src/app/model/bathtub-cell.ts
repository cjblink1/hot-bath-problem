import { UpdateStrategy } from './update-strategy';
import { Subject } from 'rxjs';

export class BathtubCell {

  public initialTemp: number;
  public initialFlowVector: number[];

  public centerX: number;
  public centerY: number;
  public temp: number;
  public newTemp: number;
  public flowVector: number[];
  public newFlowVector: number[];
  public div: number;
  public p: number;
  public waterDensity: number;
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
    initialWaterDensity: number,
    tubTempSubject: Subject<number>,
    waterDensitySubject: Subject<number>,
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
      this.initialTemp = initialTemp;
      this.initialFlowVector = initialFlowVector;
      this.p = 0;
      this.div = 0;
      this.waterDensity = initialWaterDensity;
      tubTempSubject.subscribe((newInitialTemp) => this.initialTemp = newInitialTemp);
      waterDensitySubject.subscribe((newWaterDensity) => this.waterDensity = newWaterDensity);
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
    if (Number.isNaN(this.newFlowVector[0]) || Number.isNaN(this.newFlowVector[1])) {
      throw Error(`Attempted to commit flow vector: (${this.newFlowVector[0]}, ${this.newFlowVector[1]})`);
    }
    this.flowVector = this.newFlowVector;
  }

  reset() {
    this.temp = this.initialTemp;
    this.newTemp = this.initialTemp;
    this.flowVector = this.initialFlowVector;
    this.newFlowVector = this.initialFlowVector;
    this.currentStrategy.reset();
  }
}
