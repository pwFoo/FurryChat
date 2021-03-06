import 'dart:async';
import 'dart:io';
import 'dart:math';

import 'package:famedlysdk/famedlysdk.dart';
import 'package:file_picker_cross/file_picker_cross.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_gen/gen_l10n/l10n.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pedantic/pedantic.dart';
import 'package:scroll_to_index/scroll_to_index.dart';
import 'package:swipe_to_action/swipe_to_action.dart';

import '../components/adaptive_page_layout.dart';
import '../components/avatar.dart';
import '../components/chat_settings_popup_menu.dart';
import '../components/connection_status_header.dart';
import '../components/dialogs/recording_dialog.dart';
import '../components/dialogs/send_file_dialog.dart';
import '../components/dialogs/simple_dialogs.dart';
import '../components/encryption_button.dart';
import '../components/input_bar.dart';
import '../components/list_items/message.dart';
import '../components/matrix.dart';
import '../components/reply_content.dart';
import '../components/user_bottom_sheet.dart';
import '../config/app_emojis.dart';
import '../utils/app_route.dart';
import '../utils/matrix_file_extension.dart';
import '../utils/matrix_locals.dart';
import '../utils/platform_infos.dart';
import '../utils/room_status_extension.dart';
import 'chat_details.dart';
import 'chat_list.dart';

class ChatView extends StatelessWidget {
  final String id;
  final String scrollToEventId;

  const ChatView(this.id, {Key key, this.scrollToEventId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return AdaptivePageLayout(
      primaryPage: FocusPage.SECOND,
      firstScaffold: ChatList(
        activeChat: id,
      ),
      secondScaffold: _Chat(id, scrollToEventId: scrollToEventId),
    );
  }
}

class _Chat extends StatefulWidget {
  final String id;
  final String scrollToEventId;

  const _Chat(this.id, {Key key, this.scrollToEventId}) : super(key: key);

  @override
  _ChatState createState() => _ChatState();
}

class _ChatState extends State<_Chat> {
  Room room;

  Timeline timeline;

  MatrixState matrix;

  String seenByText = '';

  final AutoScrollController _scrollController = AutoScrollController();

  FocusNode inputFocus = FocusNode();

  Timer typingCoolDown;
  Timer typingTimeout;
  bool currentlyTyping = false;

  List<Event> selectedEvents = [];

  Event replyEvent;

  Event editEvent;

  bool showScrollDownButton = false;

  bool get selectMode => selectedEvents.isNotEmpty;

  bool _loadingHistory = false;

  final int _loadHistoryCount = 100;

  String inputText = '';

  String pendingText = '';

  bool get _canLoadMore => timeline.events.last.type != EventTypes.RoomCreate;

  void requestHistory() async {
    if (_canLoadMore) {
      setState(() => _loadingHistory = true);

      await SimpleDialogs(context).tryRequestWithErrorToast(
        timeline.requestHistory(historyCount: _loadHistoryCount),
      );

      // we do NOT setState() here as then the event order will be wrong.
      // instead, we just set our variable to false, and rely on timeline update to set the
      // new state, thus triggering a re-render, for us
      _loadingHistory = false;
    }
  }

  void _updateScrollController() {
    if (_scrollController.position.pixels ==
            _scrollController.position.maxScrollExtent &&
        timeline.events.isNotEmpty &&
        timeline.events[timeline.events.length - 1].type !=
            EventTypes.RoomCreate) {
      requestHistory();
    }
    if (_scrollController.position.pixels > 0 &&
        showScrollDownButton == false) {
      setState(() => showScrollDownButton = true);
    } else if (_scrollController.position.pixels == 0 &&
        showScrollDownButton == true) {
      setState(() => showScrollDownButton = false);
    }
  }

  @override
  void initState() {
    _scrollController.addListener(_updateScrollController);
    super.initState();
  }

  void updateView() {
    if (!mounted) return;

    var seenByText = '';
    if (timeline.events.isNotEmpty) {
      var lastReceipts = List.from(timeline.events.first.receipts);
      lastReceipts.removeWhere((r) =>
          r.user.id == room.client.userID ||
          r.user.id == timeline.events.first.senderId);
      if (lastReceipts.length == 1) {
        seenByText = L10n.of(context)
            .seenByUser(lastReceipts.first.user.calcDisplayname());
      } else if (lastReceipts.length == 2) {
        seenByText = seenByText = L10n.of(context).seenByUserAndUser(
            lastReceipts.first.user.calcDisplayname(),
            lastReceipts[1].user.calcDisplayname());
      } else if (lastReceipts.length > 2) {
        seenByText = L10n.of(context).seenByUserAndCountOthers(
            lastReceipts.first.user.calcDisplayname(),
            (lastReceipts.length - 1).toString());
      }
    }
    if (timeline != null) {
      setState(() {
        this.seenByText = seenByText;
      });
    }
  }

