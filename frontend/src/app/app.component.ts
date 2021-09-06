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
  sidebarOpen = false
  appName = "Nonna's";
  GOOGLE_CLIENT_ID = UserService.client_id;

  constructor(
    private router: Router,
    private userService: UserService,
    public keyboardService: KeyboardService,
    private confirmationService: ConfirmationService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.userService.$auth.subscribe((user) => {
      this.user = user;
      this.sidebarOpen = false;
      if (user.name != "anonymous") {
        this.appName = `${user.name.split(" ")[0]}'s'`;
        this.loggedIn = true; 
      } else {
        this.appName = "Nonna's";
        this.loggedIn = false;
      }

      // This is a stange hack I have to do in order for the
      // view to pick up on changes. I've tried everything
      // including setTimeout, but the timing of the gcp
      // callback simply doesn't trigger Change Detection
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

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSidebarShow() {
    if (!this.loggedIn) {
      this.userService.renderLoginButton();
    }
  }

  onSidebarHide() {
    this.userService.destroyLoginButton();
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
