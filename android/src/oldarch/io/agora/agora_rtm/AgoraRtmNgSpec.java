package io.agora.agora_rtm;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public abstract class AgoraRtmNgSpec extends ReactContextBaseJavaModule {
  AgoraRtmNgSpec(ReactApplicationContext context) { super(context); }

  public abstract boolean newIrisRtmEngine();

  public abstract boolean destroyIrisRtmEngine();

  public abstract String callApi(ReadableMap arguments);

  public abstract void addListener(String eventName);

  public abstract void removeListeners(double count);
}
