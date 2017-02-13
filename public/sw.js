self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const data = JSON.parse(event.data.text());
    const title = data.title;
    const options = {
        body: data.message, //Your push message - event.data.text() for instance
        icon: '/assets/img/notify-icon.png' //image
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('http://localhost:3000')
    );
});
