'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Adds two numbers to each other.
exports.addNumbers = functions.https.onCall((data: any) => {
    // Numbers passed from the client.
    const firstNumber = data.firstNumber;
    const secondNumber = data.secondNumber;

    // Checking that attributes are present and are numbers.
    if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'two arguments "firstNumber" and "secondNumber" which must both be numbers.');
    }

    // returning result.
    return {
        firstNumber: firstNumber,
        secondNumber: secondNumber,
        operator: '+',
        operationResult: firstNumber + secondNumber,
    };
});

// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.
exports.addMessage = functions.https.onCall((data: any, context: any) => {
    // Message text passed from the client.
    const text = data.text;
    // Checking attribute.
    if (!(typeof text === 'string') || text.length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'one arguments "text" containing the message text to add.');
    }
    // Checking that the user is authenticated.
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }

    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;

    // Saving the new message to the Realtime Database.
    const sanitizedMessage = text; // Sanitize the message.
    return admin.database().ref('/messages').push({
        text: sanitizedMessage,
        author: { uid, name, picture, email },
    }).then(() => {
        console.log('New Message written');
        // Returning the sanitized message to the client.
        return { text: sanitizedMessage };
    })
        .catch((error: any) => {
            // Re-throwing the error as an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('unknown', error.message, error);
        });
});

// Get the exchange rate for CHF <-> THB
exports.getRate = functions.https.onCall((data: any, context: any) => {
    // Message text passed from the client.
    const srcCry = data.sourceCurrency;
    // Checking attribute.
    if (!(typeof srcCry === 'string') || srcCry.length !== 3) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'one arguments "sourceCurrency" containing the source currency.');
    }
    const tgtCry = data.targetCurrency;
    // Checking attribute.
    if (!(typeof tgtCry === 'string') || tgtCry.length !== 3) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'one arguments "targetCurrency" containing the target currency.');
    }
    // Checking that the user is authenticated.
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }

    


    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;

    // Saving the new message to the Realtime Database.
    const sanitizedMessage = "text"; // Sanitize the message.
    return admin.database().ref('/messages').push({
        text: sanitizedMessage,
        author: { uid, name, picture, email },
    }).then(() => {
        console.log('New Message written');
        // Returning the sanitized message to the client.
        return { text: sanitizedMessage };
    })
        .catch((error: any) => {
            // Re-throwing the error as an HttpsError so that the client gets the error details.
            throw new functions.https.HttpsError('unknown', error.message, error);
        });
});
