import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TableModule } from "primeng/table";

import {DropdownModule} from 'primeng/dropdown';

import {
  AdminComponent,
  CanActivateAdmin,
  UserListResolver,
} from "./admin.component";
import { FormsModule } from "@angular/forms";

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
    RouterModule.forChild(routes),
  ],
})
export class AdminModule {}
