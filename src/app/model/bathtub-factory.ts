import { Selection } from 'd3';
import { Bathtub } from './bathtub';
import { BathtubCell } from './bathtub-cell';
import { Dirichlet, Random, UpdateStrategy, Interior } from './update-strategy';
import { RenderCell, RenderDiagonal } from './render-strategy';
import * as Stardust from 'stardust-core';
import { WebGLCanvasPlatform2D } from 'stardust-webgl';
import { tempToColor } from './utilities';


export class BathtubFactory {

  private platform: WebGLCanvasPlatform2D;
  private cols: number;
  private rows: number;
  private columnWidth: number;
  private rowHeight: number;
  private cellMark: Stardust.Mark;

  constructor (simulationRef: HTMLCanvasElement,
    cols: number, rows: number, columnWidth: number, rowHeight: number) {
      const width = simulationRef.getBoundingClientRect().width;
      const height = simulationRef.getBoundingClientRect().height;
      this.platform = new WebGLCanvasPlatform2D(simulationRef, width, height);
      this.cols = cols;
      this.rows = rows;
      this.columnWidth = columnWidth;
      this.rowHeight = rowHeight;
      this.cellMark = Stardust.mark.create(Stardust.mark.rect(), this.platform);
  }

  createBathtub(): Bathtub {
    const newBathtub = new Bathtub(this.cols, this.rows, this.platform);
    newBathtub.addMark(this.cellMark);
    return newBathtub;
  }

  createDirichletBathtubCell(centerX: number, centerY: number, initialTemp: number) {
    return this.createBathtubCell(centerX, centerY, initialTemp, new Dirichlet());
  }

  createRandomBathtubCell(centerX: number, centerY: number, initialTemp: number) {
    return this.createBathtubCell(centerX, centerY, initialTemp, new Random());
  }

  createInteriorBathtubCell(centerX: number, centerY: number, initialTemp: number) {
    return this.createBathtubCell(centerX, centerY, initialTemp, new Interior());
  }

  private createBathtubCell(centerX: number, centerY: number, initialTemp: number, updateStrategy: UpdateStrategy) {
    this.cellMark.attr('p1', cell => [cell.centerX - cell.columnWidth / 2, cell.centerY - cell.rowHeight / 2])
      .attr('p2', cell => [cell.centerX + cell.columnWidth / 2, cell.centerY + cell.rowHeight / 2])
      .attr('color', cell => tempToColor(cell.temp));
    const newCell = new BathtubCell(centerX, centerY,
      this.columnWidth, this.rowHeight, updateStrategy, initialTemp);
    return newCell;
  }

}
