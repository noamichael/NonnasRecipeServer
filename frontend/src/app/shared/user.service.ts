import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { anonymous, User } from "../schema/user";
import jwt_decode from "jwt-decode";
import { HttpClient } from "@angular/common/http";

declare const google: any;
const client_id =
  "168337345714-natmvlg4lc80c2nfn8ld76ub9im586e4.apps.googleusercontent.com";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private user: User = anonymous;
  $auth = new BehaviorSubject<User>(anonymous);

  constructor(
    private http: HttpClient,
  ) {}

  bootstrap() {
    google.accounts.id.initialize({
      client_id,
      callback: (response) => {
        console.log(response);
        this.verify(response.credential).then((verifyRes) => {
          if (verifyRes["ok"]) {
            const user = jwt_decode(response.credential) as User;
            this.updateUser(user);
          }
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
    return this.http.post("/public-api/auth/sign-out", "").toPromise().then(
      () => {
        google.accounts.id.disableAutoSelect();
        this.updateUser(anonymous);
      },
    );
  }

  private verify(token: string) {
    return this.http.post("/public-api/auth/verify", { token })
      .toPromise();
  }

  private getCurrentUser(): Promise<User> {
    return this.http.get<User>("/public-api/auth/identity")
      .toPromise();
  }

  promptForLogin() {
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // TODO: do I need to know this?
      }
    });
  }

  private updateUser(user: User) {
    console.log(user);
    this.user = user;
    this.$auth.next(user);
  }
}
