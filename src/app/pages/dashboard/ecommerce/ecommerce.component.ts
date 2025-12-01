import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { BasicTableTwoComponent } from '../../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component';
import { BasicTableThreeComponent } from '../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component';
@Component({
  selector: 'app-ecommerce',
  imports: [
    EcommerceMetricsComponent,
    BasicTableTwoComponent,
    BasicTableThreeComponent,
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent {}
