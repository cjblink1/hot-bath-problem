import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { BaseType, Selection } from 'd3';
import { BathtubFactory } from './model/bathtub-factory';
import { Bathtub } from './model/bathtub';
import { Dirichlet } from './model/update-strategy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hot-bath-problem';
  private bathtubRef: Selection<Element, {}, HTMLElement, any>;
  private simulationRef: Selection<Element, {}, HTMLElement, any>;
  private cols = 135;
  private rows = 58;
  private columnWidth = 10;
  private rowHeight = 10;
  private cx;
  private cy;
  private startingX;
  private startingY;
  private bathtubFactory: BathtubFactory;
  private bathtub: Bathtub;

  ngOnInit(): void {
    this.simulationRef = d3.select('#simulation');
    this.bathtubRef = d3.select('#bathtub');

    this.cx = this.simulationRef.node().clientWidth / 2;
    this.cy = this.simulationRef.node().clientHeight / 2;
    // console.log('cx', this.cx);
    this.startingX = this.cx - this.columnWidth * (this.cols / 2);
    this.startingY = this.cy - this.rowHeight * (this.rows / 2);
    // console.log('startingx', this.startingX);

    this.bathtubFactory = new BathtubFactory(this.simulationRef, this.bathtubRef, this.cols, this.rows, this.columnWidth, this.rowHeight);
    this.bathtub = this.bathtubFactory.createBathtub();

    this.buildLeftWall();
    this.buildRightWall();
    this.buildBottom();
    this.buildTop();
    this.fillInterior();

    this.bathtub.getCell(25, 20).setUpdateStrategy(new Dirichlet());
    this.bathtub.getCell(25, 20).temp = 0;

    this.bathtub.linkCells();



    d3.interval(elapsed => {
      this.bathtub.update();
      this.bathtub.commit();
      this.bathtub.render();
    }, 15);
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
