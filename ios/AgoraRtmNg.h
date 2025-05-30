#import <AgoraRtmWrapper/iris_engine_base.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "AgoraRtmNgSpec.h"

@interface AgoraRtmNg : RCTEventEmitter <NativeAgoraRtmNgSpec>
#else
#import <React/RCTBridgeModule.h>

@interface AgoraRtmNg : RCTEventEmitter <RCTBridgeModule, RCTInvalidating>
#endif

@property(nonatomic) IApiEngineBase *irisRtmEngine;

+ (instancetype)shareInstance;

- (NSString *)processEventData:(NSString *)event originalData:(NSString *)data;

@end
