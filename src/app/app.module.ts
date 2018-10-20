import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatFormFieldModule, MatDialogModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { KatexModule } from 'ng-katex';

import { AppComponent } from './app.component';
import { ExplainDialogComponent } from './explain-dialog/explain-dialog.component';
import { FormsModule } from '@angular/forms';
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
    MatInputModule,
    FormsModule,
    KatexModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ExplainDialogComponent
  ]
})
export class AppModule { }
