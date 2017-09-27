export function CustomListeners () {
  return (worker) => new CustomListenersImpl(worker);
}

export class CustomListenersImpl {

  setup (ops) {}

  constructor (worker) {
    self.addEventListener('push', function (event) {
        var payload = event.data.json().notification;

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
          )
        }
    });

    self.addEventListener('notificationclick', function (event) {
      event.notification.close()

      if (event.action == 'yes') {
        event.waitUntil(
          clients.openWindow('/#/call').then(function (windowClient) {
          })
        )
      }
    })

    self.addEventListener('notificationclose', function (event) {
    })
  }

}