import { Injectable } from "@angular/core";

export type PageActionPosition = 'hidden' | 'topbar' | 'bottom-sheet';

interface PageAction {
  label: string;
  icon: string;
  color: string;
  desktop: PageActionPosition;
  mobile: PageActionPosition;
  onClick: (event: MouseEvent) => void;
}

@Injectable({ providedIn: "***REMOVED***" })
export class PageActionService {

  pageActions: PageAction[] = [];

  register(pageAction: PageAction) {
    this.pageActions.push(pageAction);
  }

  unregister(pageAction: PageAction) {
    const index = this.pageActions.indexOf(pageAction);
    if (index < 0) {
      return;
    }
    this.pageActions.splice(index, 1);
  }
}
