import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarTextComponent } from '../../../ui/avatar/avatar-text.component';

@Component({
  selector: 'app-basic-table-three',
  standalone: true,
  imports: [
    CommonModule,
    AvatarTextComponent,
  ],
  templateUrl: './basic-table-three.component.html',
  styles: ``
})
export class BasicTableThreeComponent {
  tableRowData = [
    { label: 'Add User' },
    { label: 'Create Role' },
    { label: 'Add Permission' },
    { label: 'View System Logs' },
  ];
}
