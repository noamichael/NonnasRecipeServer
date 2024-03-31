import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, CanActivateFn, ResolveFn, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { RecipeResponse } from "../recipe.service";
import { User } from "../schema/user";
import { UserService } from "../shared/user.service";
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { PageActionComponent } from "../page-action/page-action.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "nr-admin",
  standalone: true,
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
  providers: [MessageService],
  imports: [
    FormsModule,
    TableModule,
    DropdownModule,
    ToastModule,
    PageActionComponent
  ]
})
export class AdminComponent implements OnInit {
  users!: User[];
  currentUser!: User;
  roles = [
    { label: "Read Only", value: "readOnly" },
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.$auth.value;
    this.route.data.subscribe((data) => {
      this.users = data["users"].data;
    });
  }

  isCurrentUser(user: User) {
    return this.currentUser.id == user.id;
  }

  saveAll() {
    let promises: Promise<any>[] = [];

    for (let user of this.users) {

      if (this.isCurrentUser(user)) {
        continue;
      }

      promises.push(
        this.userService.saveUser(user),
      );
    }

    Promise.all(promises)
      .then(() => {
        this.addMessage('success', 'All users have been saved');
      })
      .catch(() => {
        this.addMessage('error', 'Could not save all users');
      });
  }

  addMessage(type: string, msg: string) {
    this.messageService.add({
      severity: type,
      summary: `${type[0].toUpperCase()}${type.substring(1)}`,
      detail: msg,
    });
  }

  back() {
    this.router.navigate(['/']);
  }
}

export const canActivateAdmin: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const isAdmin = userService.isAdmin();

  if (!isAdmin) {
    router.navigate(["/"]);
  }

  return isAdmin;
}

export const userListResolver: ResolveFn<RecipeResponse<User[]>> = () => {
  return inject(UserService).getUsers();
};
