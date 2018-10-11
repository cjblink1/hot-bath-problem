import { Selection, BaseType } from 'd3';
import { tempToColor } from './utilities';
import { UpdateStrategy } from './update-strategy';
import { RenderStrategy } from './render-strategy';

export class BathtubCell {

  public centerX: number;
  public centerY: number;
  public ref: Selection<BaseType, {}, HTMLElement, any>;
  public temp: number;
  public newTemp: number;
  public northCell: BathtubCell;
  public southCell: BathtubCell;
  public eastCell: BathtubCell;
  public westCell: BathtubCell;
  private updateStrategy: UpdateStrategy;
  private renderStrategies: Map<string, RenderStrategy>;

  constructor(ref: Selection<BaseType, {}, HTMLElement, any>,
    centerX: number,
    centerY: number,
    updateStrategy: UpdateStrategy,
    initialTemp: number) {
    this.ref = ref;
    this.centerX = centerX;
    this.centerY = centerY;
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
