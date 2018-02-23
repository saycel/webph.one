# Project plans

<b>Current release:</b> We're currently working to <b>build the basic app that Rhizomatica needs</b>, which initially means to add the <b>basic SMS/Chat</b> features to the current version. You can see the backlog for that release in [this file](https://github.com/saycel/webph.one/blob/develop/project_organization/backlog_for_basic_chat_release.md).

<b>Last release:</b> Last (and first!) release was for the SayCel network in Pearl Lagoon to start testing the app, being the main scope for that the basic app <--> GSM calling features. It also included basic users management, contacts management and social features, as well as all the necessary backend configuration.

## Next Releases

<b>Milestone:</b> an improved app for general purpose.

<b>Main scope:</b> fixes and details that provide a better experience within the current scope

<b>Main product backlog items:</b>

* Calls record

* Add contact from calls record (either incoming or outgoing call)

* See the name if the contact was in the directory (calls, chat)

* ...

## Product backlog (PB)
<i>Items in the PB (PBIs) are ideas, features or tasks that have been identified but are not right now at the top of the priority. The PB is used to store and organize them, being the main source for mid and short term planning.</i>

## Unplanned items
User guidance and help
* Help tab
* Have an specific screen or tab for version, login, etc
* Note explaining the need of allowing microphone (if user doesn’t allow)

Social
* Add suggested text when sharing in facebook
* Improve text for sharing in all the ways of sharing

Using experience
* Thank users for their feedback and let them know it was sent correctly
* Rename button to save changes after editing from “edit” to “save”.
* Show the message ~"contact saved" after saving a contact
* If changing tabs (Call - Directory - Call) do not lose the number that was typed for dialing
* Tapping on the name of a personal contact in the directory to dial the number (or open for edit, but do something). Check also consistency with the behaviour of the public numbers
* Remove “red” button from the dial pad.

Minor fixes
* The message I get when call is rejected is “we could not complete the call” which seems like if there is a problem on the system. I need something that tells me that the call was rejected. Something similar happens when the call is not answered
* After finishing a call, new calls to one of the involved numbers are rejected as if user were busy when he’s not.
* What is that awkward sound that sounds sometimes just after tapping the “call” button
* Sometimes, after accepting to answer an incoming call from the notification, the app opens but the call is not established (as rejected) and the caller gets the rejected (we could not connect your call) message.
* When a call is rejected from the notifications the rejection is not reaching the caller, so it keeps ringing.

Aesthetics
* “Contact list” → “Contact List” on Directory tab
* Change ugly sound when an err
* Devices compatibility
* Basic check of browser compatibility and message
   * “No support for Safari” note

Mini features
* Opción para no contestar la encuesta post llamada (aunque es lo mismo que poner submit sin nada)
* Opción para que no vuelva a mostrar la encuesta post llamada. Luego un lugar donde ver y administrar esta decisión?
* Contemplar el caso en el que pone “Recordar” cuando rechaza el pedido para mostrar notificaciones. Evaluar si ponemos algo en las FAQ o en mensajes cada vez que abre la app.
* Empty number when adding a new contact. Currently it has a 0

Advanced chat
* Search words in one conversation or in any conversation
* Search contacts on conversations (to select a conversation)
* Show user status or last connection time
* While the app is not closed, save a message in draft if written but not send
* Show message status
* Emoticons
* Pictures
* Audio
* Multiple languages
* Groups

Users and devices
* User registration, identification, pwd recovery
* Same user on multiple devices
* GSM user has the same number when using an app

Advanced app functionalities
* Gestión avanzada de notificaciones desde el dispositivo del usuario: 
   * ¿Qué pasa si quiero cancelar el permiso para las notificaciones?
   * ¿Hay forma de ver y administrar directamente en el celular estas notificaciones?

Calling features
* Allow Copy paste numbers to call
* Delete numbers by keeping the erase button pushed
* Allow to Set the cursor in a specific point in the middle of a dialed number
* Manage incoming calls when making a call from another app, the same app, listening music, and vice versa
* Manage incoming call when performing an action on this app like sharing, texting or adding a contact
* Calls history, starred/frequent
* Mute button
* Try to reconnect if call is lost
* Clear sounds for falling, connections and reconnections
* When calling a nonexistent number, let me know that.
* end the ringing when the caller cuts before the call being accepted (now it keeps showing the incoming call notification and ringing)
* As an app user I need to see on the screen that my call has been successfully connected.
* Show the name of the contact in contexts like after selecting it from the directory to call, when receiving a call, when calling...

Contacts management
* Add contact after receiving call
* See contact information when receiving call from someone on the contact list
* Search contacts

Fancy general features
* Profile photo
* Animations when the call is ringing

Fancy features for calling
* Conference call

Special User Stories not prioritized
* Number assignment when used without installing
* Receiving notifications before adding to home does not know what app use to accept the call (issue on git)

Laptop features
* Enable delete key, enter to call and esc for deleting the whole number

Improve environments
* Move the gateway in Frankfurt to a server closer to the communities.
* Install a gateway in the communities and make the app to choose the more convenient.

Native services to overcome PWA limitations
* Choose to reproduce audio like in a regular call
* not possible to turn off the screen while in a call
* not possible to detect that the phone is near the head
* not possible to easily normalize the mic input volume
* not possible to detect whether we are using mic or headphones
* not possible to read the contacts of the phone
* not possible to be registered directly to the SIP server (dependency with push notification server)
* not possible to reproduce a ring sound while incoming call
* not possible to show a incoming call full screen interface, only notification
