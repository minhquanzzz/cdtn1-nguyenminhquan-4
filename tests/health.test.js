
const test = require("node:test");
const assert = require("node:assert/strict");

test("Kiểm tra phép tính cơ bản", () => {
  assert.equal(1 + 1, 2);
});

test("Kiểm tra định dạng mã ticket", () => {
  const ticketCode = "TK-L4-001";

  assert.match(ticketCode, /^TK-L4-\d{3}$/);
});
