#import "AgoraRtmNg.h"
#import <AgoraRtmWrapper/iris_module.h>
#import <AgoraRtmWrapper/iris_rtm_engine.h>
#import <ReplayKit/ReplayKit.h>
#include <regex>
#include <string>
#include <vector>

#define EVENT_NAME @"AgoraRtmNg:onEvent"

@interface AgoraRtmNg ()

@property(nonatomic, assign) BOOL hasListeners;

@end

namespace agora {
namespace iris {
namespace rtm {
class EventHandler : public IrisEventHandler {
public:
  EventHandler(void *plugin) { plugin_ = (__bridge AgoraRtmNg *)plugin; }

  void OnEvent(const char *event, const char *data, void **buffer,
               unsigned int *length, unsigned int buffer_count) {
    @autoreleasepool {
      NSMutableArray *array = [NSMutableArray new];
      for (int i = 0; i < buffer_count; ++i) {
        NSString *base64Buffer = [[[NSData alloc] initWithBytes:buffer[i]
                                                         length:length[i]]
            base64EncodedStringWithOptions:
                NSDataBase64EncodingEndLineWithLineFeed];
        [array addObject:base64Buffer];
      }

      NSString *eventStr = [NSString stringWithUTF8String:event];
      NSString *dataStr = [NSString stringWithUTF8String:data];
      NSString *processedData = [plugin_ processEventData:eventStr
                                             originalData:dataStr];

      if (plugin_.hasListeners) {
        [plugin_ sendEventWithName:EVENT_NAME
                              body:@{
                                @"event" : eventStr,
                                @"data" : processedData,
                                @"buffers" : array
                              }];
      }
    }
  }

  void OnEvent(EventParam *param) override {
    OnEvent(param->event, param->data, param->buffer, param->length,
            param->buffer_count);
  }

private:
  AgoraRtmNg *plugin_;
};
} // namespace rtm
} // namespace iris
} // namespace agora

@interface AgoraRtmNg ()

@property(nonatomic) agora::iris::rtm::EventHandler *eventHandler;

@end

static AgoraRtmNg *instance = nil;

@implementation AgoraRtmNg
RCT_EXPORT_MODULE()

+ (instancetype)shareInstance {
  return instance;
}

- (instancetype)init {
  if (self = [super init]) {
    self.irisRtmEngine = nullptr;
    self.eventHandler =
        new agora::iris::rtm::EventHandler((__bridge void *)self);
    instance = self;
  }
  return instance;
}

- (void)dealloc {
  if (self.irisRtmEngine) {
    delete self.irisRtmEngine;
  }
  if (self.eventHandler) {
    delete self.eventHandler;
  }
}