  Future<bool> getTimeline(BuildContext context) async {
    if (timeline == null) {
      timeline = await room.getTimeline(onUpdate: updateView);
      if (timeline.events.isNotEmpty) {
        unawaited(room.sendReadReceipt(timeline.events.first.eventId));
      }

      // when the scroll controller is attached we want to scroll to an event id, if specified
      // and update the scroll controller...which will trigger a request history, if the
      // "load more" button is visible on the screen
      SchedulerBinding.instance.addPostFrameCallback((_) async {
        if (widget.scrollToEventId != null) {
          _scrollToEventId(widget.scrollToEventId, context: context);
        }
        _updateScrollController();
      });
    }
    updateView();
    return true;
  }

  @override
  void dispose() {
    timeline?.cancelSubscriptions();
    timeline = null;
    matrix.activeRoomId = '';
    super.dispose();
  }

  TextEditingController sendController = TextEditingController();

  void send() {
    if (sendController.text.isEmpty) return;
    room.sendTextEvent(sendController.text,
        inReplyTo: replyEvent, editEventId: editEvent?.eventId);
    sendController.text = pendingText;

    setState(() {
      inputText = pendingText;
      replyEvent = null;
      editEvent = null;
      pendingText = '';
    });
  }

  void sendFileAction(BuildContext context) async {
    final result =
        await FilePickerCross.importFromStorage(type: FileTypeCross.any);
    if (result == null) return;
    await showDialog(
      context: context,
      builder: (context) => SendFileDialog(
        file: MatrixFile(
          bytes: result.toUint8List(),
          name: result.fileName,
        ).detectFileType,
        room: room,
      ),
    );
  }

  void sendImageAction(BuildContext context) async {
    final result =
        await FilePickerCross.importFromStorage(type: FileTypeCross.image);
    if (result == null) return;
    await showDialog(
      context: context,
      builder: (context) => SendFileDialog(
        file: MatrixImageFile(
          bytes: result.toUint8List(),
          name: result.fileName,
        ),
        room: room,
      ),
    );
  }

  void openCameraAction(BuildContext context) async {
    var file = await ImagePicker().getImage(source: ImageSource.camera);
    if (file == null) return;
    final bytes = await file.readAsBytes();
    await showDialog(
      context: context,
      builder: (context) => SendFileDialog(
        file: MatrixImageFile(
          bytes: bytes,
          name: file.path,
        ),
        room: room,
      ),
    );
  }

  void voiceMessageAction(BuildContext context) async {
    String result;
    await showDialog(
        context: context,
        builder: (context) => RecordingDialog(
              onFinished: (r) => result = r,
            ));
    if (result == null) return;
    final audioFile = File(result);
    // as we already explicitly say send in the recording dialog,
    // we do not need the send file dialog anymore. We can just send this straight away.
    await SimpleDialogs(context).tryRequestWithLoadingDialog(
      room.sendFileEvent(
        MatrixAudioFile(
            bytes: audioFile.readAsBytesSync(), name: audioFile.path),
      ),
    );
  }

  String _getSelectedEventString(BuildContext context) {
    var copyString = '';
    if (selectedEvents.length == 1) {
      return selectedEvents.first
          .getLocalizedBody(MatrixLocals(L10n.of(context)));
    }
    for (var event in selectedEvents) {
      if (copyString.isNotEmpty) copyString += '\n\n';
      copyString += event.getLocalizedBody(MatrixLocals(L10n.of(context)),
          withSenderNamePrefix: true);
    }
    return copyString;
  }

  void copyEventsAction(BuildContext context) {
    Clipboard.setData(ClipboardData(text: _getSelectedEventString(context)));
    setState(() => selectedEvents.clear());
  }

