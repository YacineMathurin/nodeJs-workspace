
export default function emailingService(to) {
    var SibApiV3Sdk = require('sib-api-v3-sdk');

    if (!process.env.TRANSACTION_EMAIL_FROM || !process.env.CONFIRM_DELETE_USER_URL || !process.env.SENDINBLUE_API_KEY) {
        console.error("FATAL ERROR: missing or misconfigured .env !");
        winston.error("FATAL ERROR: missing or misconfigured .env !");
        process.exit(1);
    }

    const myApiKey = process.env.SENDINBLUE_API_KEY;
    const MAGICLINK_TEMPLATE = 6;
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];

    apiKey.apiKey = myApiKey;
    console.log('apiKey: ', myApiKey);

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendEmail.subject = 'Connexion magasin';
    sendEmail.templateId = MAGICLINK_TEMPLATE;
    sendEmail.to = [{ 'email': to }];
    sendEmail.sender = {
        'name': 'noReply',
        'email': process.env.TRANSACTION_EMAIL_FROM
    };
    sendEmail.params = {
        'callbackURL': `${process.env.CONFIRM_DELETE_USER_URL}?token=${requestToken}`,
    };
    return apiInstance.sendTransacEmail(sendEmail)
        .then((data) => {
            console.log(data);
            return data;
        });
}