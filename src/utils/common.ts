// Project Modules
import { messages } from '../consts/msg';

const handleRequestError = (err: any, isLogin: boolean = false) => {
  if (checkStandardError(err)) {
    return err;
  }
  else {
    const standardError: { code: number | null | string, message: string } = { code: null, message: '' };
    standardError.code = err.code || (err.response && err.response.status.toString());

    if (isLogin && standardError.code && (standardError.code == '403' || standardError.code == '400')) {
      standardError.message = messages.incorrect_credentials;
    }
    else if (err.response && err.response.data && err.response.data.message) {
      standardError.message = err.response.data.message || '';
    }
    else if (err.response && err.response.statusText) {
      standardError.message = err.response.statusText || '';
    }
    return standardError;
  }
};

const checkStandardError = (err: any) => {
  let isStandard = false;
  if (typeof err === 'object' && err.hasOwnProperty('code') && err.hasOwnProperty('message')) {
    isStandard = true;
  }
  return isStandard;
}

const logError = (err: { code: number | null | string, message: string }) => {
  let errorMessage: string = 'An Error Occured! ';
  if (checkStandardError(err)) {
    if (err.hasOwnProperty('code')) {
      errorMessage += `Error code is: ${err.code}. `;
    }
    if (err.hasOwnProperty('message')) {
      errorMessage += err.message;
    }
    console.log(errorMessage);
  }
  else if (err.hasOwnProperty('code')) { 
    errorMessage += `Error code is: ${err.code}. `;
    console.log(errorMessage);
  }
  else {
    console.log(err);
  }
}

export const common = {
  handleRequestError,
  logError
};
