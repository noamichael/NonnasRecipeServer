import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { KeyboardService } from './shared/keyboard.service';

@Component({
  selector: 'nr-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  loading: boolean

  constructor(
    private router: Router,
    public keyboardService: KeyboardService
  ) { }

  ngOnInit() {
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
    this.keyboardService.attach()
  }

  closeKeyboard() {
    this.keyboardService.close();
  }

  onEnabledChange() {
    location.reload()
  }

}
