import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, tap, fromEvent, map } from 'rxjs';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatDialogModule],
  selector: 'app-modal',
  template: '',
})
export class ModalComponent {
  #dialog = inject(MatDialog);

  @Input() set isOpen(value: boolean) {
    console.log('Modal component', value);
    if (value && this.template) {
      this.#dialog.open(this.template, { panelClass: '' });
      return;
    }

    this.#dialog.closeAll();
  }

  @ContentChild(TemplateRef, { static: false }) template:
    | TemplateRef<unknown>
    | undefined;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal [isOpen]="!!(source$ | async)">
      <ng-template> <p>Modal</p></ng-template>
    </app-modal>
  `,
})
export class AppComponent {
  source$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    filter(({ code }) => code === 'Enter'),
    map(() => true),
    tap((val) => console.log('Emitted val', val))
  );
}

bootstrapApplication(AppComponent, {
  providers: [provideAnimations()],
});
