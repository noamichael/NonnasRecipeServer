import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import Keyboard from "simple-keyboard";
import { filter } from 'rxjs/operators';

export interface ActiveInput {
    onChange: (string) => void
    onKeyPress: (string) => void,
    getInput: () => HTMLInputElement
}

const noop = () => { };
const noopInput: ActiveInput = { onChange: noop, onKeyPress: noop, getInput: () => null }

function getRandomId() {
    const id = new Uint32Array(1);
    window.crypto.getRandomValues(id);
    return id.join('')
}

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {

    private keyboard: Keyboard
    private element: HTMLElement
    private activeInput: ActiveInput = noopInput

    constructor(private router: Router) {
        router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
            this.close();
        });
    }

    attach() {
        if (!this.enabled) {
            return;
        }
        this.keyboard = new Keyboard({
            onChange: input => this.onChange(input),
            onKeyPress: button => this.onKeyPress(button)
        });
        this.element = document.querySelector('.keyboard-wrapper');
    }

    close() {
        if (!this.enabled) {
            return;
        }
        this.element.style.display = 'none';
        document.body.style.marginBottom = null;
    }

    destroy() {
        if (!this.enabled) {
            return;
        }
        this.keyboard.destroy();
    }

    destroyInput(inputEl: HTMLInputElement) {
        if (!this.enabled) {
            return;
        }
        this.keyboard.clearInput(inputEl.dataset.id)
    }

    setActiveInput(input: ActiveInput) {
        if (!this.enabled) {
            return;
        }
        this.activeInput = input || noopInput;
        if (input) {
            this.element.style.display = 'block';
            document.body.style.marginBottom = '50vh';
            const inputEl = input.getInput();
            if (!inputEl.dataset.id) {
                inputEl.dataset.id = `input-${getRandomId()}`
            }
            this.keyboard.setOptions({
                inputName: inputEl.dataset.id
            })
            this.keyboard.setInput(inputEl.value, inputEl.dataset.id);
        } else {
            this.close()
        }
    }

    onChange(input: string) {
        console.log(`Input event: ${input}`)
        this.activeInput.onChange(input);
    }

    onKeyPress(input: string) {
        console.log(`Input event: ${input}`);
        this.activeInput.onKeyPress(input);
    }

    get enabled() {
        const enabled = localStorage.getItem('onscreen-keyboard')
        return enabled ? enabled === "true" : false
    }

    set enabled(enabled: boolean) {
        localStorage.setItem('onscreen-keyboard', enabled.toString());
    }
}