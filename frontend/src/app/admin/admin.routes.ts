import { Routes } from "@angular/router";
import { AdminComponent, canActivateAdmin, userListResolver } from "./admin.component";

export const routes: Routes = [
    {
      path: "",
      component: AdminComponent,
      canActivate: [canActivateAdmin],
      resolve: {
        users: userListResolver,
      },
    },
];