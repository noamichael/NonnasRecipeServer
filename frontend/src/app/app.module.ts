import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { ProgressBarModule } from "primeng/progressbar";
import { RecipeService } from "./recipe.service";
import { ButtonModule } from "primeng/button";
import { UserService } from "./shared/user.service";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { SidebarModule } from 'primeng/sidebar';
import { PageActionModule } from "./page-action/page-action.module";
import { TriStateCheckboxModule } from "primeng/tristatecheckbox";

const initialize = (recipeService: RecipeService, userService: UserService) => {
  return () =>
    Promise.all([
      recipeService.bootstrap(),
      userService.bootstrap(),
    ]);
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ProgressBarModule,
    ButtonModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    SidebarModule,
    PageActionModule,
    TriStateCheckboxModule,
  ],
  providers: [
    RecipeService,
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: initialize,
      deps: [RecipeService, UserService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
