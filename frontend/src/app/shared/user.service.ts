import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { anonymous, User, UserRole } from "../schema/user";
import { jwtDecode } from "jwt-decode";
import { HttpClient } from "@angular/common/http";
import { RecipeResponse } from "../recipe.service";

const client_id =
  "168337345714-natmvlg4lc80c2nfn8ld76ub9im586e4.apps.googleusercontent.com";

export interface VerifyResponse {
  ok: boolean;
  user?: User;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private user: User = anonymous;

  static client_id = client_id;

  $auth = new BehaviorSubject<User>(anonymous);

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
  ) { }

  bootstrap() {
    google.accounts.id.initialize({
      client_id,
      callback: (response) => {
        console.log(response);
        this.ngZone.run(() => {
          this.verify(response.credential).then((verifyRes) => {
            if (verifyRes["ok"]) {
              const user = jwtDecode(response.credential) as User;
              user.id = verifyRes.user?.id as number;
              user.userRole = verifyRes.user?.userRole as UserRole;
              this.updateUser(user);
            }
          });
        });
      },
    });

    return this.getCurrentUser().catch(() => {
      this.promptForLogin();
      return anonymous;
    }).then((user) => {
      this.updateUser(user);
    });
  }

  signOut() {
    return lastValueFrom(this.http.post("/api/auth/sign-out", "")).then(
      () => {
        google.accounts.id.disableAutoSelect();
        this.updateUser(anonymous);
      },
    );
  }

  private verify(token: string): Promise<VerifyResponse> {
    return lastValueFrom(this.http.post<VerifyResponse>("/api/auth/verify", { token }))
  }

  private getCurrentUser(): Promise<User> {
    return lastValueFrom(this.http.get<User>("/api/auth/identity"));
  }

  promptForLogin() {
    this.ngZone.run(() => {
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // TODO: do I need to know this?
        }
      });
    });
  }

  renderLoginButton() {
    google.accounts.id.renderButton(document.getElementById("googleLogin") as HTMLElement, {
      theme: "outline",
      size: "large",
    } as any);
  }

  destroyLoginButton() {
    const button = document.getElementById("googleLogin");
    if (button) {
      document.getElementById("googleLogin")!.childNodes.forEach((n) =>
        n.remove()
      );
    }
  }

  getUsers(): Promise<RecipeResponse<User[]>> {
    return lastValueFrom(this.http.get<RecipeResponse<User[]>>("/api/auth/users"));
  }

  saveUser(user: User): Promise<RecipeResponse<User[]>> {
    return lastValueFrom(this.http.post<RecipeResponse<User[]>>("/api/auth/users", user));
  }

  isSignedIn() {
    return this.user && this.user.name !== "anonymous";
  }

  canWriteRecipes() {
    return this.user && this.user.userRole !== 'readOnly';
  }

  isAdmin() {
    return this.user && this.user.userRole === "admin";
  }

  private updateUser(user: User) {
    console.log(user);
    this.user = user;
    this.$auth.next(user);
  }
}
