# QuietPay compile notes
Use compact 0.31.0 or later inside WSL Ubuntu.
Start proof server first and keep port 6300 free.
Compile with npm run compact from contracts folder.
If Map errors appear check key disclose on member lookup insert.
If Uint errors appear keep overflow asserts before casts.
If Counter errors appear use increment only in allowed circuits.
Paste full compiler output for fixes before Sep 16.
