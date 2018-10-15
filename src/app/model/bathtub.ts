import { BathtubCell } from './bathtub-cell';
import * as Stardust from 'stardust-core';
import { WebGLCanvasPlatform2D } from 'stardust-webgl';

export class Bathtub {

  private cols: number;
  private rows: number;
  private cells: BathtubCell[] = [];
  private marks: Stardust.Mark[];
  private platform: WebGLCanvasPlatform2D;

  constructor(cols: number, rows: number, platform: WebGLCanvasPlatform2D) {
    this.cols = cols;
    this.rows = rows;
    this.createEmptyCells();
    this.platform = platform;
    this.marks = [];
  }

  private createEmptyCells() {
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.cells.push(null);
    }
  }

  addCell(cell: BathtubCell, row: number, column: number) {
    this.setCell(cell, row, column);
  }

  addMark(mark: Stardust.Mark) {
    this.marks.push(mark);
  }

  linkCells() {
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const currentCell = this.getCell(j, i);
        currentCell.setNorth(this.getCell(((j + this.rows - 1) % this.rows), i));
        currentCell.setSouth(this.getCell(((j + this.rows + 1) % this.rows), i));
        currentCell.setEast(this.getCell(j, ((i + this.cols + 1) % this.cols)));
        currentCell.setWest(this.getCell(j, ((i + this.cols - 1) % this.cols)));
      }
    }
  }

  clear() {
    this.platform.clear();
  }

  update() {
    this.cells.forEach(cell => {
      if (cell) {
        cell.update();
      }
    });
  }

  diffuse() {
    for (let k = 0; k < 20; k++) {
      this.cells.forEach(cell => {
        cell.diffuse();
      });
    }
  }

  advect() {
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const currentCell = this.getCell(j, i);
        if (currentCell.shouldAdvect()) {
          let sourceX = i - currentCell.flowVector[0];
          let sourceY = j - currentCell.flowVector[1];

          sourceX = sourceX < 0.5 ? 0.5 : sourceX;
          sourceY = sourceY < 0.5 ? 0.5 : sourceY;

          sourceX = sourceX > this.cols - 0.5 ? this.cols - 0.5 : sourceX;
          sourceY = sourceY > this.rows - 0.5 ? this.rows - 0.5 : sourceY;

          const lowerX = Math.floor(sourceX);
          const lowerY = Math.floor(sourceY);
          const upperX = Math.ceil(sourceX);
          const upperY = Math.ceil(sourceY);

          const upperXBias = sourceX - lowerX;
          const lowerXBias = 1 - upperXBias;

          const upperYBias = sourceY - lowerY;
          const lowerYBias = 1 - upperYBias;

          currentCell.newTemp = lowerXBias * lowerYBias * this.getCell(lowerY, lowerX).temp +
                                lowerXBias * upperYBias * this.getCell(upperY, lowerX).temp +
                                upperXBias * lowerYBias * this.getCell(lowerY, upperX).temp +
                                upperXBias * upperYBias * this.getCell(upperY, upperX).temp;
        } else {
          currentCell.setBoundary();
        }
      }
    }
  }

  diffuseFlow() {
    for (let k = 0; k < 20; k++) {
      this.cells.forEach(cell => {
        cell.diffuseFlow();
      });
    }
  }

  advectFlow() {
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        const currentCell = this.getCell(j, i);
        if (currentCell.shouldAdvectFlow()) {
          let sourceX = i - currentCell.flowVector[0];
          let sourceY = j - currentCell.flowVector[1];

          sourceX = sourceX < 0.5 ? 0.5 : sourceX;
          sourceY = sourceY < 0.5 ? 0.5 : sourceY;

          sourceX = sourceX > this.cols - 0.5 ? this.cols - 0.5 : sourceX;
          sourceY = sourceY > this.rows - 0.5 ? this.rows - 0.5 : sourceY;

          const lowerX = Math.floor(sourceX);
          const lowerY = Math.floor(sourceY);
          const upperX = Math.ceil(sourceX);
          const upperY = Math.ceil(sourceY);

          const upperXBias = sourceX - lowerX;
          const lowerXBias = 1 - upperXBias;

          const upperYBias = sourceY - lowerY;
          const lowerYBias = 1 - upperYBias;

          currentCell.newFlowVector[0] = lowerXBias * lowerYBias * this.getCell(lowerY, lowerX).flowVector[0] +
                                        lowerXBias * upperYBias * this.getCell(upperY, lowerX).flowVector[0] +
                                        upperXBias * lowerYBias * this.getCell(lowerY, upperX).flowVector[0] +
                                        upperXBias * upperYBias * this.getCell(upperY, upperX).flowVector[0];

          currentCell.newFlowVector[1] = lowerXBias * lowerYBias * this.getCell(lowerY, lowerX).flowVector[1] +
                                        lowerXBias * upperYBias * this.getCell(upperY, lowerX).flowVector[1] +
                                        upperXBias * lowerYBias * this.getCell(lowerY, upperX).flowVector[1] +
                                        upperXBias * upperYBias * this.getCell(upperY, upperX).flowVector[1];
        } else {
          currentCell.setFlowBoundary();
        }
      }
    }
  }

  project() {
    this.cells.forEach(cell => {
      if (cell) {
        cell.calculateDiv();
      }
    });
    for (let k = 0; k < 20; k++) {
      this.cells.forEach(cell => {
        cell.calculateP();
      });
    }
    this.cells.forEach(cell => {
      if (cell) {
        cell.correctFlow();
      }
    });
  }

  commit() {
    this.cells.forEach(cell => {
      if (cell) {
        cell.commit();
      }
    });
  }

  commitFlow() {
    this.cells.forEach(cell => {
      if (cell) {
        cell.commitFlow();
      }
    });
  }

  render() {
    this.marks.forEach(mark => {
      mark.data(this.cells);
      mark.render();
    });
  }

  getCell(row: number, column: number): BathtubCell {
    return this.cells[row * this.cols + column];
  }

  private setCell(cell: BathtubCell, row: number, column: number) {
    this.cells[row * this.cols + column] = cell;
  }

  toggle(row: number, column: number) {
    this.getCell(row, column).toggle();
  }

  getAvgTemp() {
    return this.cells.reduce((accumulator, cell) => accumulator + cell.temp, 0) / this.cells.length;
  }

}
