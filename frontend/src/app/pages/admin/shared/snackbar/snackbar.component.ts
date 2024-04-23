import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrls: []
})
export class SnackbarComponent implements OnInit {
  dialogData: any;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
    this.dialogData = data;
  }

  ngOnInit(): void {
  }

}
