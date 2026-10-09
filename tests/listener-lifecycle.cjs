// Run with: node tests/listener-lifecycle.cjs
// Exercise the real client implementation with the real JS emitter, without native SDKs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const EventEmitter = require('eventemitter3');

const emitter = new EventEmitter();
const filename = path.join(__dirname, '../src/internal/RtmClientInternal.ts');
const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const exportsObject = {};
vm.runInNewContext(source, {
  exports: exportsObject,
  require: (name) => {
    if (name === './IrisRtmEngine') {
      return {
        DeviceEventEmitter: emitter,
        EVENT_TYPE: { RTMEvent: 1 },
        callIrisApi: () => ({ result: 0 }),
      };
    }
    return new Proxy(
      {},
      {
        get: () =>
          class {
            setParameters() {}
          },
      }
    );
  },
});
const client = new exportsObject.RtmClientInternal({});
const processor = {
  type: () => 1,
  func: [(handlers, event, data) => handlers[event](data)],
};

for (const [event, nativeEvent] of Object.entries(client.event_name_map)) {
  let count = 0;
  const handler = () => count++;
  const other = () => {};
  client.addEventListener(event, other);
  for (let cycle = 0; cycle < 3; cycle++) {
    client.addEventListener(event, handler);
    emitter.emit(nativeEvent, processor, {});
    assert.equal(count, cycle + 1, `${event}: no duplicate callbacks`);
    client.removeEventListener(event, handler);
    assert.equal(
      emitter.listenerCount(nativeEvent),
      1,
      `${event}: preserve other listener`
    );
    emitter.emit(nativeEvent, processor, {});
    assert.equal(count, cycle + 1, `${event}: removed callback stays silent`);
  }
  emitter.on('unrelated', other);
  client.removeAllListeners(event);
  assert.equal(
    emitter.listenerCount(nativeEvent),
    0,
    `${event}: remove all mapped listeners`
  );
  assert.equal(
    emitter.listenerCount('unrelated'),
    1,
    'preserve other event types'
  );
  client.removeAllListeners();
  assert.deepEqual(
    emitter.eventNames(),
    [],
    'no argument clears all listeners'
  );
}
console.log(
  'PASS: all mapped events, repeated registration/removal, targeted and no-argument cleanup'
);
