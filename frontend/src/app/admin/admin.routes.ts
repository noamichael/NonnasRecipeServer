import { Routes } from "@angular/router";
import { AdminComponent, CanActivateAdmin, UserListResolver } from "./admin.component";

export const routes: Routes = [
    {
      path: "",
      component: AdminComponent,
      canActivate: [CanActivateAdmin],
      resolve: {
        users: UserListResolver,
      },
    },
];