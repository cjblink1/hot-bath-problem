import { Selection } from 'd3';
import { Bathtub } from './bathtub';
import { BathtubCell } from './bathtub-cell';
import { Dirichlet, Random, UpdateStrategy, Interior } from './update-strategy';


export class BathtubFactory {

  private simulationRef: Selection<Element, {}, HTMLElement, any>;
  private bathtubRef: Selection<Element, {}, HTMLElement, any>;
  private cols: number;
  private rows: number;
  private columnWidth: number;
  private rowHeight: number;

  constructor (simulationRef: Selection<Element, {}, HTMLElement, any>,
    bathtubRef: Selection<Element, {}, HTMLElement, any>,
    cols: number, rows: number, columnWidth: number, rowHeight: number) {
      this.simulationRef = simulationRef;
      this.bathtubRef = bathtubRef;
      this.cols = cols;
      this.rows = rows;
      this.columnWidth = columnWidth;
      this.rowHeight = rowHeight;
  }

  createBathtub(): Bathtub {
    return new Bathtub(this.cols, this.rows);
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
    const cellRef =
    this.bathtubRef
      .append('rect')
      .attr('x', centerX - this.columnWidth / 2)
      .attr('y', centerY - this.rowHeight / 2)
      .attr('width', this.columnWidth)
      .attr('height', this.rowHeight)
      // .attr('stroke', 'paleturquoise')
      .attr('fill', 'white');
    return new BathtubCell(cellRef, updateStrategy, initialTemp);
  }

}
