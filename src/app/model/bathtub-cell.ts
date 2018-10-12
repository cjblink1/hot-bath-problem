import { Selection, BaseType } from 'd3';
import { UpdateStrategy } from './update-strategy';
import { RenderStrategy } from './render-strategy';

export class BathtubCell {

  public centerX: number;
  public centerY: number;
  public vectorRef: Selection<BaseType, {}, HTMLElement, any>;
  public temp: number;
  public newTemp: number;
  public columnWidth: number;
  public rowHeight: number;
  public northCell: BathtubCell;
  public southCell: BathtubCell;
  public eastCell: BathtubCell;
  public westCell: BathtubCell;
  private updateStrategy: UpdateStrategy;
  private renderStrategies: Map<string, RenderStrategy>;

  constructor(
    centerX: number,
    centerY: number,
    columnWidth: number,
    rowHeight: number,
    updateStrategy: UpdateStrategy,
    initialTemp: number) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.columnWidth = columnWidth;
      this.rowHeight = rowHeight;
      this.updateStrategy = updateStrategy;
      this.updateStrategy.onEntry(this);
      this.temp = initialTemp;
      this.newTemp = initialTemp;
      this.renderStrategies = new Map();
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

  addRenderStrategy(renderStrategy: RenderStrategy) {
    this.renderStrategies.set(renderStrategy.getName(), renderStrategy);
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
    this.renderStrategies.forEach(renderStrategy => {
      renderStrategy.render(this);
    });
  }
}
