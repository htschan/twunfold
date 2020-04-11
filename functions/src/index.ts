'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios').default;
const uuidv1 = require('uuid');
const moment = require('moment');
admin.initializeApp();

exports.throwNotAuthenticated = function (context: any) {
    // Checking that the user is authenticated.
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
}

exports.compareTransferStatusDate = function (a: any, b: any) {
    const dateA = moment(a.created);
    const dateB = moment(b.created);

    let comparison = 0;
    if (dateA > dateB) {
        comparison = -1;
    } else if (dateA < dateB) {
        comparison = 1;
    }
    return comparison;
};

exports.getStringArg = function (inpstring: string, minlen: number, maxlen: number, argname: string, msg: string, origin: string): string {
    console.log(`${origin} ${argname}=${inpstring}`);
    // checking attribute.
    if (!(typeof inpstring === "string") || inpstring.length < minlen || inpstring.length > maxlen) {
        // throwing an HttpsError so that the client gets the error details.
        throw new Error("invalid-argument: The function must be called with " +
            "one string argument [" + argname + "] containing the [" + msg + "].");
    }
    console.log(`function ${origin} called with arg ${argname}=${inpstring}`);
    return inpstring;
};

exports.getIntArg = function (inpnumber: number, min: number, max: number, argname: string, msg: string, origin: string): number {
    console.log(`${origin} ${argname}=${inpnumber}`);
    // checking attribute.
    if (isNaN(inpnumber)) {
        // throwing an HttpsError so that the client gets the error details.
        throw new Error("invalid-argument The function must be called with " +
            "one integer argument " + argname + " containing the [" + msg + "].");
    }
    if (inpnumber < min || inpnumber > max) {
        throw new Error("invalid-argument Out of range error " +
            "one integer argument " + argname + " containing the [" + msg + "].");
    }
    console.log(`function ${origin} called with arg ${argname}=${inpnumber}`);
    return inpnumber;
};

exports.getAuthorization = function (acct: string) {
    const mode = functions.config().global.mode;
    if (mode === "prod") {
        if (acct === "tw1")
            return functions.config().tw1.prod.ro_token;
        else if (acct === "tw2")
            return functions.config().tw2.prod.ro_token;
    } else {
        if (acct === "tw1")
            return functions.config().tw1.sandbox.ro_token;
        else if (acct === "tw2")
            return functions.config().tw2.sandbox.ro_token;
    }
}

exports.getAuthorizationRw = function (acct: string) {
    const mode = functions.config().global.mode;
    if (mode === "prod") {
        if (acct === "tw1")
            return functions.config().tw1.prod.rw_token;
        else if (acct === "tw2")
            return functions.config().tw2.prod.rw_token;
    } else {
        if (acct === "tw1")
            return functions.config().tw1.sandbox.rw_token;
        else if (acct === "tw2")
            return functions.config().tw2.sandbox.rw_token;
    }
}

exports.getUrl = function (acct: string) {
    const mode = functions.config().global.mode;
    if (mode === "prod") {
        if (acct === "tw1")
            return functions.config().tw1.prod.url;
        else if (acct === "tw2")
            return functions.config().tw2.prod.url;
    } else {
        if (acct === "tw1")
            return functions.config().tw1.sandbox.url;
        else if (acct === "tw2")
            return functions.config().tw2.sandbox.url;
    }
}

