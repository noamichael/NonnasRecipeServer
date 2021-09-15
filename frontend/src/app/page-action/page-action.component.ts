import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  PageActionPosition,
  PageActionService,
} from "../shared/page-action.service";

@Component({
  selector: "nr-page-action",
  templateUrl: "./page-action.component.html",
  styleUrls: ["./page-action.component.scss"],
})
export class PageActionComponent implements OnInit, OnDestroy {
  @Input()
  label: string;
  @Input()
  icon: string;
  @Input()
  color: string;
  @Input()
  desktop: PageActionPosition;
  @Input()
  mobile: PageActionPosition;
  @Output()
  click = new EventEmitter<MouseEvent>();

  constructor(
    private pageActionService: PageActionService,
  ) {}

  ngOnInit(): void {
    this.pageActionService.register(this);
  }

  ngOnDestroy(): void {
    this.pageActionService.unregister(this);
  }

  onClick(mouseEvent: MouseEvent) {
    this.click.emit(mouseEvent);
  }
}
