import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { Selection } from 'd3';
import { BathtubFactory } from './model/bathtub-factory';
import { Bathtub } from './model/bathtub';
import { executeAndMeasure } from './model/utilities';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hot-bath-problem';
  private bathtubRef: Selection<Element, {}, HTMLElement, any>;
  private simulationRef: Selection<Element, {}, HTMLElement, any>;
  private cols = 100;
  private rows = 40;
  private columnWidth = 12;
  private rowHeight = 12;
  private cx;
  private cy;
  private startingX;
  private startingY;
  private bathtubFactory: BathtubFactory;
  private bathtub: Bathtub;

  ngOnInit(): void {
    this.simulationRef = d3.select('#simulation');
    this.bathtubRef = d3.select('#bathtub');

    this.cx = this.simulationRef.node().getBoundingClientRect().width / 2;
    this.cy = this.simulationRef.node().getBoundingClientRect().height / 2;
    this.startingX = this.cx - this.columnWidth * (this.cols / 2);
    this.startingY = this.cy - this.rowHeight * (this.rows / 2);

    this.bathtubFactory = new BathtubFactory(this.simulationRef, this.bathtubRef, this.cols, this.rows, this.columnWidth, this.rowHeight);
    this.bathtub = this.bathtubFactory.createBathtub();

    this.buildLeftWall();
    this.buildRightWall();
    this.buildBottom();
    this.buildTop();
    this.fillInterior();

    this.bathtub.linkCells();

    const steps = [
      {name: 'Update', value: this.bathtub.update},
      {name: 'Diffuse', value: this.bathtub.diffuse},
      {name: 'Commit', value: this.bathtub.commit},
      {name: 'Render', value: this.bathtub.render}
    ];

    const timer = d3.interval(elapsed => {

      this.execute(steps, false);

      if (elapsed > 15000) {
        timer.stop();
      }
    }, 20);
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
    for (let i = 0; i < this.rows - 1; i++) {
      const centerX = this.startingX;
      const centerY = this.startingY + i * this.rowHeight;
      const cell = this.bathtubFactory.createDirichletBathtubCell(centerX, centerY, 0);
      this.bathtub.addCell(cell, i, 0);
    }
  }

  private buildRightWall() {
    for (let i = 0; i < this.rows - 1; i++) {
      const centerX = this.startingX + (this.cols - 1) * this.columnWidth;
      const centerY = this.startingY + i * this.rowHeight;
      const cell = this.bathtubFactory.createDirichletBathtubCell(centerX, centerY, 0);
      this.bathtub.addCell(cell, i, this.cols - 1);
    }
  }

  private buildBottom() {
    for (let i = 0; i < this.cols; i++) {
      const centerX = this.startingX + i * this.columnWidth;
      const centerY = this.startingY + (this.rows - 1) * this.rowHeight;
      const cell = this.bathtubFactory.createDirichletBathtubCell(centerX, centerY, 0);
      this.bathtub.addCell(cell, this.rows - 1, i);
    }
  }

  private buildTop() {
    for (let i = 1; i < this.cols - 1; i++) {
      const centerX = this.startingX + i * this.columnWidth;
      const centerY = this.startingY;
      const cell = this.bathtubFactory.createDirichletBathtubCell(centerX, centerY, 0);
      this.bathtub.addCell(cell, 0, i);
    }
  }

  private fillInterior() {
    for (let j = 1; j < this.rows - 1; j++) {
      for (let i = 1; i < this.cols - 1; i++) {
        const centerX = this.startingX + i * this.columnWidth;
        const centerY = this.startingY + j * this.rowHeight;
        const cell = this.bathtubFactory.createInteriorBathtubCell(centerX, centerY, 255);
        this.bathtub.addCell(cell, j, i);
      }
    }
  }
}