RCT_EXPORT_METHOD(showRPSystemBroadcastPickerView
                  : (BOOL)showsMicrophoneButton resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject) {
  if (@available(iOS 12.0, *)) {
    dispatch_async(dispatch_get_main_queue(), ^{
      NSURL *url = [[NSBundle mainBundle] URLForResource:nil
                                           withExtension:@"appex"
                                            subdirectory:@"PlugIns"];
      NSBundle *bundle = [NSBundle bundleWithURL:url];
      if (bundle) {
        RPSystemBroadcastPickerView *picker =
            [[RPSystemBroadcastPickerView alloc]
                initWithFrame:CGRectMake(0, 0, 100, 200)];
        picker.showsMicrophoneButton = showsMicrophoneButton;
        picker.preferredExtension = bundle.bundleIdentifier;
        for (UIView *view in [picker subviews]) {
          if ([view isKindOfClass:UIButton.class]) {
            [((UIButton *)view)
                sendActionsForControlEvents:UIControlEventAllTouchEvents];
          }
        }
      }
    });
    resolve([NSNull null]);
    return;
  }
  reject(@"", @"not support", nil);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(newIrisRtmEngine) {
  if (self.irisRtmEngine == nullptr) {
    self.irisRtmEngine = createIrisRtmClient(nullptr);
  }
  return [NSNull null];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(destroyIrisRtmEngine) {
  if (self.irisRtmEngine != nullptr) {
    delete self.irisRtmEngine;
    self.irisRtmEngine = nullptr;
  }
  return [NSNull null];
}

#ifdef RCT_NEW_ARCH_ENABLED
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(
    callApi
    : (JS::NativeAgoraRtmNg::SpecCallApiArgs &)args)
#else
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(callApi
                                       : (nonnull NSDictionary *)args)
#endif
{
  NSString *funcName =
#ifdef RCT_NEW_ARCH_ENABLED
      args.funcName();
#else
      args[@"funcName"];
#endif
  NSString *params =
#ifdef RCT_NEW_ARCH_ENABLED
      args.params();
#else
      args[@"params"];
#endif

  NSMutableArray<NSData *> *bufferArray = [NSMutableArray new];
#ifdef RCT_NEW_ARCH_ENABLED
  if (args.buffers().has_value()) {
    auto array = args.buffers().value();
    int count = array.size();
#else
  if ([args[@"buffers"] isKindOfClass:NSArray.class]) {
    NSArray *array = args[@"buffers"];
    NSUInteger count = array.count;
#endif
    for (int i = 0; i < count; ++i) {
      NSData *data = [[NSData alloc]
          initWithBase64EncodedString:array[i]
                              options:
                                  NSDataBase64DecodingIgnoreUnknownCharacters];
      [bufferArray addObject:data];
    }
  }

  void *buffers[bufferArray.count];
  unsigned int length[bufferArray.count];
  for (int i = 0; i < bufferArray.count; ++i) {
    buffers[i] = const_cast<void *>(bufferArray[i].bytes);
    length[i] = static_cast<unsigned int>(bufferArray[i].length);
  }

  char result[kBasicResultLength] = "";
  int error_code;

  NSUInteger paramsLength =
      [params lengthOfBytesUsingEncoding:NSUTF8StringEncoding];

  ApiParam param = {
      .event = funcName.UTF8String,
      .data = params.UTF8String,
      .data_size = static_cast<unsigned int>(paramsLength),
      .result = result,
      .buffer = buffers,
      .length = length,
      .buffer_count = static_cast<unsigned int>(bufferArray.count),
  };

  void *handler[1] = {self.eventHandler};
  if (bufferArray.count == 0) {
    std::smatch output;
    std::regex pattern =
        std::regex("(^.*(RtmClient_create|StreamChannel_publishTopicMessage|"
                   "RtmClient_publish)(_[a-zA-Z0-9]*)?)$");
    std::string name = funcName.UTF8String;
    if (std::regex_match(name, output, pattern)) {
      param.buffer = handler;
      param.buffer_count = 1;
    }
  }

  [self newIrisRtmEngine];
  error_code = self.irisRtmEngine->CallIrisApi(&param);

  if (error_code != 0) {
    NSError *error;
    NSData *data =
        [NSJSONSerialization dataWithJSONObject:@{
          @"result" : @(error_code)
        }
                                        options:NSJSONWritingPrettyPrinted
                                          error:&error];
    return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  }
  return [NSString stringWithUTF8String:result];
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ EVENT_NAME ];
}

- (void)startObserving {
  _hasListeners = YES;
}

- (void)stopObserving {
  _hasListeners = NO;
}

- (void)invalidate {
  [super invalidate];
  instance = nil;
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeAgoraRtmNgSpecJSI>(params);
}
#endif

- (NSString *)processEventData:(NSString *)event originalData:(NSString *)data {
  @try {
    NSData *jsonData = [data dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error;
    NSMutableDictionary *jsonObject =
        [NSJSONSerialization JSONObjectWithData:jsonData
                                        options:NSJSONReadingMutableContainers
                                          error:&error];
    if (error || !jsonObject) {
      return data;
    }

    if ([event containsString:@"onGetHistoryMessagesResult"]) {
      NSArray *messageList = jsonObject[@"messageList"];
      if (messageList && [messageList isKindOfClass:[NSArray class]]) {
        NSMutableArray *processedMessageList = [NSMutableArray new];

        for (NSDictionary *item in messageList) {
          NSMutableDictionary *processedItem = [item mutableCopy];

          id messagePtr = item[@"message"];
          NSNumber *messageLength = item[@"messageLength"];

          if (messagePtr && messageLength && [messageLength intValue] > 0) {
            unsigned long long ptrAddress = 0;

            // Safely handle large integer addresses, support both NSNumber and
            // NSString
            if ([messagePtr isKindOfClass:[NSNumber class]]) {
              ptrAddress = [(NSNumber *)messagePtr unsignedLongLongValue];
            } else if ([messagePtr isKindOfClass:[NSString class]]) {
              // Use string to handle very large integers, similar to Android
              // BigInt approach
              NSScanner *scanner =
                  [NSScanner scannerWithString:(NSString *)messagePtr];
              [scanner scanUnsignedLongLong:&ptrAddress];
            }

            if (ptrAddress > 0) {
              @try {
                const char *str = reinterpret_cast<const char *>(ptrAddress);
                // Add memory access safety check
                if (str != NULL) {
                  NSString *messageContent =
                      [NSString stringWithUTF8String:str];
                  if (messageContent) {
                    processedItem[@"message"] = messageContent;
                  }
                }
              } @catch (NSException *exception) {
                NSLog(@"Memory access error for pointer address: 0x%llx, "
                      @"error: %@",
                      ptrAddress, exception.reason);
              }
            }
          }

          [processedMessageList addObject:processedItem];
        }

        jsonObject[@"messageList"] = processedMessageList;
      }
    }

    NSData *processedJsonData =
        [NSJSONSerialization dataWithJSONObject:jsonObject
                                        options:0
                                          error:&error];
    if (error) {
      return data;
    }

    return [[NSString alloc] initWithData:processedJsonData
                                 encoding:NSUTF8StringEncoding];

  } @catch (NSException *exception) {
    NSLog(@"processEventData error: %@", exception.reason);
    return data;
  }
}

@end
