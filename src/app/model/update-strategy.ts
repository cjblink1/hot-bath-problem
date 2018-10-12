import { BathtubCell } from './bathtub-cell';

export abstract class UpdateStrategy {

  protected cell: BathtubCell;

  onEntry(cell: BathtubCell) {
    this.cell = cell;
  }

  onExit() {}
  update() {}
  diffuse() {}
  diffuseFlow() {}

}

export class Interior extends UpdateStrategy {

  private a = .25;
  private b = .25;

  diffuse() {
    const northTemp = this.cell.northCell.newTemp;
    const southTemp = this.cell.southCell.newTemp;
    const eastTemp = this.cell.eastCell.newTemp;
    const westTemp = this.cell.westCell.newTemp;

    this.cell.newTemp = (this.cell.temp + this.a * (northTemp + southTemp + eastTemp + westTemp)) / (1 + 4 * this.a);
  }

  diffuseFlow() {
    const northX = this.cell.northCell.flowVector[0];
    const northY = this.cell.northCell.flowVector[1];
    const southX = this.cell.southCell.flowVector[0];
    const southY = this.cell.southCell.flowVector[1];
    const eastX = this.cell.eastCell.flowVector[0];
    const eastY = this.cell.eastCell.flowVector[1];
    const westX = this.cell.westCell.flowVector[0];
    const westY = this.cell.westCell.flowVector[1];

    this.cell.newFlowVector[0] = (this.cell.flowVector[0] + this.b * (northX + southX + eastX + westX)) / (1 + 4 * this.b);
    this.cell.newFlowVector[1] = (this.cell.flowVector[1] + this.b * (northY + southY + eastY + westY)) / (1 + 4 * this.b);
  }

}

export class Dirichlet extends UpdateStrategy {

  update() {
    this.cell.newTemp = this.cell.temp;
  }

}

export class Random extends UpdateStrategy {

  update() {
    this.cell.newTemp = Math.random() * 255;
    // this.cell.newFlowVector = [ Math.random() * 10 - 5, Math.random() * 10 - 5];
  }

}
