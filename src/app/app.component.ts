import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import * as d3 from 'd3';
import { BathtubFactory } from './model/bathtub-factory';
import { Bathtub } from './model/bathtub';
import { executeAndMeasure } from './model/utilities';
import { BottomBoundary, LeftBoundary, RightBoundary, TopBoundary, TopLeftBoundary,
   BottomLeftBoundary, BottomRightBoundary, TopRightBoundary, Interior, UpdateStrategy, Dirichlet, Source } from './model/update-strategy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hot-bath-problem';
  private simulationRef: HTMLCanvasElement;
  private cols = 100;
  private rows = 40;
  private columnWidth;
  private rowHeight;
  private cx;
  private cy;
  private startingX;
  private startingY;
  private bathtubFactory: BathtubFactory;
  private bathtub: Bathtub;
  protected avgTemp: number;
  protected stddevTemp = 4;

  ngOnInit(): void {
    this.simulationRef = d3.select<HTMLCanvasElement, {}>('#simulation').node();

    const size = (this.simulationRef.getBoundingClientRect().width - 20) / 100;
    this.columnWidth = size;
    this.rowHeight = size;

    this.cx = this.simulationRef.getBoundingClientRect().width / 2;
    this.cy = this.simulationRef.getBoundingClientRect().height / 2;
    this.startingX = this.cx - this.columnWidth * ((this.cols - 1) / 2);
    this.startingY = this.cy - this.rowHeight * ((this.rows - 1) / 2);

    this.bathtubFactory = new BathtubFactory(this.simulationRef, this.cols, this.rows, this.columnWidth, this.rowHeight);
    this.bathtub = this.bathtubFactory.createBathtub();

    this.buildLeftWall();
    this.buildRightWall();
    this.buildBottom();
    this.buildTop();
    this.buildCorners();
    this.fillInterior();

    this.bathtub.linkCells();

    d3.select('#simulation').
      on('click', () => this.handleClick(d3.mouse(this.simulationRef)));

    const steps = [
      {name: 'Clear', value: this.bathtub.clear},
      {name: 'Diffuse Flow', value: this.bathtub.diffuseFlow},
      {name: 'Project', value: this.bathtub.project},
      {name: 'Commit Flow', value: this.bathtub.commitFlow},
      {name: 'Advect Flow', value: this.bathtub.advectFlow},
      {name: 'Project', value: this.bathtub.project},
      {name: 'Commit Flow', value: this.bathtub.commitFlow},
      {name: 'Update', value: this.bathtub.update},
      {name: 'Diffuse', value: this.bathtub.diffuse},
      {name: 'Commit', value: this.bathtub.commit},
      {name: 'Advect', value: this.bathtub.advect},
      {name: 'Commit', value: this.bathtub.commit},
      {name: 'Render', value: this.bathtub.render}
    ];

    const timer = d3.interval(elapsed => {

      this.execute(steps, false);
      this.updateStats();
      // if (elapsed > 15000) {
      //   timer.stop();
      // }
    });
  }

  private execute(steps: { name: string; value: () => void; }[], measure: boolean) {
    if (measure) {
      const total = steps.reduce((accumulator, step) =>
        accumulator + executeAndMeasure(step.name, step.value, this.bathtub), 0);
      console.log('Total time: ' + total);
    } else {
      steps.forEach(step => step.value.apply(this.bathtub));
    }
  }

  private buildLeftWall() {
    for (let i = 1; i < this.rows - 1; i++) {
      this.createAndAddCell(i, 0, 0, [0, 0], new LeftBoundary());
    }
  }

  private buildRightWall() {
    for (let i = 1; i < this.rows - 1; i++) {
      this.createAndAddCell(i, this.cols - 1, 0, [0, 0], new RightBoundary());
    }
  }

  private buildBottom() {
    for (let i = 1; i < this.cols - 1; i++) {
      this.createAndAddCell(this.rows - 1, i, 0, [0, 0], new BottomBoundary());
    }
  }

  private buildTop() {
    for (let i = 1; i < this.cols - 1; i++) {
      this.createAndAddCell(0, i, 0, [0, 0], new TopBoundary(), new Source(255, [0, 1]));
    }
  }

  private buildCorners() {
    this.createAndAddCell(0, 0, 0, [0, 0], new TopLeftBoundary());
    this.createAndAddCell(this.rows - 1, 0, 0, [0, 0], new BottomLeftBoundary());
    this.createAndAddCell(this.rows - 1, this.cols - 1, 0, [0, 0], new BottomRightBoundary());
    this.createAndAddCell(0, this.cols - 1, 0, [0, 0], new TopRightBoundary());
  }

  private fillInterior() {
    for (let j = 1; j < this.rows - 1; j++) {
      for (let i = 1; i < this.cols - 1; i++) {
        this.createAndAddCell(j, i, 50, [0, 0], new Interior(), new Dirichlet(200));
      }
    }
  }

  private createAndAddCell(row: number, col: number, temp: number, flowVector: [number, number], ...updateStrategies: UpdateStrategy[]) {
    const centerX = this.startingX + col * this.columnWidth;
    const centerY = this.startingY + row * this.rowHeight;
    const cell = this.bathtubFactory.createBathtubCell(centerX, centerY, temp, flowVector, ...updateStrategies);
    this.bathtub.addCell(cell, row, col);
  }

  private handleClick(canvasCoords: [number, number]) {
    const [withinBounds, cellX, cellY] = this.translateCanvasCoordsToCellCoords(canvasCoords);
    if (withinBounds) {
      console.log(`Toggling ${cellY}, ${cellX}`);
      this.bathtub.toggle(cellY, cellX);
    }
  }

  private translateCanvasCoordsToCellCoords([canvasX, canvasY]): [boolean, number, number] {

    const cellX = Math.floor((canvasX - this.startingX + this.columnWidth / 2) / this.columnWidth);
    const cellY = Math.floor((canvasY - this.startingY + this.rowHeight / 2) / this.rowHeight);

    return [this.withinBounds(cellX, cellY), cellX, cellY];
  }

  private withinBounds(cellX, cellY): boolean {
    const withinXBounds = cellX >= 0 && cellX < this.cols;
    const withinYBounds = cellY >= 0 && cellY < this.rows;
    return withinXBounds && withinYBounds;
  }

  private updateStats() {
    const avg = this.bathtub.getAvgTemp();
    const stddev = this.bathtub.getStdDevTemp(this.avgTemp);

    this.avgTemp = Math.round(avg);
    this.stddevTemp = Math.round(stddev);
  }
}
