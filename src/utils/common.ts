const handleError = (err: object) => {
  const code = err.code || (err.response && err.response.status.toString());
  switch (code) {
    // tslint:disable ter-indent
    case '403':
    case '400':
      this.log('Incorrect username or password');
      break;
    default:
      if (err.response && err.response.data) {
        this.log('An error occured!', code + ':', err.response.data.message || '');
      }
      else if (err.response && err.response.statusText) {
        this.log('An error occured!', code + ':', err.response.data.statusText || '');
      }
      else {
        this.log('An error occured!', code);
      }
  }
};

const logError = (err: { code: number | null, message: string }) => {
  let errorMessage: string = '';
  if (err.hasOwnProperty('code')) {
    errorMessage += `Error code is: ${err.code}.`;
  }
  if (err.hasOwnProperty('message')) {
    errorMessage += err.message;
  }
}

export const common = {
  handleError,
  logError
};
