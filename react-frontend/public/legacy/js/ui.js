export function show(element) {
    if (element) {
        element.style.display = "";
    }
}

export function hide(element) {
    if (element) {
        element.style.display = "none";
    }
}

export function setText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

export function showMessage(element, message, type = "info") {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
    }
}

export function clearMessage(element) {
    if (element) {
        element.textContent = "";
        element.className = "message";
    }
}

export function toggle(element, condition) {
    if (condition) {
        show(element);
    } else {
        hide(element);
    }
}