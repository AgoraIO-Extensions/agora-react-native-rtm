#!/bin/bash
set -e
set +x
MY_PATH=$(realpath $(dirname "$0"))
PROJECT_ROOT=$(realpath ${MY_PATH}/..)
ANDROID_BUILD_GRADLE_PATH="${PROJECT_ROOT}/android/build.gradle"
iOS_PODSPEC_PATH="${PROJECT_ROOT}/agora-react-native-rtm.podspec"
EXAMPLE_IOS_PODFILE_PATH="${PROJECT_ROOT}/example/ios/Podfile"
TERRA_CONFIG_PATH1="${PROJECT_ROOT}/scripts/terra/config/types_config.yaml"
TERRA_CONFIG_PATH2="${PROJECT_ROOT}/scripts/terra/config/impl_config.yaml"
if [ "$#" -lt 1 ]; then
    exit 1
fi
INPUT=$1

MAVEN_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "Android") | .maven[]')
IRIS_MAVEN_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "Android") | .iris_maven[]')
DEP_VERSION=$(echo "$INPUT" | jq -r '.[] | select(.platform == "Android") | .version')
COCOAPODS_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "iOS") | .cocoapods[]')
IRIS_COCOAPODS_DEPENDENCIES=$(echo "$INPUT" | jq -r '.[] | select(.platform == "iOS") | .iris_cocoapods[]')

# A Native ZIP is not a Maven/Pods dependency. Reject incomplete input before
# touching either platform, rather than deleting the existing Native dependency.
for PLATFORM in Android iOS; do
  NATIVE_URL=$(echo "$INPUT" | jq -r --arg platform "$PLATFORM" '.[] | select(.platform == $platform) | .cdn[]')
  if [ "$PLATFORM" = Android ]; then
    NATIVE_DEPENDENCIES="$MAVEN_DEPENDENCIES"
    IRIS_DEPENDENCIES="$IRIS_MAVEN_DEPENDENCIES"
  else
    NATIVE_DEPENDENCIES="$COCOAPODS_DEPENDENCIES"
    IRIS_DEPENDENCIES="$IRIS_COCOAPODS_DEPENDENCIES"
  fi
  if { [ -n "$NATIVE_URL" ] || [ -n "$NATIVE_DEPENDENCIES" ] || [ -n "$IRIS_DEPENDENCIES" ]; } &&
     { [ -z "$NATIVE_DEPENDENCIES" ] || [ -z "$IRIS_DEPENDENCIES" ]; }; then
    echo "Both Native and Iris package dependencies are required for $PLATFORM." >&2
    exit 1
  fi
done

# Function to modify dependencies
modify_dependencies() {
  local dependencies="$1"
  local modified_dependencies=""
  while IFS= read -r line; do
    if [[ "$line" == *"agora-rtm"* ]]; then
      modified_dependencies+="${line/implementation/api}"$'\n'
    else
      modified_dependencies+="$line"$'\n'
    fi
  done <<< "$dependencies"
  echo "$modified_dependencies"
}

if [ -z "$MAVEN_DEPENDENCIES" ] && [ -z "$IRIS_MAVEN_DEPENDENCIES" ]; then
  echo "No Android maven dependencies need to change."
else
  ALL_DEPENDENCIES=$(printf "%s\n%s" "$MAVEN_DEPENDENCIES" "$IRIS_MAVEN_DEPENDENCIES" | sed 's/^/  /')
  ALL_DEPENDENCIES=$(modify_dependencies "$ALL_DEPENDENCIES")
  TEMP_FILE=$(mktemp)
  echo "$ALL_DEPENDENCIES" > "$TEMP_FILE"
  sed -i.bak -e '/\/\/\/ dependencies start/,/\/\/\/ dependencies end/{//!d;}' -e "/\/\/\/ dependencies start/r $TEMP_FILE" "$ANDROID_BUILD_GRADLE_PATH"
  rm "${ANDROID_BUILD_GRADLE_PATH}.bak"
  rm "$TEMP_FILE"
  echo "android/build.gradle updated."
fi

if [ -z "$COCOAPODS_DEPENDENCIES" ] && [ -z "$IRIS_COCOAPODS_DEPENDENCIES" ]; then
  echo "No iOS cocoapods dependencies need to change."
else
  ALL_DEPENDENCIES=$(printf "%s\n%s" "$COCOAPODS_DEPENDENCIES" "$IRIS_COCOAPODS_DEPENDENCIES" | sed 's/^pod /s.dependency /' | sed 's/^/  /')
  TEMP_FILE=$(mktemp)
  echo "$ALL_DEPENDENCIES" > "$TEMP_FILE"
  sed -i.bak -e '/#dependencies start/,/#dependencies end/{//!d;}' -e "/#dependencies start/r $TEMP_FILE" "$iOS_PODSPEC_PATH"
  rm "${iOS_PODSPEC_PATH}.bak"
  rm "$TEMP_FILE"
  echo "agora-react-native-rtm.podspec updated."

fi

if [ -z "$DEP_VERSION" ]; then
  echo "can not find dependencies version."
else
  echo "update dependencies version to $TERRA_CONFIG_PATH1"
  sed 's|rtm_[^/]*|rtm_'$DEP_VERSION'|g' $TERRA_CONFIG_PATH1 > tmp
  mv tmp $TERRA_CONFIG_PATH1
  sed 's|version: \(.*\)|version: '$DEP_VERSION'|g' $TERRA_CONFIG_PATH1 > tmp
  mv tmp $TERRA_CONFIG_PATH1
  sed 's|rtm_[^/]*|rtm_'$DEP_VERSION'|g' $TERRA_CONFIG_PATH2 > tmp
  mv tmp $TERRA_CONFIG_PATH2
  sed 's|version: \(.*\)|version: '$DEP_VERSION'|g' $TERRA_CONFIG_PATH2 > tmp
  mv tmp $TERRA_CONFIG_PATH2
fi
