import { Component, Injectable, OnInit } from "@angular/core";
import { ActivatedRoute, CanActivate, Resolve, Router } from "@angular/router";
import { RecipeResponse } from "../recipe.service";
import { User } from "../schema/user";
import { UserService } from "../shared/user.service";

@Component({
  selector: "nr-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  users: User[];
  currentUser: User;
  roles = [
    { label: "Read Only", value: "readOnly" },
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.$auth.value;
    this.route.data.subscribe((data) => {
      this.users = data.users.data;
    });
  }
}

@Injectable({
  providedIn: "root",
})
export class CanActivateAdmin implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate() {
    const isAdmin = this.userService.isAdmin();

    if (!isAdmin) {
      this.router.navigate(["/"]);
    }

    return isAdmin;
  }
}

@Injectable({
  providedIn: "root",
})
export class UserListResolver
  implements Resolve<Promise<RecipeResponse<User[]>>> {
  constructor(
    private userService: UserService,
  ) {}

  resolve() {
    return this.userService.getUsers();
  }
}