exports.getRecipientAccountNo = function (recptAccountShortcut: string) {
    switch (recptAccountShortcut) {
        case 'su1':
            return functions.config().global.recipient_account.su1.number;
        case 'su2':
            return functions.config().global.recipient_account.su2.number;
        case 'ui1':
            return functions.config().global.recipient_account.ui1.number;
        case 'ui2':
            return functions.config().global.recipient_account.ui2.number;
        case 'da1':
            return functions.config().global.recipient_account.da1.number;
        case 'da2':
            return functions.config().global.recipient_account.da2.number;
        case 'ko1':
            return functions.config().global.recipient_account.ko1.number;
    }
    throw new functions.https.HttpsError('unknown recipient account shortcut', recptAccountShortcut);
}

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
    exports.throwNotAuthenticated(context);

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
    const srcCry = exports.getStringArg(data.sourceCurrency, 3, 3, "srcCry", "sourceCurrency", "getRate");
    const tgtCry = exports.getStringArg(data.targetCurrency, 3, 3, "tgtCry", "targetCurrency", "getRate");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorization('tw1');

    return axios.get(`${exports.getUrl('tw1')}/v1/rates?source=${srcCry}&target=${tgtCry}`)
        .then(function (response: any) {
            // handle success
            return response;
        })
        .catch(function (error: any) {
            // handle error
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            return result.data[0];
        });
});

// Get the profile for the given account
// account is the name of an account in the firebase configuration
exports.getProfile = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getProfiles");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorization(acct);

    return axios.get(`${exports.getUrl(acct)}/v1/profiles`)
        .then(function (response: any) {
            // handle success
            return response;
        })
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            return result.data[0];
        });
});

// Get the recipient account id with the given account number shortcut
// account is the number of the recipients bank account
exports.getReceipientId = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getReceipientId");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "getReceipientId");
    const recpAcctShortcut = exports.getStringArg(data.recpAcctShortcut, 2, 3, "recpAcctShortcut", "recipient account shortcut", "getReceipientId");

    exports.throwNotAuthenticated(context);

    const recpAcctNo = exports.getRecipientAccountNo(recpAcctShortcut);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorizationRw(acct);

    return axios.default.get(`${exports.getUrl(acct)}/v1/accounts?profile=${profileId}`)
        .then(function (response: any) {
            // handle success
            return response;
        })
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            const accountId = result.data.find((e: any) => e.details.accountNumber === recpAcctNo);
            if (accountId === undefined)
                throw new functions.https.HttpsError(`accountNumber [${recpAcctNo}] not found`);
            return accountId;
        });
});

// Get the recipients accounts with the given account number shortcut
exports.getReceipients = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getReceipients");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "getReceipients");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorizationRw(acct);

    return axios.default.get(`${exports.getUrl(acct)}/v1/accounts?profile=${profileId}`)
        .then(function (response: any) {
            // handle success
            return response;
        })
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            return result.data;
        });
});

// Get the list of thai banks
exports.getThaiBanks = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getThaiBanks");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorizationRw(acct);

    return axios.default.get(`https://api.transferwise.com/v1/banks?country=TH`)
        .then(function (response: any) {
            // handle success
            return response;
        })
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            return result.data;
        });
});

// Get the balance for the given account
// account is the name of an account in the firebase configuration
exports.getBalance = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getBalance");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "getBalance");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorization(acct);

    return axios.get(`${exports.getUrl(acct)}/v1/borderless-accounts?profileId=${profileId}`)
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            return result.data[0];
        });
});

// Get the given status of the given account
// account is the name of an account in the firebase configuration
// status is one of 'cancelled', 'incoming_payment_waiting', 'processing', 'funds_converted', 'outgoing_payment_sent' and others
exports.getTransferStatus = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getTransferStatus");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "getTransferStatus");
    const requested_status = exports.getStringArg(data.requested_status, 3, 60, "requested_status", "requested status", "getTransferStatus");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorization(acct);
    const recentDate = moment(new Date());
    recentDate.subtract(7, 'days');
    return axios.get(`${exports.getUrl(acct)}/v1/transfers/?offset=0&limit=30&profile=${profileId}&status=${requested_status}&createdDateStart=${recentDate.format('YYYY-MM-DD')}`)
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            return result.data.sort(exports.compareTransferStatusDate);
        })
        .then(function (sortedResult: any) {
            // get delivery time for each transfer which is in state 'processing'
            const promises = sortedResult.map(function (transfer: any) {
                if (transfer.status === 'processing') {
                    axios.defaults.headers.common['Authorization'] = exports.getAuthorization(acct);
                    return axios.get(`${exports.getUrl(acct)}/v1/delivery-estimates/${transfer.id}`)
                        .catch(function (error: any) {
                            // handle error
                            console.log(error);
                            throw new functions.https.HttpsError('unknown', error.message, error);
                        })
                        .then(function (result: any) {
                            transfer.estimatedDeliveryDate = result.data.estimatedDeliveryDate;
                            return transfer;
                        });
                } else {
                    return transfer;
                }
            });
            return Promise.all(promises);
        });
});

