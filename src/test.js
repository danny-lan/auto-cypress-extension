const { generatePatch } = require('./server/codemods');

// const patch = generatePatch({
//   filepath:
//     '/Users/hoangpaul/Documents/instabase/webserver/shared/src/js/webpacked/apps/src/solution-builder/components/BuilderHome/index.tsx',
//   props: { children: 'Recent Projects' },
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
//   },
// });

const patch = generatePatch({
  filepath:
    '/Users/hoangpaul/Documents/instabase/webserver/shared/src/js/webpacked/apps/src/validations/components/ValidationsGettingStarted/index.tsx',
  props: { intent: 'primary', label: 'Primary' },
});

// const patch = generatePatch({
//   filepath:
//     '/Users/hoangpaul/Documents/instabase/webserver/shared/src/js/webpacked/lib/src/IBPage/components/TopBar.tsx',
//   props: {
//     alignItems: 'center',
//   },
// });

console.log(patch);
