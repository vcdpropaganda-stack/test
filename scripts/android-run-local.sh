#!/bin/sh

set -eu

if [ -z "${JAVA_HOME:-}" ] && [ -d "/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]; then
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
fi

if [ -z "${ANDROID_HOME:-}" ] && [ -d "$HOME/Library/Android/sdk" ]; then
  export ANDROID_HOME="$HOME/Library/Android/sdk"
fi

if [ -z "${ANDROID_SDK_ROOT:-}" ] && [ -n "${ANDROID_HOME:-}" ]; then
  export ANDROID_SDK_ROOT="$ANDROID_HOME"
fi

export CAPACITOR_SERVER_URL="${CAPACITOR_SERVER_URL:-http://10.0.2.2:3000}"

target="${ANDROID_TARGET:-}"
app_id="br.com.vlservice.app"
main_activity=".MainActivity"
adb_bin="${ANDROID_HOME:-}/platform-tools/adb"

if [ -z "$target" ]; then
  if [ -x "$adb_bin" ]; then
    target="$("$adb_bin" devices | awk 'NR > 1 && $2 == "device" { print $1; exit }')"
  fi
fi

if [ -z "$target" ] || [ ! -x "$adb_bin" ]; then
  echo "Nenhum dispositivo Android disponivel via adb."
  exit 1
fi

"$adb_bin" -s "$target" wait-for-device

while [ "$("$adb_bin" -s "$target" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do
  sleep 2
done

npx cap sync android

(
  cd android
  ./gradlew :app:installDebug --console=plain
)

"$adb_bin" -s "$target" shell am start -n "$app_id/$main_activity"
