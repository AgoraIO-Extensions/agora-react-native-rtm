package io.agora.rtm.ng.react;

import android.util.Base64;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import io.agora.iris.rtm.IrisRtmEngine;
import io.agora.iris.rtm.IrisRtmEventHandler;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

@ReactModule(name = AgoraRtmNgModule.NAME)
public class AgoraRtmNgModule
    extends AgoraRtmNgSpec implements IrisRtmEventHandler {
  public static final String NAME = "AgoraRtmNg";
  public IrisRtmEngine irisRtmEngine;

  AgoraRtmNgModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean newIrisRtmEngine() {
    if (irisRtmEngine == null) {
      IrisRtmEngine.enableUseJsonArray(true);
      irisRtmEngine = new IrisRtmEngine(getReactApplicationContext());
      irisRtmEngine.setEventHandler(this);
      return true;
    }
    return false;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean destroyIrisRtmEngine() {
    if (irisRtmEngine != null) {
      irisRtmEngine.setEventHandler(null);
      irisRtmEngine.destroy();
      irisRtmEngine = null;
      return true;
    }
    return false;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String callApi(ReadableMap args) {
    String funcName = args.getString("funcName");
    String params = args.getString("params");
    List<byte[]> buffers = null;

    ReadableArray array = args.getArray("buffers");
    if (array != null) {
      buffers = new ArrayList<>();
      for (int i = 0; i < array.size(); i++) {
        buffers.add(Base64.decode(array.getString(i), Base64.DEFAULT));
      }
    }

    try {
      newIrisRtmEngine();
      return irisRtmEngine.callIrisApi(funcName, params, buffers);
    } catch (Exception e) {
      e.printStackTrace();
      try {
        return new JSONObject().put("result", e.getMessage()).toString();
      } catch (JSONException ex) {
        throw new RuntimeException(ex);
      }
    }
  }

  @ReactMethod
  public void showRPSystemBroadcastPickerView(boolean showsMicrophoneButton,
      Promise promise) {
    promise.reject("", "not support");
  }

  @ReactMethod
  public void addListener(String eventName) {
  }

  @ReactMethod
  public void removeListeners(double count) {
  }

  @Override
  public void OnEvent(String event, String data, List<byte[]> buffers) {
    final WritableMap map = Arguments.createMap();
    map.putString("event", event);
    map.putString("data", data);
    if (buffers != null) {
      WritableArray array = Arguments.createArray();
      for (byte[] buffer : buffers) {
        String base64 = Base64.encodeToString(buffer, Base64.DEFAULT);
        array.pushString(base64);
      }
      map.putArray("buffers", array);
    }
    getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("AgoraRtmNg:onEvent", map);
  }
}
