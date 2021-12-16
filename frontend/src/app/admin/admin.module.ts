import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";

import {
  AdminComponent,
  CanActivateAdmin,
  UserListResolver,
} from "./admin.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { PageActionModule } from "../page-action/page-action.module";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [CanActivateAdmin],
    resolve: {
      users: UserListResolver,
    },
  },
];

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    RouterModule.forChild(routes),
    PageActionModule,
  ],
})
export class AdminModule {}
