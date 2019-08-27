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
  let errorMessage: string = 'An error occured! ';
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

const logDockerError = (err: any) => {
  if (typeof err === 'object') {
    const code = err.code || (err.response && err.response.status.toString());
    if (err.response && err.response.data & err.response.data.message) {
      console.log('An error occured!', code + ':', err.response.data.message || '');
    }
    else if (err.response && err.response.statusText) {
      console.log('An error occured!', code + ':', err.response.data.statusText || '');
    }
    else if (code === 'ENOENT') {
      console.log('An error occured!', 'You are not logged in');
    }
    else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('login') !== -1) {
      console.log('An error occured!', 'can not login to docker');
    }
    else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('image inspect') !== -1) {
      console.log('An error occured!', 'image does not exists');
    }
    else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('push registy') !== -1) {
      console.log('An error occured!', 'can not push docker image');
    }
    else if (err.hasOwnProperty('cmd') && err.cmd.indexOf('tag') !== -1) {
      console.log('An error occured!', 'can create tag');
    }
    else {
      console.log('An error occured! code:', code, err);
    }
  }
  else {
    console.log('An error occured!', err);
  }
}

export const common = {
  handleRequestError,
  logError,
  logDockerError
};
