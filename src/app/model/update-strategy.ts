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

  diffuse() {
    const northTemp = this.cell.northCell.newTemp;
    const southTemp = this.cell.southCell.newTemp;
    const eastTemp = this.cell.eastCell.newTemp;
    const westTemp = this.cell.westCell.newTemp;

    this.cell.newTemp = (this.cell.temp + this.a * (northTemp + southTemp + eastTemp + westTemp)) / (1 + 4 * this.a);
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
    this.cell.newFlowVector = [ Math.random() * 10 - 5, Math.random() * 10 - 5];
  }

}
