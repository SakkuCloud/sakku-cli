// Native Modules
const fs = require('fs');
const util = require('util');

// External Modules
const express = require('express');
const request = require('request');
const q = require('q');
var cors = require('cors');


// Variable Initialization
const app = express();
const token = 'c333064957a344f883fa12131ba7423c';
const smsApi = 'http://notif-sandbox.pod.ir/v2/service/sms';
const storageFile = 'data.txt'
app.use(express.json());
app.use(cors());
app.use(express.static('public'))
appendFile = util.promisify(fs.appendFile);


app.post('/role', function (req, res) {
  let data = req.body;
  data.timeStamp = (new Date()).getTime();
  
  if (data.hasOwnProperty('job')) {
    data.job = decodeURIComponent(data.job);
  };

  if (data.hasOwnProperty('age')) {
    data.age = decodeURIComponent(data.age);
  };

  if (data.hasOwnProperty('firstName')) {
    data.firstName = decodeURIComponent(data.firstName);
  };

  if (data.hasOwnProperty('lastName')) {
    data.lastName = decodeURIComponent(data.lastName);
  };
  let jsonData = JSON.stringify(data);
  
  let errors = {
    file: { code: 1, message: 'Error in storing the data!' },
    sms: { code: 2, message: 'Error in sending the sms!' },
    validation: { code: 3, message: 'Error in validating data!' }
  };
  let errorLevel = 'file'; // file | sms
  let smsTexts = {
    1: `عزیز
    از ملاقات با شما در غرفه خانواده فناپ خوشحالیم.
    اگر می خواهید بدانید در طول روز از کدام سرویس‌های فناپ استفاده می‌کنید، داستان ما را از اینجا بخوانید!
    tilin.ir/FanapIntro`,
    2: `عزیز
    از ملاقات با شما در غرفه‌ خانواده فناپ خوشحالیم.
    برای پیوستن به فناپ‌سافت مشهد، رزومه‌ خود را برای ما ارسال کنید.
    hr-soft@fanap.ir`,
    3: `گرامی
    از ملاقات با شما در غرفه‌ خانواده فناپ خوشحالیم.
    از شما دعوت می‌کنیم، برای توسعه شهر هوشمند به ما بپیوندید!
    در پادیوم، بازارگاه خدمات کسب‌وکارهای دیجیتال، منتظرتان هستیم!
    tilin.ir/Podium`
  }
  let userRoles = ["1", "2", "3", 1, 2, 3];
  mobileRegex = /^(0|\+98|0098){1}[9]{1}[\d]{9}$/;

  if (!data.hasOwnProperty('mobile') || !data.hasOwnProperty('userRole') || !mobileRegex.test(data.mobile) || userRoles.indexOf(data.userRole) === -1) {
    res.status(400).send(errors['validation']);
    return;
  }

  appendFile(storageFile, jsonData + '\n', 'utf8')
    .then(() => {
      errorLevel = 'sms';
      let fullname = data.firstName + ' ' + data.lastName + ' ';
      return sendSMS(data.mobile, fullname + smsTexts[data.userRole]);
    })
    .then(() => {
      res.status(200).send({ status: 'OK' });
    })
    .catch((error) => {
      res.status(500).send(errors[errorLevel]);
    });
})

// Running the server
var server = app.listen(3000, '0.0.0.0', function () {
  console.log('SERVER IS RUNNING!');
});

function sendSMS(mobileNum, smsText) {
  var defer = q.defer();
  var options = {
    'method': 'POST',
    'url': smsApi,
    'headers': {
      'apiToken': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "content": { "content": smsText, "mobileNumbers": [mobileNum] } })
  };
  request(options, function (error, response) {
    if (error) {
      defer.reject(error);
    }
    else {
      response.body = JSON.parse(response.body);
      if (response.body.hasError === true) {
        defer.reject(response.body);
      }
      else {
        defer.resolve(response.body);
      }
    }
  });
  return defer.promise;
}
