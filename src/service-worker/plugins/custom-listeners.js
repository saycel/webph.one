var NOTIFICATION_OPTION_NAMES = [
    'actions',
    'body',
    'dir',
    'icon',
    'lang',
    'renotify',
    'requireInteraction',
    'tag',
    'vibrate',
    'data'
];

export function CustomListeners () {
  return (worker) => new CustomListenersImpl(worker);
}

export class CustomListenersImpl {
  setup (ops) {
    var worker = null;
  }

  constructor (worker) {
    this.worker = worker;
    this.buffer = [];
    this.streams = [];

    self.addEventListener('notificationclick', function (event) {
      event.notification.close()
      if (event.action == 'yes') {
        event.waitUntil(
          clients.openWindow('/#/call').then(function (windowClient) {
          })
        )
      }
    })
  }

  push(data) {
    var payload;
    try {
      var dataParsed = JSON.parse(data);
      if ( dataParsed.notification.data.action === 'call-incoming' ) {
        payload = {
          notification: {
            title: 'Webph.one - Incoming call',
            body: dataParsed.notification.data.from,
            vibrate: [200, 100, 200, 100, 200, 100, 400],
            tag: 'request',
            icon: 'assets/icons/android-chrome-192x192.png',
            actions: [
              { action: 'yes', title: 'Answer' },
              { action: 'no', title: 'Hang up' }
            ]
          }
        };
      } else if ( dataParsed.notification.data.action === 'call-canceled' ) {
        payload = {
          notification: {
            title: 'Webph.one - Incoming call canceled',
            body: dataParsed.notification.data.from,
            vibrate: [200, 100, 200, 100, 200, 100, 400],
            icon: 'assets/icons/android-chrome-192x192.png'
          }
        };
      } else {
        payload = dataParsed;
      }
    } catch(err) {
      payload = {
        notification: {
            title: data
        }
      };
    }
    console.log('[SW] - Push notification', payload);
    this.showNotification(payload)
    if (this.buffer !== null) {
      this.buffer.push(payload);
    }
    else {
      this.streams.forEach(function (id) {
        this.worker.sendToStream(id, payload );
      });
    }
  }

  message(message, id) {
    console.log('[SW] - Message', message, id)
    switch (message['cmd']) {
      case 'push':
        this.streams.push(id);
        if (this.buffer !== null) {
          this.buffer.forEach(function (message) { return this.worker.sendToStream(id, message); });
          this.buffer = null;
        }
      break;
    }
  }
   
  messageClosed(id) {
    console.log('[SW] - Message closed', id)
    var index = this.streams.indexOf(id);
    if (index === -1) {
      return;
    }
    this.streams.splice(index, 1);
      if (this.streams.length === 0) {
        this.buffer = [];
      }
  }

  showNotification (data) {
        if (!data.notification || !data.notification.title) {
            return;
        }
        var desc = data.notification;
        var options = {};
        NOTIFICATION_OPTION_NAMES
            .filter(function (name) { return desc.hasOwnProperty(name); })
            .forEach(function (name) { return options[name] = desc[name]; });
        this.worker.showNotification(desc['title'], options);
    };

}