import { BathtubCell } from './bathtub-cell';
import { Subject } from 'rxjs';
import { scaleVectorToLength } from './utilities';

export abstract class UpdateStrategy {

  protected cell: BathtubCell;

  onEntry(cell: BathtubCell) {
    this.cell = cell;
  }

  onExit() {}
  update() {}
  diffuse() {}
  diffuseFlow() {}
  calculateDiv() {}
  calculateP() {}
  correctFlow() {}
  shouldAdvect = () => false;
  shouldAdvectFlow = () => false;
  setBoundary() {}
  setFlowBoundary() {}

  reset() {
    this.cell.newFlowVector = [0 , 0];
    this.cell.newTemp = this.cell.initialTemp;
  }

}

export class Interior extends UpdateStrategy {

  private h = .01;

  diffuse() {
    const a = (0.54402 + 0.000816 * this.cell.temp) / (this.cell.waterDensity * 4.18);
    const northTemp = this.cell.northCell.newTemp;
    const southTemp = this.cell.southCell.newTemp;
    const eastTemp = this.cell.eastCell.newTemp;
    const westTemp = this.cell.westCell.newTemp;

    this.cell.newTemp = (this.cell.temp + a * (northTemp + southTemp + eastTemp + westTemp)) / (1 + 4 * a);
  }

  diffuseFlow() {
    const b = (.000016 * 997) / this.cell.waterDensity;
    const northX = this.cell.northCell.flowVector[0];
    const northY = this.cell.northCell.flowVector[1];
    const southX = this.cell.southCell.flowVector[0];
    const southY = this.cell.southCell.flowVector[1];
    const eastX = this.cell.eastCell.flowVector[0];
    const eastY = this.cell.eastCell.flowVector[1];
    const westX = this.cell.westCell.flowVector[0];
    const westY = this.cell.westCell.flowVector[1];

    this.cell.newFlowVector[0] = (this.cell.flowVector[0] + b * (northX + southX + eastX + westX)) / (1 + 4 * b);
    this.cell.newFlowVector[1] = (this.cell.flowVector[1] + b * (northY + southY + eastY + westY)) / (1 + 4 * b);
    if (Number.isNaN(this.cell.newFlowVector[0]) || Number.isNaN(this.cell.newFlowVector[1])) {
      throw Error('Error in diffuse flow');
    }
  }

  shouldAdvect = () => true;
  shouldAdvectFlow = () => true;

  calculateDiv() {

    const northY = this.cell.northCell.newFlowVector[1];
    const southY = this.cell.southCell.newFlowVector[1];
    const eastX = this.cell.eastCell.newFlowVector[0];
    const westX = this.cell.westCell.newFlowVector[0];

    this.cell.div = -0.5 * this.h * (eastX - westX + southY - northY);
    this.cell.p = 0;
  }

  calculateP() {

    const northP = this.cell.northCell.p;
    const southP = this.cell.southCell.p;
    const eastP = this.cell.eastCell.p;
    const westP = this.cell.westCell.p;

    this.cell.p = (this.cell.div + northP + southP + eastP + westP) / 4;
  }

  correctFlow() {
    const northP = this.cell.northCell.p;
    const southP = this.cell.southCell.p;
    const eastP = this.cell.eastCell.p;
    const westP = this.cell.westCell.p;

    this.cell.newFlowVector[0] -= 0.5 * (eastP - westP) / this.h;
    this.cell.newFlowVector[1] -= 0.5 * (southP - northP) / this.h;
  }
}

export class Dirichlet extends UpdateStrategy {

  private temp: number;
  private h = .01;

  constructor(temp: number, bodyTempSubject: Subject<number>) {
    super();
    this.temp = temp;
    bodyTempSubject.subscribe((newTemp) => this.temp = newTemp);
  }

  update() {
    this.cell.newTemp = this.temp;
    this.cell.newFlowVector = [0, 0];
  }

  calculateDiv() {

    const northY = this.cell.northCell.newFlowVector[1];
    const southY = this.cell.southCell.newFlowVector[1];
    const eastX = this.cell.eastCell.newFlowVector[0];
    const westX = this.cell.westCell.newFlowVector[0];

    this.cell.div = -0.5 * this.h * (eastX - westX + southY - northY);
    this.cell.p = 0;
  }

  calculateP() {

    const northP = this.cell.northCell.p;
    const southP = this.cell.southCell.p;
    const eastP = this.cell.eastCell.p;
    const westP = this.cell.westCell.p;

    this.cell.p = (this.cell.div + northP + southP + eastP + westP) / 4;
  }

  correctFlow() {
    const northP = this.cell.northCell.p;
    const southP = this.cell.southCell.p;
    const eastP = this.cell.eastCell.p;
    const westP = this.cell.westCell.p;

    this.cell.newFlowVector = [0, 0];
  }

  reset() {
    this.cell.temp = this.temp;
  }
}

export class Source extends UpdateStrategy {

  private temp: number;
  private flowVector: [number, number];
  private initialFlowFector: [number, number];

  constructor(temp: number, flowVector: [number, number], sourceFlowSpeedSubject: Subject<number>, sourceTempSubject: Subject<number>) {
    super();
    this.temp = temp;
    this.flowVector = flowVector;
    this.initialFlowFector = flowVector;
    sourceFlowSpeedSubject.subscribe((newSpeed) => this.setSourceFlowSpeed(newSpeed));
    sourceTempSubject.subscribe((newTemp) => this.temp = newTemp);
  }