// Get the live delivery estimate for a transfer by the transfer ID
// account is the name of an account in the firebase configuration
exports.getDeliveryTime = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getDeliveryTime");
    const transferId = exports.getIntArg(data.transferId, 1, Number.MAX_SAFE_INTEGER, "transferId", "transfer Id", "getDeliveryTime");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorization(acct);
    return axios.get(`${exports.getUrl(acct)}/v1/delivery-estimates/${transferId}`)
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            return result.data.estimatedDeliveryDate;
        });
});

// Get a quote for the given amount
// account is the name of an account in the firebase configuration
exports.getQuote = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "getQuote");
    const amount = exports.getIntArg(data.amount, 1, 9999, "amount", "amount", "getQuote");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "getQuote");

    exports.throwNotAuthenticated(context);
    console.log(`post getQuote: amount=${amount} profile=${profileId}`);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorizationRw(acct);
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    return axios.post(`${exports.getUrl(acct)}/v1/quotes`, {
        profile: profileId,
        source: 'CHF',
        target: 'THB',
        rateType: 'FIXED',
        sourceAmount: amount,
        type: 'BALANCE_PAYOUT'
    })
        .catch(function (error: any) {
            // handle error
            console.log(`post getQuote error: ${error.message}`);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            console.log(`post getQuote success: ${JSON.stringify(result.data)}`);
            return result.data;
        });
});

// get requirements for the given quote and recipient account shortcut
// targetAccount is the name of an account in the firebase configuration
exports.postRequirements = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "postRequirements");
    const transactionId = exports.getStringArg(data.transactionId, 36, 36, "transactionId", "transaction id", "postRequirements");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "postRequirements");
    const recpAcctShortcut = exports.getStringArg(data.recpAcctShortcut, 2, 3, "recpAcctShortcut",
        "recipient account shortcut", "postRequirements");
    const referenceText = exports.getStringArg(data.referenceText, 0, 35, "referenceText", "reference text", "postRequirements");
    const quoteId = exports.getIntArg(data.quoteId, 1, Number.MAX_SAFE_INTEGER, "quoteId", "quote Id", "postRequirements");

    exports.throwNotAuthenticated(context);

    axios.default.defaults.headers.common.Authorization = exports.getAuthorizationRw(acct);

    return exports.getReceipientId({ account: acct, profileId: profileId, recpAcctShortcut: recpAcctShortcut })
        .then(function (recipient: any) {
            axios.default.defaults.headers.common.Authorization = exports.getAuthorizationRw(acct);
            axios.default.defaults.headers.post["Content-Type"] = "application/json";
            return axios.default.post(`${exports.getUrl(acct)}/v1/transfer-requirements`, {
                targetAccount: recipient.id,
                quote: quoteId,
                customerTransactionId: transactionId,
                details: {
                    reference: referenceText,
                    transferPurpose: "transfer purpose",
                    sourceOfFunds: "other"
                }
            })
                .catch(function (error: any) {
                    // handle error
                    console.log(`post requrements error: ${error.message}`);
                    throw new Error(`postRequirements error ${error.message} ${error}`);
                })
                .then(function (result: any) {
                    console.log(`post requirements success: ${JSON.stringify(result.data)}`);
                    return result.data;
                });
        });
});

