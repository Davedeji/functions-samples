/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

// Sends an email confirmation when a user changes his mailing list subscription.
/*exports.sendEmailConfirmation = functions.database.ref('/highPriorityLoops').onWrite(async (change)*/
exports.sendPriorityLoopConfirmation = functions.firestore.document('highPriorityLoops/{wildcard}').onWrite(async (change, context) => {
  

  /*if (!snapshot.changed('subscribedToMailingList')) {
    return null;
  }*/
  
  const document = change.after.exists ? change.after.data() : null;
  var status = "unknown"

  const mailOptions = {
    from: '"LiveTrackz Cloud App Notifications" <noreply@firebase.com>',
    to: "support@livetrackz.com",
  };

  if (String(change.after.data().status = 0)) {
    status = "submitted"
  }
  else if (String(change.after.data().status = 1)) {
    status = "In-Progress"
  }
  else if (String(change.after.data().status = 2)) {
    status = "Action-required"
  }
  else if (String(change.after.data().status = 3)) {
    status = "Completed"
  }
  

  // Building Email message.
  mailOptions.subject = `High Priority Loop Request for "${String(change.after.data().trackName)}" Updated` ;
  mailOptions.text =
      `High Priority Loop Request has been updated
      Name: ${String(change.after.data().trackName)}
      URL: ${String(change.after.data().trackURL)}
      Notes: ${String(change.after.data().trackNotes)}
      status: ${status}`
      ;
  
  try {
    await mailTransport.sendMail(mailOptions);
    console.log(`New subscription confirmation email sent to:`, );
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;
});

exports.sendLoopConfirmation = functions.firestore.document('normalPriorityLoops/{wildcard}').onWrite(async (change, context) => {
  

  /*if (!snapshot.changed('subscribedToMailingList')) {
    return null;
  }*/
  
  const document = change.after.exists ? change.after.data() : null;
  var status = "unknown"

  const mailOptions = {
    from: '"LiveTrackz Cloud App Notifications" <noreply@firebase.com>',
    to: "support@livetrackz.com",
  };

  if (String(change.after.data().status = 0)) {
    status = "submitted"
  }
  else if (String(change.after.data().status = 1)) {
    status = "In-Progress"
  }
  else if (String(change.after.data().status = 2)) {
    status = "Action-required"
  }
  else if (String(change.after.data().status = 3)) {
    status = "Completed"
  }
  

  // Building Email message.
  mailOptions.subject = `Loop Request for "${String(change.after.data().trackName)}" Updated` ;
  mailOptions.text =
      `Loop Request has been updated
      Name: ${String(change.after.data().trackName)}
      URL: ${String(change.after.data().trackURL)}
      Notes: ${String(change.after.data().trackNotes)}
      status: ${status}`
      ;
  
  try {
    await mailTransport.sendMail(mailOptions);
    console.log(`New subscription confirmation email sent to:`, );
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;
});
