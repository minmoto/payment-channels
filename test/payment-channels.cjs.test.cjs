const assert = require("node:assert/strict");
const test = require("node:test");

const { createPaymentChannelRegistry, validatePaymentChannelData } = require("../dist/cjs/index.js");

test("require() loads the package synchronously and resolves built-in channels", () => {
  const registry = createPaymentChannelRegistry();
  assert.ok(registry.size > 0);
  assert.ok(registry.has("mpesa_phone_ke_kes"));
});

test("CommonJS validation matches the documented ESM result for the same fixture", () => {
  const registry = createPaymentChannelRegistry();
  const schema = registry.get("mpesa_phone_ke_kes");
  assert.ok(schema);

  const result = validatePaymentChannelData(schema, {
    phoneNumber: "0712 345 678",
    description: " settlement ",
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.data, {
    phoneNumber: "+254712345678",
    description: "settlement",
  });
});
