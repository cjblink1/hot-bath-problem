import { BathtubCell } from './bathtub-cell';

export abstract class UpdateStrategy {

  protected cell: BathtubCell;

  onEntry(cell: BathtubCell) {
    this.cell = cell;
  }

  onExit() {}
  update() {}
  diffuse() {}

}

export class Interior extends UpdateStrategy {

  private a = 2;

  // update() {
  //   this.cell.newTemp = this.cell.temp;
  // }

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
  }

}
