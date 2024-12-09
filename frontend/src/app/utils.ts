function moveInArray<T>(arr: T[], oldIndex: number, newIndex: number) {
    while (oldIndex < 0) {
        oldIndex += arr.length;
    }
    while (newIndex < 0) {
        newIndex += arr.length;
    }
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined as T);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing purposes
}

function debounce(fn: Function, millis = 800){
    let timeoutId: number;
    return function(){
        const args = Array.prototype.slice.call(arguments);
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(fn, millis, ...args);
    }
}

export const Utils = { moveInArray, debounce };