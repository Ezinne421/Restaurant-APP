#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"
SDK_ROOT="${ANDROID_SDK_ROOT:-/workspace/.toolchains/android-sdk}"
JAVA_ROOT="${JAVA_HOME:-/workspace/.toolchains/jdk}"
BUILD_TOOLS="$SDK_ROOT/build-tools/35.0.0"
ANDROID_JAR="$SDK_ROOT/platforms/android-35/android.jar"
BUILD_DIR="$ANDROID_DIR/build"
PACKAGE_PATH="com/veejayfoods/app"

for required in "$JAVA_ROOT/bin/javac" "$JAVA_ROOT/bin/keytool" "$ANDROID_JAR" "$BUILD_TOOLS/aapt2" "$BUILD_TOOLS/d8" "$BUILD_TOOLS/apksigner"; do
    if [[ ! -x "$required" && ! -f "$required" ]]; then
        echo "Missing required Android build tool: $required" >&2
        exit 1
    fi
done

rm -rf "$BUILD_DIR" "$ANDROID_DIR/app/src/main/assets"
mkdir -p "$BUILD_DIR/compiled" "$BUILD_DIR/generated" "$BUILD_DIR/classes" "$BUILD_DIR/dex" "$ANDROID_DIR/app/src/main/assets"
cp -a "$PROJECT_DIR/public/." "$ANDROID_DIR/app/src/main/assets/"

"$BUILD_TOOLS/aapt2" compile --dir "$ANDROID_DIR/app/src/main/res" -o "$BUILD_DIR/compiled/resources.zip"
"$BUILD_TOOLS/aapt2" link \
    -I "$ANDROID_JAR" \
    --manifest "$ANDROID_DIR/app/src/main/AndroidManifest.xml" \
    --java "$BUILD_DIR/generated" \
    --min-sdk-version 23 \
    --target-sdk-version 35 \
    --version-code 11 \
    --version-name 2.9.0 \
    -A "$ANDROID_DIR/app/src/main/assets" \
    "$BUILD_DIR/compiled/resources.zip" \
    -o "$BUILD_DIR/unsigned.apk"

find "$ANDROID_DIR/app/src/main/java" "$BUILD_DIR/generated" -name '*.java' -print0 \
    | xargs -0 "$JAVA_ROOT/bin/javac" -source 8 -target 8 -Xlint:-options -classpath "$ANDROID_JAR" -d "$BUILD_DIR/classes"

mapfile -d '' CLASS_FILES < <(find "$BUILD_DIR/classes" -name '*.class' -print0)
"$BUILD_TOOLS/d8" --lib "$ANDROID_JAR" --min-api 23 --output "$BUILD_DIR/dex" "${CLASS_FILES[@]}"
(cd "$BUILD_DIR/dex" && zip -q -u "$BUILD_DIR/unsigned.apk" classes.dex)

KEYSTORE="$ANDROID_DIR/veejay-demo.keystore"
if [[ ! -f "$KEYSTORE" ]]; then
    "$JAVA_ROOT/bin/keytool" -genkeypair -v \
        -keystore "$KEYSTORE" \
        -storepass veejay-demo \
        -keypass veejay-demo \
        -alias veejay-demo \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -dname "CN=Veejay Foods Demo, O=Veejay Foods, C=NG"
fi

"$BUILD_TOOLS/zipalign" -f -p 4 "$BUILD_DIR/unsigned.apk" "$BUILD_DIR/aligned.apk"
"$BUILD_TOOLS/apksigner" sign \
    --ks "$KEYSTORE" \
    --ks-pass pass:veejay-demo \
    --key-pass pass:veejay-demo \
    --out "$BUILD_DIR/Veejay-Foods-Demo.apk" \
    "$BUILD_DIR/aligned.apk"
"$BUILD_TOOLS/apksigner" verify --verbose --print-certs "$BUILD_DIR/Veejay-Foods-Demo.apk"

mkdir -p "$PROJECT_DIR/artifacts"
cp "$BUILD_DIR/Veejay-Foods-Demo.apk" "$PROJECT_DIR/artifacts/Veejay-Foods-Demo.apk"
echo "APK created: $PROJECT_DIR/artifacts/Veejay-Foods-Demo.apk"
