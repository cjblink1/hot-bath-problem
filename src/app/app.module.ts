import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatFormFieldModule, MatDialogModule } from '@angular/material';
import { KatexModule } from 'ng-katex';

import { AppComponent } from './app.component';
import { ExplainDialogComponent } from './explain-dialog/explain-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    ExplainDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    KatexModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ExplainDialogComponent
  ]
})
export class AppModule { }
