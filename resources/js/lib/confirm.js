let confirmHandler = null;

export function registerConfirmHandler(handler) {
    confirmHandler = handler;
}

export function confirmAction(options) {
    if (confirmHandler) {
        return confirmHandler(options);
    }
    return Promise.resolve(window.confirm(options.message || 'Lanjutkan tindakan?'));
}
