'use strict';

//Register service worker
var isSubscribed,
    swRegistration,
    subscrpt,
    applicationServerPublicKey = 'BJ7qGfC27QrXGJCA3snSJpD9o_dV8ooS0SpxTP65YsAEOCvhXBZwJzmjL3T1Wgq4aDaI1DXsLJkzRtK7YYqs3ho';
if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');
    navigator.serviceWorker.register('sw.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);
            swRegistration = swReg;
            navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
                subscribe();
            });
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
}

$('.js-push-btn').click(function () {
    var data = {
        title: $('#title').val(),
        message: $('#message').val()
    };

    $.post('/push', {
        data: data,
        subscription: JSON.stringify(subscrpt)
    }, function (result) {
        console.log(result);
    });
});

function subscribe() {
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);
            if (isSubscribed) {
                //User is subscribed - do nothing if you already have the subscription object on the server.
                console.log('User IS subscribed.', JSON.stringify(subscription));
                subscrpt = subscription;
            } else {
                console.log('User is NOT subscribed. - Subscribing');
                subscribeUser();
            }
        });
}

function subscribeUser() {
    const applicationServerKey = urlBase64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
            /*
               "subscription" is the object you need to use to send push message from the server.
               Use ajax to store the content on the server.
            */
            console.log('User is subscribed:', subscription);
            subscrpt = subscription;
            isSubscribed = true;
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
        });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