  void redactEventsAction(BuildContext context) async {
    var confirmed = await SimpleDialogs(context).askConfirmation(
      titleText: L10n.of(context).messageWillBeRemovedWarning,
      confirmText: L10n.of(context).remove,
    );
    if (!confirmed) return;
    for (var event in selectedEvents) {
      await SimpleDialogs(context).tryRequestWithLoadingDialog(
          event.status > 0 ? event.redact() : event.remove());
    }
    setState(() => selectedEvents.clear());
  }

  bool get canRedactSelectedEvents {
    for (var event in selectedEvents) {
      if (event.canRedact == false) return false;
    }
    return true;
  }

  void forwardEventsAction(BuildContext context, {Event event}) async {
    if (event != null) {
      Matrix.of(context).shareContent = event.content;
    } else if (selectedEvents.length == 1) {
      Matrix.of(context).shareContent = selectedEvents.first.content;
    } else {
      Matrix.of(context).shareContent = {
        'msgtype': 'm.text',
        'body': _getSelectedEventString(context),
      };
    }
    setState(() => selectedEvents.clear());
    Navigator.of(context).popUntil((r) => r.isFirst);
  }

  void sendAgainAction(Timeline timeline) {
    final event = selectedEvents.first;
    if (event.status == -1) {
      event.sendAgain();
    }
    final allEditEvents = event
        .aggregatedEvents(timeline, RelationshipTypes.Edit)
        .where((e) => e.status == -1);
    for (final e in allEditEvents) {
      e.sendAgain();
    }
    setState(() => selectedEvents.clear());
  }

  void replyAction({Event replyTo}) {
    setState(() {
      replyEvent = replyTo ?? selectedEvents.first;
      selectedEvents.clear();
    });
    inputFocus.requestFocus();
  }

  void editAction(Event event) {
    setState(() {
      pendingText = sendController.text;
      editEvent = event;
      inputText = sendController.text = editEvent
          .getDisplayEvent(timeline)
          .getLocalizedBody(MatrixLocals(L10n.of(context)),
              withSenderNamePrefix: false, hideReply: true);
      selectedEvents.clear();
    });
    inputFocus.requestFocus();
  }

  void _scrollToEventId(String eventId, {BuildContext context}) async {
    var eventIndex =
        getFilteredEvents().indexWhere((e) => e.eventId == eventId);
    if (eventIndex == -1) {
      // event id not found...maybe we can fetch it?
      // the try...finally is here to start and close the loading dialog reliably
      try {
        if (context != null) {
          SimpleDialogs(context).showLoadingDialog(context);
        }
        // okay, we first have to fetch if the event is in the room
        try {
          final event = await timeline.getEventById(eventId);
          if (event == null) {
            // event is null...meaning something is off
            return;
          }
        } catch (err) {
          if (err is MatrixException && err.errcode == 'M_NOT_FOUND') {
            // event wasn't found, as the server gave a 404 or something
            return;
          }
          rethrow;
        }
        // okay, we know that the event *is* in the room
        while (eventIndex == -1) {
          if (!_canLoadMore) {
            // we can't load any more events but still haven't found ours yet...better stop here
            return;
          }
          try {
            await timeline.requestHistory(historyCount: _loadHistoryCount);
          } catch (err) {
            if (err is TimeoutException) {
              // loading the history timed out...so let's do nothing
              return;
            }
            rethrow;
          }
          eventIndex =
              getFilteredEvents().indexWhere((e) => e.eventId == eventId);
        }
      } finally {
        if (context != null) {
          Navigator.of(context)?.pop();
        }
      }
    }
    await _scrollController.scrollToIndex(eventIndex,
        preferPosition: AutoScrollPosition.middle);
    _updateScrollController();
  }

  List<Event> getFilteredEvents() => timeline.events
      .where((e) =>
          ![RelationshipTypes.Edit, RelationshipTypes.Reaction]
              .contains(e.relationshipType) &&
          e.type != 'm.reaction')
      .toList();

  SwipeDirection _getSwipeDirection(Event event) {
    var swipeToEndAction = Matrix.of(context).swipeToEndAction;
    var swipeToStartAction = Matrix.of(context).swipeToStartAction;
    var client = Matrix.of(context).client;
    if (event.senderId != client.userID && swipeToEndAction == 'edit') {
      swipeToEndAction = null;
    }
    if (event.senderId != client.userID && swipeToStartAction == 'edit') {
      swipeToStartAction = null;
    }
    if (swipeToEndAction != null && swipeToStartAction != null) {
      return SwipeDirection.horizontal;
    }
    if (swipeToEndAction != null) {
      return SwipeDirection.startToEnd;
    }
    if (swipeToStartAction != null) {
      return SwipeDirection.endToStart;
    }
    return null;
  }

