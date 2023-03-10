const serviceId = process.env.SERVICESID
const token = process.env.TOKEN
const AccountSID = process.env.AccountSID
const client = require('twilio')(AccountSID, token);
function sendOtp(mob) {
    console.log("mob",mob);
    client.verify.v2.services(serviceId)
        .verifications
        .create({ to: `+91${mob}`, channel: 'sms' })
        .then(verification => console.log(verification.status));
}

function verifyOtp(mob, otp) {
    console.log(mob, otp + 'Hi');
    return new Promise((resolve, reject) => {
        client.verify.v2.services(serviceId)
            .verificationChecks
            .create({ to: `+91${mob}`, code: otp })
            .then((verification_check) => {
                console.log(verification_check.status)
                resolve(verification_check)
            }
            );
    })
}

module.exports = {
    sendOtp,
    verifyOtp
}