import { NgModule } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { PageActionComponent } from '../page-action/page-action.component';


@NgModule({
  declarations: [
    PageActionComponent,
  ],
  exports: [PageActionComponent],
  imports: [
    ButtonModule,
  ]
})
export class PageActionModule {}
