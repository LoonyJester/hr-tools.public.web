describe('Employee', () => {

  beforeEach(() => {
    browser.get('/#/EmployeeList');
  });

  it('should have a title', () => {
    let subject = browser.getTitle();
    let result  = 'HR Tools';
    expect(subject).toEqual(result);
  });

  it('should have cards', () => {
    let subject = element(by.css('figure')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

});
