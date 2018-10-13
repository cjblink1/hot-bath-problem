import { Bathtub } from './bathtub';
import { BathtubCell } from './bathtub-cell';
import { Dirichlet, Random, UpdateStrategy, Interior } from './update-strategy';
import * as Stardust from 'stardust-core';
import { WebGLCanvasPlatform2D } from 'stardust-webgl';
import { tempToColor } from './utilities';
import { vectorMarkCode } from './vector-mark';


export class BathtubFactory {

  private platform: WebGLCanvasPlatform2D;
  private cols: number;
  private rows: number;
  private columnWidth: number;
  private rowHeight: number;
  private cellMark: Stardust.Mark;
  private vectorMark: Stardust.Mark;

  constructor (simulationRef: HTMLCanvasElement,
    cols: number, rows: number, columnWidth: number, rowHeight: number) {
      const width = simulationRef.getBoundingClientRect().width;
      const height = simulationRef.getBoundingClientRect().height;
      this.platform = new WebGLCanvasPlatform2D(simulationRef, width, height);
      this.cols = cols;
      this.rows = rows;
      this.columnWidth = columnWidth;
      this.rowHeight = rowHeight;
      this.cellMark = this.createCellMark();
      this.vectorMark = this.createVectorMark();
  }

  private createCellMark(): Stardust.Mark {
    const cellMark = Stardust.mark.create(Stardust.mark.rect(), this.platform);
    cellMark
      .attr('p1', cell => [cell.centerX - cell.columnWidth / 2, cell.centerY - cell.rowHeight / 2])
      .attr('p2', cell => [cell.centerX + cell.columnWidth / 2, cell.centerY + cell.rowHeight / 2])
      .attr('color', cell => tempToColor(cell.temp));
    return cellMark;
  }

  private createVectorMark(): Stardust.Mark {
    const vectorMark = Stardust.mark.create(Stardust.mark.compile(vectorMarkCode).FlowVector, this.platform);
    vectorMark
      .attr('baseVector', cell => cell.flowVector)
      .attr('center', cell => [cell.centerX, cell.centerY])
      .attr('width', cell => cell.columnWidth)
      .attr('height', cell => cell.rowHeight)
      .attr('minStrength', 0)
      .attr('maxStrength', 5);
    return vectorMark;
  }

  createBathtub(): Bathtub {
    const newBathtub = new Bathtub(this.cols, this.rows, this.platform);
    newBathtub.addMark(this.cellMark);
    newBathtub.addMark(this.vectorMark);
    return newBathtub;
  }

  createDirichletBathtubCell(centerX: number, centerY: number, initialTemp: number, initialFlowVector: number[] = [0, 0]) {
    return this.createBathtubCell(centerX, centerY, initialTemp, initialFlowVector, new Dirichlet());
  }

  createRandomBathtubCell(centerX: number, centerY: number, initialTemp: number, initialFlowVector: number[] = [0, 0]) {
    return this.createBathtubCell(centerX, centerY, initialTemp, initialFlowVector, new Random());
  }

  createInteriorBathtubCell(centerX: number, centerY: number, initialTemp: number, initialFlowVector: number[] = [0, 0]) {
    return this.createBathtubCell(centerX, centerY, initialTemp, initialFlowVector, new Interior());
  }

  createBathtubCell(centerX: number, centerY: number,
    initialTemp: number, initialFlowVector: number[], updateStrategy: UpdateStrategy) {
    return new BathtubCell(centerX, centerY, this.columnWidth, this.rowHeight, updateStrategy, initialTemp, initialFlowVector);
  }

}
