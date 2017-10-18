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
      console.log('[SW] - Notification event', event.notification)
      //Notification from Foreground
      if(event.notification.tag === 'document-hidden') {
        event.waitUntil(
          clients.matchAll({ type: 'window' }).then(clientList => {
            if (clientList.length > 0) {
              //Yes to foreground
              if (event.action == 'yes') {  
                clientList[0].postMessage({autoanswer: true});
                return clientList[0].focus()
              } 
              //No to foreground
              else {
                return clientList[0].postMessage({autoreject: true});
              }
            }
          })
        )
      }
      //Notification from Backend
      else {
        //Yes
        if (event.action == 'yes') {  
          event.waitUntil(
            clients.openWindow('https://pearlcel.webph.one/#/call/answer/true')
          )
        }
        //No
        else {
          event.waitUntil(
            fetch('https://webphone.rhizomatica.org/webpush/reject/' + event.notification.data.id, {mode: 'cors'})
          )
        }
      }
    });
  }

  push(data) {
    var payload;
    var important = false;
    try {
      var dataParsed = JSON.parse(data);

      if (dataParsed.notification.tag && dataParsed.notification.tag === 'document-hidden' ) {
        important = true;
      }
      console.log('[SW] - Row notification', dataParsed);
      if ( dataParsed.notification.data.action === 'call-incoming' ) {
        payload = {
          notification: {
            title: 'Webph.one - Incoming call',
            body: dataParsed.notification.data.from,
            data: {id : dataParsed.notification.data.id },
            vibrate: [200, 100, 200, 100, 200, 100, 400],
            tag: dataParsed.notification.tag || 'request',
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
    this.showNotification(payload, important)
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

  showNotification (data, important) {
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      console.log('[SW] - Not show notifications on clients opens', clientList);
      if (clientList.length > 0 && important === false) { 
        return;
      }

      if (!data.notification || !data.notification.title) {
          return;
      }

      var desc = data.notification;
      var options = {};
      NOTIFICATION_OPTION_NAMES
          .filter(function (name) { return desc.hasOwnProperty(name); })
          .forEach(function (name) { return options[name] = desc[name]; });
      this.worker.showNotification(desc['title'], options);
    })
  }

}