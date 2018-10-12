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
        currentCell.setEast(this.getCell(j, ((i + this.cols - 1) % this.cols)));
        currentCell.setWest(this.getCell(j, ((i + this.cols + 1) % this.cols)));
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

  commit() {
    this.cells.forEach(cell => {
      if (cell) {
        cell.commit();
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

}