  update() {
    this.cell.newTemp = this.temp;
    this.cell.newFlowVector = this.flowVector;
    if (Number.isNaN(this.cell.newFlowVector[0]) || Number.isNaN(this.cell.newFlowVector[1])) {
      throw Error('Error updating flow vector');
    }
  }

  reset() {
    this.cell.temp = this.temp;
    this.cell.flowVector = this.flowVector;
  }

  private setSourceFlowSpeed(sourceFlowSpeed: number) {
    this.flowVector = scaleVectorToLength(this.initialFlowFector, sourceFlowSpeed);
    if (Number.isNaN(this.flowVector[0]) || Number.isNaN(this.flowVector[1])) {
      throw Error('Error updating flow vector');
    }
  }

}

export class Random extends UpdateStrategy {

  update() {
    this.cell.newTemp = Math.random() * 255;
  }

}

export class BottomBoundary extends UpdateStrategy {


  setBoundary() {
    this.cell.newTemp = this.cell.northCell.newTemp;
  }

  calculateDiv() {
    this.cell.div = this.cell.northCell.div;
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = this.cell.northCell.p;
  }

  correctFlow() {
    this.cell.newFlowVector = [this.cell.northCell.newFlowVector[0], 0];
  }

}

export class LeftBoundary extends UpdateStrategy {


  setBoundary() {
    this.cell.newTemp = this.cell.eastCell.newTemp;
  }

  calculateDiv() {
    this.cell.div = this.cell.eastCell.div;
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = this.cell.eastCell.p;
  }

  correctFlow() {
    this.cell.newFlowVector = [0, this.cell.eastCell.newFlowVector[1]];
  }
}

export class RightBoundary extends UpdateStrategy {

  setBoundary() {
    this.cell.newTemp = this.cell.westCell.newTemp;
  }

  calculateDiv() {
    this.cell.div = this.cell.westCell.div;
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = this.cell.westCell.p;
  }

  correctFlow() {
    this.cell.newFlowVector = [0, this.cell.westCell.newFlowVector[1]];
  }
}

export class TopBoundary extends UpdateStrategy {

  setBoundary() {
    this.cell.newTemp = this.cell.southCell.newTemp;
  }

  calculateDiv() {
    this.cell.div = this.cell.southCell.div;
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = this.cell.southCell.p;
  }

  correctFlow() {
    this.cell.newFlowVector = [this.cell.southCell.newFlowVector[0], 0];
  }
}

export class TopLeftBoundary extends UpdateStrategy {

  setBoundary() {
    this.cell.newTemp = .5 * (this.cell.eastCell.newTemp + this.cell.southCell.newTemp);
  }

  calculateDiv() {
    this.cell.div = .5 * (this.cell.eastCell.div + this.cell.southCell.div);
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = .5 * (this.cell.eastCell.p + this.cell.southCell.p);
  }

  correctFlow() {
    const avgX = (this.cell.eastCell.newFlowVector[0] + this.cell.southCell.newFlowVector[0]) / 2;
    const avgY = (this.cell.eastCell.newFlowVector[1] + this.cell.southCell.newFlowVector[1]) / 2;
    if (Number.isNaN(avgX) || Number.isNaN(avgY)) {
      throw Error('Error setting avg values');
    }
    this.cell.newFlowVector = [avgX, avgY];
  }
}

export class TopRightBoundary extends UpdateStrategy {

  setBoundary() {
    this.cell.newTemp = .5 * (this.cell.westCell.newTemp + this.cell.southCell.newTemp);
  }

  calculateDiv() {
    this.cell.div = .5 * (this.cell.westCell.div + this.cell.southCell.div);
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = .5 * (this.cell.westCell.p + this.cell.southCell.p);
  }

  correctFlow() {
    const avgX = (this.cell.westCell.newFlowVector[0] + this.cell.southCell.newFlowVector[0]) / 2;
    const avgY = (this.cell.westCell.newFlowVector[1] + this.cell.southCell.newFlowVector[1]) / 2;
    this.cell.newFlowVector = [avgX, avgY];
  }
}

export class BottomLeftBoundary extends UpdateStrategy {

  setBoundary() {
    this.cell.newTemp = .5 * (this.cell.eastCell.newTemp + this.cell.northCell.newTemp);
  }

  calculateDiv() {
    this.cell.div = .5 * (this.cell.eastCell.div + this.cell.northCell.div);
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = .5 * (this.cell.eastCell.p + this.cell.northCell.p);
  }

  correctFlow() {
    const avgX = (this.cell.eastCell.newFlowVector[0] + this.cell.northCell.newFlowVector[0]) / 2;
    const avgY = (this.cell.eastCell.newFlowVector[1] + this.cell.northCell.newFlowVector[1]) / 2;
    this.cell.newFlowVector = [avgX, avgY];
  }
}

export class BottomRightBoundary extends UpdateStrategy {

  setBoundary() {
    this.cell.newTemp = .5 * (this.cell.westCell.newTemp + this.cell.northCell.newTemp);
  }

  calculateDiv() {
    this.cell.div = .5 * (this.cell.westCell.div + this.cell.northCell.div);
    this.cell.p = 0;
  }

  calculateP() {
    this.cell.p = .5 * (this.cell.westCell.p + this.cell.northCell.p);
  }

  correctFlow() {
    const avgX = (this.cell.westCell.newFlowVector[0] + this.cell.northCell.newFlowVector[0]) / 2;
    const avgY = (this.cell.westCell.newFlowVector[1] + this.cell.northCell.newFlowVector[1]) / 2;
    this.cell.newFlowVector = [avgX, avgY];
  }
}
