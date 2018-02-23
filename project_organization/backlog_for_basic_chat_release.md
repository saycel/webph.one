# Backlog for basic chat release

<b>Objective:</b> allow community users to text within people outside the community.

<b>Scope:</b>

* Send and receive simple text messages between GSM and App, and App to App.

* Have a “Whatsapp-like” experience

## Phases into the release
* The hard/tricky/unknown technical stuff to make it work [in progress]

   * Text GSM <--> App

* Basic send and receive on one conversation [in progress]

* Basic navigation [planning]

* Receive messages and notifications

   * Notifications and connectivity scenarios

* Some more details…?

## Phase 2: Basic navigation (being planned)
### User stories included

* See an existing conversation

   * See my list of conversations.

   * Search for a conversation

* Start a conversation

* Leave a conversation

### User stories detail (work in progress)

<b>See an existing conversation</b>

<b>User Story:</b> As an app user I need to choose an existing conversation to send a new message on it.

<b>Acceptance criteria:</b>
- [ ] While having the app in foreground, when I choose <tbd> I see my existing conversations.
- [ ] When I tap on any part of the line of one conversation I see the conversation (no details or photo so far).
- [ ] When I enter the conversation, it is scrolled to the bottom and keyboard is closed.

<b>See my list of conversations</b>

<b>User Story:</b> As an app user I need to see my conversations to... pick one of them

<b>Acceptance criteria:</b>

- [ ] Each conversation shows the name of the contact, last message (just one line) and time of the message.
- [ ] Conversations are in descendent order and can be scrolled..
- [ ] On a phone without conversations, see no conversations.
- [ ] Create new conversations. Go and see the new conversations.

<b>Search for a conversation</b>

<b>User Story:</b> As an app user I need to be able to search a conversation by the name of the contact to find it faster

<b>Acceptance criteria:</b>
- [ ] Search button (magnifying glass) over the list of conversations.
- [ ] When tap on the search button:

   * the upper part of the screen changes to a text field

   * there is also a back arrow on the left of the field

   * an X button to delete all the content of the search field
<i>// is it hard to change the “enter” icon for a “search” icon on the keyboard?</i>
<i>// Hacemos que busque al presionar cada letra, sin esperar que aprete “enter”?</i>
- [ ] only conversations with contacts that have the typed text into their name are shown //es más simple así, no?
- [ ] Conversations are ordered by the date of the last activity (message)
- [ ] Hide the “new message” button

<b>Just send a message button</b>

<b>User Story:</b> As an app user I need an option to send a message so I can execute the action without going through an specific path

<b>Acceptance criteria:</b>
- [ ] While seeing the list of conversations, there is a button with a pen on the lower right.
- [ ] After tapping on the pen button, the app shows the list of contacts.
- [ ] Tapping on a contact opens a conversation screen with that contact
