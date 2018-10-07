import { BathtubCell } from './bathtub-cell';

export abstract class UpdateStrategy {

  protected cell: BathtubCell;

  onEntry(cell: BathtubCell) {
    this.cell = cell;
  }

  onExit() {}

  abstract update();

}

export class Interior extends UpdateStrategy {

  update() {
    const northTemp = this.cell.northCell.temp;
    const southTemp = this.cell.southCell.temp;
    const eastTemp = this.cell.eastCell.temp;
    const westTemp = this.cell.westCell.temp;

    const tempXX = (westTemp - 2 * this.cell.temp + eastTemp);
    const tempYY = (northTemp - 2 * this.cell.temp + southTemp);

    this.cell.newTemp = this.cell.temp + .25 * (tempXX + tempYY);

    if (this.cell.newTemp > 255) {
      this.cell.newTemp = 255;
    }

    if (this.cell.newTemp < 0) {
      this.cell.newTemp = 0;
    }

    // console.log(this.cell.newTemp);
  }

}

export class Dirichlet extends UpdateStrategy {

  update() {
    this.cell.newTemp = this.cell.temp;
  }

}

export class Random extends UpdateStrategy {

  update() {
    this.cell.newTemp = Math.random() * 100;
  }

}