  Widget _getSwipeBackground(Event event, {bool isSecondary = false}) {
    var alignToRight, action;
    if (_getSwipeDirection(event) == SwipeDirection.horizontal) {
      if (isSecondary) {
        alignToRight = true;
        action = Matrix.of(context).swipeToStartAction;
      } else {
        alignToRight = false;
        action = Matrix.of(context).swipeToEndAction;
      }
    } else if (isSecondary) {
      return null;
    } else if (_getSwipeDirection(event) == SwipeDirection.endToStart) {
      alignToRight = true;
      action = Matrix.of(context).swipeToStartAction;
    } else {
      alignToRight = false;
      action = Matrix.of(context).swipeToStartAction;
    }

    switch (action) {
      case 'reply':
        return Container(
          color: Theme.of(context).primaryColor.withAlpha(100),
          padding: EdgeInsets.symmetric(horizontal: 12.0),
          child: Row(
            mainAxisAlignment:
                alignToRight ? MainAxisAlignment.end : MainAxisAlignment.start,
            children: [
              Icon(Icons.reply_outlined),
              SizedBox(width: 2.0),
              Text(L10n.of(context).reply)
            ],
          ),
        );
      case 'forward':
        return Container(
          color: Theme.of(context).primaryColor.withAlpha(100),
          padding: EdgeInsets.symmetric(horizontal: 12.0),
          child: Row(
            mainAxisAlignment:
                alignToRight ? MainAxisAlignment.end : MainAxisAlignment.start,
            children: [
              Icon(Icons.forward_outlined),
              SizedBox(width: 2.0),
              Text(L10n.of(context).forward)
            ],
          ),
        );
      case 'edit':
        return Container(
          color: Theme.of(context).primaryColor.withAlpha(100),
          padding: EdgeInsets.symmetric(horizontal: 12.0),
          child: Row(
            mainAxisAlignment:
                alignToRight ? MainAxisAlignment.end : MainAxisAlignment.start,
            children: [
              Icon(Icons.edit_outlined),
              SizedBox(width: 2.0),
              Text(L10n.of(context).edit)
            ],
          ),
        );
      default:
        return Container(
          color: Theme.of(context).primaryColor.withAlpha(100),
        );
    }
  }

  void _handleSwipe(SwipeDirection direction, Event event) {
    var action;
    if (direction == SwipeDirection.endToStart) {
      action = Matrix.of(context).swipeToStartAction;
    } else {
      action = Matrix.of(context).swipeToEndAction;
    }

    switch (action) {
      case 'reply':
        replyAction(replyTo: event);
        break;
      case 'forward':
        forwardEventsAction(context, event: event);
        break;
      case 'edit':
        editAction(event);
        break;
      default:
    }
  }

