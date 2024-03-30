import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { UserService } from './shared/user.service';
import { RecipeService } from './recipe.service';

const initialize = (recipeService: RecipeService, userService: UserService) => {
  return () =>
    Promise.all([
      recipeService.bootstrap(),
      userService.bootstrap(),
    ]);
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: 'APP_INITIALIZER',
      useFactory: initialize,
      deps: [RecipeService, UserService],
      multi: true
    }
  ],
};
