export function CustomListeners () {
  return (worker) => new CustomListenersImpl(worker);
}

export class CustomListenersImpl {
  setup (ops) {
    var worker = null;
  }

  constructor (worker) {
    this.worker = worker;
    addEventListener('notificationclick', function (event) {
      event.notification.close()
      if (event.action == 'yes') {
        event.waitUntil(
          clients.openWindow('/#/call').then(function (windowClient) {
          })
        )
      }
    })
    addEventListener('push', function (event) {
        var payload = event.data.json().notification;
        console.log('[SW] - Push notification', event.data.json());
        if ( payload.data.action === 'call-incoming' ) {
        event.waitUntil(
          self.registration.showNotification('Webph.one - Incoming call', {
            body: payload.data.from,
            vibrate: [200, 100, 200, 100, 200, 100, 400],
            tag: 'request',
            icon: 'assets/icons/android-chrome-192x192.png',
            actions: [
              { action: 'yes', title: 'Answer' },
              { action: 'no', title: 'Hang up' }
            ]
          })
        );
      }
    })
  }
}