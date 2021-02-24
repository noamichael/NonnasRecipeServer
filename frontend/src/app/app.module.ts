import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { RecipeService } from './recipe.service';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ProgressBarModule,
    ButtonModule
  ],
  providers: [
    RecipeService,
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: (recipeService: RecipeService) => () => recipeService.bootstrap(),
      deps: [RecipeService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
