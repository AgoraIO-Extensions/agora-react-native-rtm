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

      if (plugin_.hasListeners) {
        [plugin_
            sendEventWithName:EVENT_NAME
                         body:@{
                           @"event" : [NSString stringWithUTF8String:event],
                           @"data" : [NSString stringWithUTF8String:data],
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
} // namespace iris
} // namespace agora

@interface AgoraRtmNg ()

@property(nonatomic) agora::iris::EventHandler *eventHandler;

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
    self.eventHandler = new agora::iris::EventHandler((__bridge void *)self);
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

  ApiParam param = {
      .event = funcName.UTF8String,
      .data = params.UTF8String,
      .data_size = static_cast<unsigned int>(params.length),
      .result = result,
      .buffer = buffers,
      .length = length,
      .buffer_count = static_cast<unsigned int>(bufferArray.count),
  };

  void *handler[1] = {self.eventHandler};
  if (bufferArray.count == 0) {
    std::smatch output;
    std::regex pattern = std::regex("^.*(RtmClient_initialize|StreamChannel_"
                                    "publishTopicMessage|RtmClient_publish)$");
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

@end
