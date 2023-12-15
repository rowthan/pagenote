

export function toast(message: string, type: "success"|"info"|"error" = 'info', duration=3000) {
    const element = document.createElement('div');
    element.innerHTML = `
            <div class="toast toast-end">
                <div class="alert alert-${type}">
                    <div>
                        <span>${message}</span>
                    </div>
                </div>
            </div>
    `
    document.body.appendChild(element);
    setTimeout(function () {
        element.parentElement?.removeChild(element)
    },duration)
}
