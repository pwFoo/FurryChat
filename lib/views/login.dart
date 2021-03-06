import 'dart:async';
import 'dart:math';

import 'package:famedlysdk/famedlysdk.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/l10n.dart';

import '../components/dialogs/simple_dialogs.dart';
import '../components/matrix.dart';
import '../utils/app_route.dart';
import '../utils/firebase_controller.dart';
import 'chat_list.dart';

class Login extends StatefulWidget {
  Login({Key key, this.username, this.wellknown}) : super(key: key);

  final String username;
  final WellKnownInformations wellknown;

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  String usernameError;
  String passwordError;
  bool loading = false;
  bool showPassword = false;
  WellKnownInformations newWellknown;

  void login(BuildContext context) async {
    var matrix = Matrix.of(context);
    if (usernameController.text.isEmpty) {
      setState(() => usernameError = L10n.of(context).pleaseEnterYourUsername);
    } else {
      setState(() => usernameError = null);
    }
    if (passwordController.text.isEmpty) {
      setState(() => passwordError = L10n.of(context).pleaseEnterYourPassword);
    } else {
      setState(() => passwordError = null);
    }

    if (usernameController.text.isEmpty || passwordController.text.isEmpty) {
      return;
    }

    setState(() => loading = true);
    try {
      await matrix.client.login(
          user: usernameController.text,
          password: passwordController.text,
          initialDeviceDisplayName: matrix.widget.clientName);
    } on MatrixException catch (exception) {
      setState(() => passwordError = exception.errorMessage);
      return setState(() => loading = false);
    } catch (exception) {
      setState(() => passwordError = exception.toString());
      return setState(() => loading = false);
    }
    if (!kIsWeb) {
      try {
        await FirebaseController.setupFirebase(
          matrix,
          matrix.widget.clientName,
        );
      } catch (exception) {
        await matrix.client.logout();
        matrix.clean();
        setState(() => passwordError = exception.toString());
        return setState(() => loading = false);
      }
    }
    setState(() => loading = false);
    if (newWellknown != null) {
      if (newWellknown.jitsiHomeserver?.baseUrl != null) {
        if (!newWellknown.jitsiHomeserver.baseUrl.startsWith('https://')) {
          newWellknown.jitsiHomeserver.baseUrl =
              'https://${newWellknown.jitsiHomeserver.baseUrl}';
        }
        await Matrix.of(context).store.setItem('chat.fluffy.jitsi_instance',
            'https://${Uri.parse(newWellknown.jitsiHomeserver.baseUrl).host}/');
        Matrix.of(context).jitsiInstance =
            'https://${Uri.parse(newWellknown.jitsiHomeserver.baseUrl).host}/';
      }
    } else if (widget.wellknown != null) {
      if (widget.wellknown.jitsiHomeserver?.baseUrl != null) {
        if (!widget.wellknown.jitsiHomeserver.baseUrl.startsWith('https://')) {
          widget.wellknown.jitsiHomeserver.baseUrl =
              'https://${widget.wellknown.jitsiHomeserver.baseUrl}';
        }
        await Matrix.of(context).store.setItem('chat.fluffy.jitsi_instance',
            'https://${Uri.parse(widget.wellknown.jitsiHomeserver.baseUrl).host}/');
        Matrix.of(context).jitsiInstance =
            'https://${Uri.parse(widget.wellknown.jitsiHomeserver.baseUrl).host}/';
      }
    }
    await Navigator.of(context).pushAndRemoveUntil(
        AppRoute.defaultRoute(context, ChatListView()), (r) => false);
  }

  Timer _coolDown;

  void _checkWellKnownWithCoolDown(String userId, BuildContext context) async {
    _coolDown?.cancel();
    _coolDown = Timer(
      Duration(seconds: 1),
      () => _checkWellKnown(userId, context),
    );
  }

  void _checkWellKnown(String userId, BuildContext context) async {
    setState(() => usernameError = null);
    if (!userId.isValidMatrixId) return;
    try {
      final wellKnownInformations = await Matrix.of(context)
          .client
          .getWellKnownInformationsByUserId(userId);
      final newDomain = wellKnownInformations.mHomeserver?.baseUrl;
      if ((newDomain?.isNotEmpty ?? false) &&
          newDomain != Matrix.of(context).client.homeserver.toString()) {
        await SimpleDialogs(context).tryRequestWithErrorToast(
            Matrix.of(context).client.checkHomeserver(newDomain));
        setState(() => usernameError = null);
      }
      newWellknown = wellKnownInformations;
    } catch (e) {
      setState(() => usernameError = e.toString());
      newWellknown = null;
    }
  }

  @override
  void initState() {
    super.initState();
    usernameController.text = widget?.username;
  }

  @override
  void dispose() {
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: loading ? Container() : null,
        elevation: 0,
        title: Text(
          L10n.of(context).logInTo(Matrix.of(context)
              .client
              .homeserver
              .toString()
              .replaceFirst('https://', '')),
        ),
      ),
      body: Builder(builder: (context) {
        return ListView(
          padding: EdgeInsets.symmetric(
              horizontal: max((MediaQuery.of(context).size.width - 600) / 2, 0),
              vertical: 8.0),
          children: <Widget>[
            ListTile(
              title: TextField(
                readOnly: loading,
                autocorrect: false,
                autofocus: true,
                onChanged: (t) => _checkWellKnownWithCoolDown(t, context),
                controller: usernameController,
                decoration: InputDecoration(
                  icon: Icon(Icons.person_outline),
                  hintText:
                      '@${L10n.of(context).username.toLowerCase()}:domain',
                  errorText: usernameError,
                  labelText: L10n.of(context).username,
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            SizedBox(
              height: 10,
            ),
            ListTile(
              title: TextField(
                readOnly: loading,
                autocorrect: false,
                autofocus: widget.username != null ? true : false,
                controller: passwordController,
                obscureText: !showPassword,
                onSubmitted: (t) => login(context),
                decoration: InputDecoration(
                  icon: Icon(Icons.lock_outline),
                  hintText: '****',
                  errorText: passwordError,
                  suffixIcon: IconButton(
                    icon: Icon(
                        showPassword ? Icons.visibility_off : Icons.visibility),
                    onPressed: () =>
                        setState(() => showPassword = !showPassword),
                  ),
                  labelText: L10n.of(context).password,
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            SizedBox(height: 20),
            Hero(
              tag: 'loginButton',
              child: Container(
                height: 50,
                padding: EdgeInsets.symmetric(horizontal: 12),
                child: RaisedButton(
                  elevation: 7,
                  color: Theme.of(context).primaryColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: loading
                      ? CircularProgressIndicator()
                      : Text(
                          L10n.of(context).login.toUpperCase(),
                          style: TextStyle(color: Colors.white, fontSize: 16),
                        ),
                  onPressed: loading ? null : () => login(context),
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
