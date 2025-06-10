package io.agora.rtm.ng.react;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.ModuleHolder;
import com.facebook.react.bridge.ModuleSpec;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AgoraRtmNgPackage extends TurboReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(String name,
      ReactApplicationContext reactContext) {
    if (name.equals(AgoraRtmNgModule.NAME)) {
      return new AgoraRtmNgModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      moduleInfos.put(AgoraRtmNgModule.NAME,
          new ReactModuleInfo(AgoraRtmNgModule.NAME,
              AgoraRtmNgModule.NAME,
              false, // canOverrideExistingModule
              false, // needsEagerInit
              true, // hasConstants
              false, // isCxxModule
              isTurboModule // isTurboModule
      ));
      return moduleInfos;
    };
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();
    return viewManagers;
  }
}
