describe('Test Name', () => {
  before(() => {
    cy.login(null, false, true);
    cy.visit(
      'https://localhost/apps/validations/hoangpaul/foobar/fs/Instabase%20Drive/.instabase_projects/complete2/latest/validations/15412277-f166-4f97-8d84-705da77fd08c/versions/479a0314-7998-4322-9b5c-94d8467d2291/validations.ibvalidations'
    );
  });

  beforeEach(() => {
    cy.intercept('https://localhost/api/v1/validations/modify', function (req) {
      const validationData = [
        {
          requestBody: [
            { name: 'edits.0.modified_values.position.x', value: 48 },
          ],
          requestQuery: [],
          response: { status: 200, body: {} },
        },
      ];
      const apiUrl = req.url();
      const requestBody = req.body();
      const requestQuery = req.query();

      for (let i = 0, len = validationData.length; i < len; i++) {
        const validation = validationData[i];
        if (
          Object.entries(validation.requestQuery).every(
            ([key, value]) => requestQuery[key] === value
          ) &&
          Object.entries(validation.requestBody).every(
            ([key, value]) => Cypress._.get(requestBody, key) === value
          )
        ) {
          req.reply(validation.response);
        }
      }
    });
  });

  it('tests', () => {
    // Click on div with testId index-4befaafedc2f4f43a1b83db784eb7ecf77eb5626a8763b646c065bb17ea6375f
    cy.get(
      'div[data-testid="index-4befaafedc2f4f43a1b83db784eb7ecf77eb5626a8763b646c065bb17ea6375f"]'
    ).click();

    // Click on div with testId index-4ddb80ac655b40ea292b81c6f1d372b13259cc6486982806267d7d336e897e7e
    cy.get(
      'div[data-testid="index-4ddb80ac655b40ea292b81c6f1d372b13259cc6486982806267d7d336e897e7e"]'
    ).click();
  });
});
