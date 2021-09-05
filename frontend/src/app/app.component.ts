import { ChangeDetectorRef, Component, NgZone, OnInit } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from "@angular/router";
import { User } from "./schema/user";
import { KeyboardService } from "./shared/keyboard.service";
import { UserService } from "./shared/user.service";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: "nr-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [ConfirmationService],
})
export class AppComponent implements OnInit {
  loading: boolean;
  loggedIn: boolean = false;
  user: User;
  appName = "Nonna's";

  constructor(
    private router: Router,
    private userService: UserService,
    public keyboardService: KeyboardService,
    private confirmationService: ConfirmationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.$auth.subscribe((user) => {
      this.user = user;
      if (user.name != "anonymous") {
        this.appName = `${user.name.split(" ")[0]}'s'`;
        this.loggedIn = true;
      } else {
        this.appName = "Nonna's";
        this.loggedIn = false;
      }
      console.log("Updating appComponent", this)
      this.changeDetector.detectChanges();
    });
    this.router.events.subscribe((event: any) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
    this.keyboardService.attach();
  }

  closeKeyboard() {
    this.keyboardService.close();
  }

  onEnabledChange() {
    location.reload();
  }

  signIn() {
    this.userService.promptForLogin();
  }

  signOut() {
    this.confirmationService.confirm({
      key: "appConfirm",
      message: "Are you sure that you want to logout?",
      accept: () => {
        this.userService.signOut();
      },
    });
  }
}