  @override
  Widget build(BuildContext context) {
    matrix = Matrix.of(context);
    var client = matrix.client;
    room ??= client.getRoomById(widget.id);
    if (room == null) {
      return Scaffold(
        appBar: AppBar(
          title: Text(L10n.of(context).oopsSomethingWentWrong),
        ),
        body: Center(
          child: Text(L10n.of(context).youAreNoLongerParticipatingInThisChat),
        ),
      );
    }
    matrix.activeRoomId = widget.id;

    if (room.membership == Membership.invite) {
      SimpleDialogs(context).tryRequestWithLoadingDialog(room.join());
    }

    var typingText = '';
    var typingUsers = room.typingUsers;
    typingUsers.removeWhere((User u) => u.id == client.userID);

    if (typingUsers.length == 1) {
      typingText = L10n.of(context).isTyping;
      if (typingUsers.first.id != room.directChatMatrixID) {
        typingText =
            L10n.of(context).userIsTyping(typingUsers.first.calcDisplayname());
      }
    } else if (typingUsers.length == 2) {
      typingText = L10n.of(context).userAndUserAreTyping(
          typingUsers.first.calcDisplayname(),
          typingUsers[1].calcDisplayname());
    } else if (typingUsers.length > 2) {
      typingText = L10n.of(context).userAndOthersAreTyping(
          typingUsers.first.calcDisplayname(),
          (typingUsers.length - 1).toString());
    }

    return Scaffold(
      appBar: AppBar(
        leading: selectMode
            ? IconButton(
                icon: Icon(Icons.close),
                onPressed: () => setState(() => selectedEvents.clear()),
              )
            : null,
        titleSpacing: 0,
        title: selectedEvents.isEmpty
            ? StreamBuilder<Object>(
                stream: Matrix.of(context)
                    .client
                    .onPresence
                    .stream
                    .where((p) => p.senderId == room.directChatMatrixID),
                builder: (context, snapshot) {
                  return ListTile(
                    leading: Avatar(room.avatar, room.displayname),
                    contentPadding: EdgeInsets.zero,
                    onTap: room.isDirectChat
                        ? () => showModalBottomSheet(
                              context: context,
                              builder: (context) => UserBottomSheet(
                                user: room
                                    .getUserByMXIDSync(room.directChatMatrixID),
                                onMention: () => sendController.text +=
                                    ' ${room.directChatMatrixID}',
                              ),
                            )
                        : () => Navigator.of(context).push(
                              AppRoute.defaultRoute(
                                context,
                                ChatDetails(room),
                              ),
                            ),
                    title: Text(
                        room.getLocalizedDisplayname(
                            MatrixLocals(L10n.of(context))),
                        maxLines: 1),
                    subtitle: typingText.isEmpty
                        ? Text(
                            room.getLocalizedStatus(context),
                            maxLines: 1,
                          )
                        : Row(
                            children: <Widget>[
                              Icon(Icons.edit,
                                  color: Theme.of(context).primaryColor,
                                  size: 13),
                              SizedBox(width: 4),
                              Text(
                                typingText,
                                maxLines: 1,
                                style: TextStyle(
                                  color: Theme.of(context).primaryColor,
                                  fontStyle: FontStyle.italic,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                  );
                })
            : Text(L10n.of(context)
                .numberSelected(selectedEvents.length.toString())),
        actions: selectMode
            ? <Widget>[
                if (selectedEvents.length == 1 &&
                    selectedEvents.first.status > 0 &&
                    selectedEvents.first.senderId == client.userID)
                  IconButton(
                    icon: Icon(Icons.edit),
                    onPressed: () => editAction(selectedEvents.first),
                  ),
                IconButton(
                  icon: Icon(Icons.content_copy),
                  onPressed: () => copyEventsAction(context),
                ),
                if (canRedactSelectedEvents)
                  IconButton(
                    icon: Icon(Icons.delete),
                    onPressed: () => redactEventsAction(context),
                  ),
              ]
            : <Widget>[ChatSettingsPopupMenu(room, !room.isDirectChat)],
      ),
      floatingActionButton: showScrollDownButton
          ? Padding(
              padding: const EdgeInsets.only(bottom: 56.0),
              child: FloatingActionButton(
                child: Icon(Icons.arrow_downward,
                    color: Theme.of(context).primaryColor),
                onPressed: () => _scrollController.jumpTo(0),
                foregroundColor: Theme.of(context).textTheme.bodyText2.color,
                backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                mini: true,
              ),
            )
          : null,
      body: Stack(
        children: <Widget>[
          if (Matrix.of(context).wallpaper != null)
            Image.file(
              Matrix.of(context).wallpaper,
              height: double.infinity,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          Column(
            children: <Widget>[
              ConnectionStatusHeader(),
              Expanded(
                child: FutureBuilder<bool>(
                  future: getTimeline(context),
                  builder: (BuildContext context, snapshot) {
                    if (!snapshot.hasData) {
                      return Center(
                        child: CircularProgressIndicator(),
                      );
                    }

                    if (room.notificationCount != null &&
                        room.notificationCount > 0 &&
                        timeline != null &&
                        timeline.events.isNotEmpty &&
                        Matrix.of(context).webHasFocus) {
                      room.sendReadReceipt(timeline.events.first.eventId);
                    }

                    final filteredEvents = getFilteredEvents();

                    return ListView.builder(
                        padding: EdgeInsets.symmetric(
                          horizontal: max(
                              0,
                              (MediaQuery.of(context).size.width -
                                      AdaptivePageLayout.defaultMinWidth *
                                          3.5) /
                                  2),
                        ),
                        reverse: true,
                        itemCount: filteredEvents.length + 2,
                        controller: _scrollController,
                        itemBuilder: (BuildContext context, int i) {
                          return i == filteredEvents.length + 1
                              ? _loadingHistory
                                  ? Container(
                                      height: 50,
                                      alignment: Alignment.center,
                                      padding: EdgeInsets.all(8),
                                      child: CircularProgressIndicator(),
                                    )
                                  : _canLoadMore
                                      ? FlatButton(
                                          child: Text(
                                            L10n.of(context).loadMore,
                                            style: TextStyle(
                                              color: Theme.of(context)
                                                  .primaryColor,
                                              fontWeight: FontWeight.bold,
                                              decoration:
                                                  TextDecoration.underline,
                                            ),
                                          ),
                                          onPressed: requestHistory,
                                        )
                                      : Container()
                              : i == 0
                                  ? AnimatedContainer(
                                      height: seenByText.isEmpty ? 0 : 24,
                                      duration: seenByText.isEmpty
                                          ? Duration(milliseconds: 0)
                                          : Duration(milliseconds: 300),
                                      alignment:
                                          filteredEvents.first.senderId ==
                                                  client.userID
                                              ? Alignment.topRight
                                              : Alignment.topLeft,
                                      child: Container(
                                        padding:
                                            EdgeInsets.symmetric(horizontal: 4),
                                        decoration: BoxDecoration(
                                          color: Theme.of(context)
                                              .scaffoldBackgroundColor
                                              .withOpacity(0.8),
                                          borderRadius:
                                              BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          seenByText,
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            color:
                                                Theme.of(context).primaryColor,
                                          ),
                                        ),
                                      ),
                                      padding: EdgeInsets.only(
                                        left: 8,
                                        right: 8,
                                        bottom: 8,
                                      ),
                                    )
                                  : AutoScrollTag(
                                      key: ValueKey(i - 1),
                                      index: i - 1,
                                      controller: _scrollController,
                                      child: Swipeable(
                                        key: ValueKey(
                                            filteredEvents[i - 1].eventId),
                                        background: _getSwipeBackground(
                                            filteredEvents[i - 1]),
                                        secondaryBackground:
                                            _getSwipeBackground(
                                                filteredEvents[i - 1],
                                                isSecondary: true),
                                        direction: _getSwipeDirection(
                                            filteredEvents[i - 1]),
                                        onSwipe: (direction) => _handleSwipe(
                                            direction, filteredEvents[i - 1]),
                                        child: Message(filteredEvents[i - 1],
                                            onAvatarTab: (Event event) =>
                                                showModalBottomSheet(
                                                  context: context,
                                                  builder: (context) =>
                                                      UserBottomSheet(
                                                    user: event.sender,
                                                    onMention: () =>
                                                        sendController.text +=
                                                            ' ${event.senderId}',
                                                  ),
                                                ),
                                            onSelect: (Event event) {
                                              if (!event.redacted) {
                                                if (selectedEvents
                                                    .contains(event)) {
                                                  setState(
                                                    () => selectedEvents
                                                        .remove(event),
                                                  );
                                                } else {
                                                  setState(
                                                    () => selectedEvents
                                                        .add(event),
                                                  );
                                                }
                                                selectedEvents.sort(
                                                  (a, b) => a.originServerTs
                                                      .compareTo(
                                                          b.originServerTs),
                                                );
                                              }
                                            },
                                            scrollToEventId: (String eventId) =>
                                                _scrollToEventId(eventId,
                                                    context: context),
                                            longPressSelect:
                                                selectedEvents.isEmpty,
                                            selected: selectedEvents.contains(
                                                filteredEvents[i - 1]),
                                            timeline: timeline,
                                            nextEvent: i >= 2
                                                ? filteredEvents[i - 2]
                                                : null),
                                      ),
                                    );
                        });
                  },
                ),
              ),
              AnimatedContainer(
                duration: Duration(milliseconds: 300),
                height: (editEvent == null &&
                        replyEvent == null &&
                        selectedEvents.length == 1)
                    ? 56
                    : 0,
                child: Material(
                  color: Theme.of(context).secondaryHeaderColor,
                  child: Builder(builder: (context) {
                    if (!(editEvent == null &&
                        replyEvent == null &&
                        selectedEvents.length == 1)) {
                      return Container();
                    }
                    var emojis = List<String>.from(AppEmojis.emojis);
                    final allReactionEvents = selectedEvents.first
                        .aggregatedEvents(timeline, RelationshipTypes.Reaction)
                        ?.where((event) =>
                            event.senderId == event.room.client.userID &&
                            event.type == 'm.reaction');

                    allReactionEvents.forEach((event) {
                      try {
                        emojis.remove(event.content['m.relates_to']['key']);
                      } catch (_) {}
                    });
                    return ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: emojis.length,
                      itemBuilder: (c, i) => InkWell(
                        borderRadius: BorderRadius.circular(8),
                        onTap: () {
                          SimpleDialogs(context).tryRequestWithLoadingDialog(
                            room.sendReaction(
                              selectedEvents.first.eventId,
                              emojis[i],
                            ),
                          );
                          setState(() => selectedEvents.clear());
                        },
                        child: Container(
                          width: 56,
                          height: 56,
                          alignment: Alignment.center,
                          child: Text(
                            emojis[i],
                            style: TextStyle(fontSize: 30),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
              AnimatedContainer(
                duration: Duration(milliseconds: 300),
                height: editEvent != null || replyEvent != null ? 56 : 0,
                child: Material(
                  color: Theme.of(context).secondaryHeaderColor,
                  child: Row(
                    children: <Widget>[
                      IconButton(
                        icon: Icon(Icons.close),
                        onPressed: () => setState(() {
                          if (editEvent != null) {
                            inputText = sendController.text = pendingText;
                            pendingText = '';
                          }
                          replyEvent = null;
                          editEvent = null;
                        }),
                      ),
                      Expanded(
                        child: replyEvent != null
                            ? ReplyContent(replyEvent, timeline: timeline)
                            : _EditContent(
                                editEvent?.getDisplayEvent(timeline)),
                      ),
                    ],
                  ),
                ),
              ),
              Divider(
                height: 1,
                color: Theme.of(context).secondaryHeaderColor,
                thickness: 1,
              ),
              room.canSendDefaultMessages && room.membership == Membership.join
                  ? Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).backgroundColor,
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: selectMode
                            ? <Widget>[
                                Container(
                                  height: 56,
                                  child: FlatButton(
                                    onPressed: () =>
                                        forwardEventsAction(context),
                                    child: Row(
                                      children: <Widget>[
                                        Icon(Icons.keyboard_arrow_left),
                                        Text(L10n.of(context).forward),
                                      ],
                                    ),
                                  ),
                                ),
                                selectedEvents.length == 1
                                    ? selectedEvents.first
                                                .getDisplayEvent(timeline)
                                                .status >
                                            0
                                        ? Container(
                                            height: 56,
                                            child: FlatButton(
                                              onPressed: () => replyAction(),
                                              child: Row(
                                                children: <Widget>[
                                                  Text(L10n.of(context).reply),
                                                  Icon(Icons
                                                      .keyboard_arrow_right),
                                                ],
                                              ),
                                            ),
                                          )
                                        : Container(
                                            height: 56,
                                            child: FlatButton(
                                              onPressed: () =>
                                                  sendAgainAction(timeline),
                                              child: Row(
                                                children: <Widget>[
                                                  Text(L10n.of(context)
                                                      .tryToSendAgain),
                                                  SizedBox(width: 4),
                                                  Icon(Icons.send, size: 16),
                                                ],
                                              ),
                                            ),
                                          )
                                    : Container(),
                              ]
                            : <Widget>[
                                if (inputText.isEmpty)
                                  Container(
                                    height: 56,
                                    alignment: Alignment.center,
                                    child: PopupMenuButton<String>(
                                      icon: Icon(Icons.add),
                                      onSelected: (String choice) async {
                                        if (choice == 'file') {
                                          sendFileAction(context);
                                        } else if (choice == 'image') {
                                          sendImageAction(context);
                                        }
                                        if (choice == 'camera') {
                                          openCameraAction(context);
                                        }
                                        if (choice == 'voice') {
                                          voiceMessageAction(context);
                                        }
                                      },
                                      itemBuilder: (BuildContext context) =>
                                          <PopupMenuEntry<String>>[
                                        PopupMenuItem<String>(
                                          value: 'file',
                                          child: ListTile(
                                            leading: CircleAvatar(
                                              backgroundColor: Colors.green,
                                              foregroundColor: Colors.white,
                                              child: Icon(Icons.attachment),
                                            ),
                                            title:
                                                Text(L10n.of(context).sendFile),
                                            contentPadding: EdgeInsets.all(0),
                                          ),
                                        ),
                                        PopupMenuItem<String>(
                                          value: 'image',
                                          child: ListTile(
                                            leading: CircleAvatar(
                                              backgroundColor: Colors.blue,
                                              foregroundColor: Colors.white,
                                              child: Icon(Icons.image),
                                            ),
                                            title: Text(
                                                L10n.of(context).sendImage),
                                            contentPadding: EdgeInsets.all(0),
                                          ),
                                        ),
                                        if (PlatformInfos.isMobile)
                                          PopupMenuItem<String>(
                                            value: 'camera',
                                            child: ListTile(
                                              leading: CircleAvatar(
                                                backgroundColor: Colors.purple,
                                                foregroundColor: Colors.white,
                                                child: Icon(Icons.camera_alt),
                                              ),
                                              title: Text(
                                                  L10n.of(context).openCamera),
                                              contentPadding: EdgeInsets.all(0),
                                            ),
                                          ),
                                        if (PlatformInfos.isMobile)
                                          PopupMenuItem<String>(
                                            value: 'voice',
                                            child: ListTile(
                                              leading: CircleAvatar(
                                                backgroundColor: Colors.red,
                                                foregroundColor: Colors.white,
                                                child: Icon(Icons.mic),
                                              ),
                                              title: Text(L10n.of(context)
                                                  .voiceMessage),
                                              contentPadding: EdgeInsets.all(0),
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                Container(
                                  height: 56,
                                  alignment: Alignment.center,
                                  child: EncryptionButton(room),
                                ),
                                Expanded(
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 4.0),
                                    child: InputBar(
                                      room: room,
                                      minLines: 1,
                                      maxLines: kIsWeb ? 1 : 8,
                                      autofocus: !PlatformInfos.isMobile,
                                      keyboardType: !PlatformInfos.isMobile
                                          ? TextInputType.text
                                          : TextInputType.multiline,
                                      onSubmitted: (String text) {
                                        send();
                                        FocusScope.of(context)
                                            .requestFocus(inputFocus);
                                      },
                                      focusNode: inputFocus,
                                      controller: sendController,
                                      decoration: InputDecoration(
                                        hintText:
                                            L10n.of(context).writeAMessage,
                                        hintMaxLines: 1,
                                        border: InputBorder.none,
                                      ),
                                      onChanged: (String text) {
                                        typingCoolDown?.cancel();
                                        typingCoolDown =
                                            Timer(Duration(seconds: 2), () {
                                          typingCoolDown = null;
                                          currentlyTyping = false;
                                          room.sendTypingInfo(false);
                                        });
                                        typingTimeout ??=
                                            Timer(Duration(seconds: 30), () {
                                          typingTimeout = null;
                                          currentlyTyping = false;
                                        });
                                        if (!currentlyTyping) {
                                          currentlyTyping = true;
                                          room.sendTypingInfo(true,
                                              timeout: Duration(seconds: 30)
                                                  .inMilliseconds);
                                        }
                                        // Workaround for a current desktop bug
                                        if (!PlatformInfos.isBetaDesktop) {
                                          setState(() => inputText = text);
                                        }
                                      },
                                    ),
                                  ),
                                ),
                                if (PlatformInfos.isMobile && inputText.isEmpty)
                                  Container(
                                    height: 56,
                                    alignment: Alignment.center,
                                    child: IconButton(
                                      icon: Icon(Icons.mic),
                                      onPressed: () =>
                                          voiceMessageAction(context),
                                    ),
                                  ),
                                if (!PlatformInfos.isMobile ||
                                    inputText.isNotEmpty)
                                  Container(
                                    height: 56,
                                    alignment: Alignment.center,
                                    child: IconButton(
                                      icon: Icon(Icons.send),
                                      onPressed: () => send(),
                                    ),
                                  ),
                              ],
                      ),
                    )
                  : Container(),
            ],
          ),
        ],
      ),
    );
  }
}

class _EditContent extends StatelessWidget {
  final Event event;

  _EditContent(this.event);

  @override
  Widget build(BuildContext context) {
    if (event == null) {
      return Container();
    }
    return Row(
      children: <Widget>[
        Icon(
          Icons.edit,
          color: Theme.of(context).primaryColor,
        ),
        Container(width: 15.0),
        Text(
          event?.getLocalizedBody(
                MatrixLocals(L10n.of(context)),
                withSenderNamePrefix: false,
                hideReply: true,
              ) ??
              '',
          overflow: TextOverflow.ellipsis,
          maxLines: 1,
          style: TextStyle(
            color: Theme.of(context).textTheme.bodyText2.color,
          ),
        ),
      ],
    );
  }
}