// Create a transfer for the given quote and recipient account shortcut
// targetAccount is the name of an account in the firebase configuration
exports.createTransfer = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "createTransfer");
    const transactionId = exports.getStringArg(data.transactionId, 36, 36, "transactionId", "transaction id", "createTransfer");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "createTransfer");
    const recpAcctShortcut = exports.getStringArg(data.recpAcctShortcut, 2, 3, "recpAcctShortcut", "recipient account shortcut", "createTransfer");
    const referenceText = exports.getStringArg(data.referenceText, 0, 35, "referenceText", "reference text", "createTransfer");
    const quoteId = exports.getIntArg(data.quoteId, 1, Number.MAX_SAFE_INTEGER, "quoteId", "quote Id", "createTransfer");

    exports.throwNotAuthenticated(context);

    axios.defaults.headers.common['Authorization'] = exports.getAuthorizationRw(acct);

    return axios.default.get(`${exports.getUrl(acct)}/v1/accounts?profile=${profileId}`)
        .then(function (response: any) {
            // handle success
            return response;
        })
        .catch(function (error: any) {
            // handle error
            console.log(error);
            throw new functions.https.HttpsError('unknown', error.message, error);
        })
        .then(function (result: any) {
            const accountId = result.data.find((e: any) => e.details.accountNumber === recpAcctShortcut);
            if (accountId === undefined)
                throw new functions.https.HttpsError(`accountNumber [${recpAcctShortcut}] not found`);
            axios.defaults.headers.common['Authorization'] = exports.getAuthorizationRw(acct);
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            return axios.post(`${exports.getUrl(acct)}/v1/transfers`, {
                targetAccount: accountId,
                quote: quoteId,
                customerTransactionId: transactionId,
                details: {
                    reference: referenceText,
                    transferPurpose: "verification.transfers.purpose.send.to.family"
                }
            })
                .catch(function (error: any) {
                    // handle error
                    console.log(`post createTransfer error: ${error.message}`);
                    throw new functions.https.HttpsError('unknown', error.message, error);
                })
                .then(function (result1: any) {
                    console.log(`post createTransfer success: ${JSON.stringify(result1.data)}`);
                    return result1.data;
                });
        });
});

// post fund for given transaction
exports.postFund = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "postFund");
    const profileId = exports.getIntArg(data.profileId, 1, Number.MAX_SAFE_INTEGER, "profileId", "profile Id", "postFund");
    const transferId = exports.getIntArg(data.transferId, 1, Number.MAX_SAFE_INTEGER, "transferId", "transfer Id", "postFund");

    exports.throwNotAuthenticated(context);

    axios.default.defaults.headers.common.Authorization = exports.getAuthorizationRw(acct);

    return axios.default.post(`${exports.getUrl(acct)}/v3/profiles/${profileId}/transfers/${transferId}/payments`, {
        type: "BALANCE"
    })
        .catch(function (error: any) {
            // handle error
            console.log(`post postFund error: ${error.message}`);
            throw new Error(`postFund error ${error.message} ${error}`);
        })
        .then(function (result: any) {
            console.log(`post postFund success: ${JSON.stringify(result.data)}`);
            return result.data;
        });
});

// cancel the transfer specified by transferId
exports.cancelTransfer = functions.https.onCall((data: any, context: any) => {
    const acct = exports.getStringArg(data.account, 3, 3, "account", "account shortcut", "cancelTransfer");
    const transferId = exports.getIntArg(data.transferId, 1, Number.MAX_SAFE_INTEGER, "transferId", "transfer Id", "cancelTransfer");

    exports.throwNotAuthenticated(context);

    axios.default.defaults.headers.common.Authorization = exports.getAuthorizationRw(acct);

    return axios.default.put(`${exports.getUrl(acct)}/v1/transfers/${transferId}/cancel`)
        .catch(function (error: any) {
            // handle error
            console.log(`put cancelTransfer error: ${error.message}`);
            throw new Error(`cancelTransfer error ${error.message} ${error}`);
        })
        .then(function (result: any) {
            console.log(`put cancelTransfer success: ${JSON.stringify(result.data)}`);
            return result.data;
        });
});
