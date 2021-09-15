import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { anonymous, User } from "../schema/user";
import jwt_decode from "jwt-decode";
import { HttpClient } from "@angular/common/http";

declare const google: any;
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
  ) {}

  bootstrap() {
    google.accounts.id.initialize({
      client_id,
      callback: (response) => {
        console.log(response);
        this.ngZone.run(() => {
          this.verify(response.credential).then((verifyRes) => {
            if (verifyRes["ok"]) {
              const user = jwt_decode(response.credential) as User;
              user.id = verifyRes.user.id;
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
    return this.http.post("/api/auth/sign-out", "").toPromise().then(
      () => {
        google.accounts.id.disableAutoSelect();
        this.updateUser(anonymous);
      },
    );
  }

  private verify(token: string): Promise<VerifyResponse> {
    return this.http.post<VerifyResponse>("/api/auth/verify", { token })
      .toPromise();
  }

  private getCurrentUser(): Promise<User> {
    return this.http.get<User>("/api/auth/identity")
      .toPromise();
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
    google.accounts.id.renderButton(document.getElementById("googleLogin"), {
      theme: "outline",
      size: "large",
    });
  }

  destroyLoginButton() {
    const button = document.getElementById("googleLogin");
    if (button) {
      document.getElementById("googleLogin").childNodes.forEach((n) =>
        n.remove()
      );
    }
  }

  isSignedIn() {
    return this.user && this.user.name != "anonymous";
  }

  private updateUser(user: User) {
    console.log(user);
    this.user = user;
    this.$auth.next(user);
  }
}
