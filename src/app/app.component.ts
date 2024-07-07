import { AgGridAngular } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TreeComponent } from './tree/tree.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AgGridAngular, TreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ng-jest-grid';
  treeData = [
    {
      id: '1',
      uniqueId: '1',
      expanded: true,
      label: 'parent1',
      isLeaf: false,
      selected: false,
      children: [
        {
          id: '1-1',
          uniqueId: '2',
          expanded: false,
          label: 'parent1-1',
          isLeaf: true,
          selected: false
        },
        {
          id: '1-2',
          expanded: false,
          uniqueId: '3',
          label: 'parent1-2',
          isLeaf: false,
          selected: false,
          children: [
            {
              id: '1-2-1',
              uniqueId: '4',
              expanded: false,
              label: 'parent1-2-1',
              isLeaf: true,
              selected: false,
            }
          ]
        },
        {
          id: '1-3',
          expanded: false,
          uniqueId: '3',
          label: 'parent1-3',
          isLeaf: true,
          selected: false,
        }
      ]
    }
  ];
  constructor() {}
  ngOnInit(): void {
  }
}
