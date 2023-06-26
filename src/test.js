const { generatePatch } = require('./server/codemods');

const testId = 'mytestid';

// const patch = generatePatch({
//   filepath:
//     '/Users/hoangpaul/Documents/instabase/webserver/shared/src/js/webpacked/apps/src/solution-builder/components/BuilderHome/index.tsx',
//   props: { children: 'Recent Projects' }, testId
// });

// const patch = generatePatch({
//   filepath:
//     '/Users/hoangpaul/Documents/instabase/webserver/shared/src/js/webpacked/apps/src/validations/components/ValidationsGettingStarted/index.tsx',
//   props: {
//     alignItems: 'center',
//     children: [{}, {}],
//     'data-testid': 'create-new',
//     direction: 'column',
//     justify: 'center',
//     onClick: 'onclick',
//   }, testId
// });

const patch = generatePatch({
  filepath:
    '/Users/hoangpaul/Documents/instabase/webserver/shared/src/js/webpacked/apps/src/validations/components/ValidationsGettingStarted/index.tsx',
  props: { intent: 'primary', label: 'Primary' },
  testId,
});

// const patch = generatePatch({
//   filepath:
//     '/Users/hoangpaul/Documents/instabase/webserver/shared/src/js/webpacked/lib/src/IBPage/components/TopBar.tsx',
//   props: {
//     alignItems: 'center',
//   }, testId
// });

console.log(patch);
