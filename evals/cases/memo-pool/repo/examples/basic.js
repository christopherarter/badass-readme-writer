const { createMemo } = require('../src');

const memo = createMemo({ ttlMs: 1000 });
let calls = 0;
const load = async () => {
  calls += 1;
  return { name: 'Ada' };
};

Promise.all([memo('user:1', load), memo('user:1', load)]).then((values) => {
  console.log(values[0].name, values[1].name, `loads=${calls}`);
});
