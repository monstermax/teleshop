
function initTelegram() {
    if (window.Telegram) {
        const WebApp = window.Telegram.WebApp;

        WebApp.MainButton.isVisible = false;
        WebApp.disableClosingConfirmation();
        WebApp.disableVerticalSwipes();
        WebApp.expand();
        WebApp.ready();

        if (window.location.pathname === '/shop') {
            WebApp.BackButton.hide();

        } else {
            WebApp.BackButton.show();

            WebApp.BackButton.onClick(() => window.history.back());
        }
    }
}
