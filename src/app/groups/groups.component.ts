import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop'
import { Team } from '../models/Team';
import { outputAst } from '@angular/compiler';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  @Output()
  moveTeam = new EventEmitter<any>();
  
  @Input()
  groups!: Team[][];

  ngOnInit(): void {
    this.initGroup()
  }

  initGroup() {
    this.groups = [];
    for(var i=0; i < 8; i++) {
      this.groups[i] = [
        { name: '', img: '' },
        { name: '', img: '' },
        { name: '', img: '' },
        { name: '', img: '' }
      ]
    }
  }

  drop(event: any, index: number) {
    moveItemInArray(this.groups[index], event.previousIndex, event.currentIndex)
    this.moveTeam.emit(this.groups)
  }
}
