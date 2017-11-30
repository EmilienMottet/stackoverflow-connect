#!/usr/bin/env node

const path = require('path');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require("fs");


const EMAIL = 'your@mail.here';
const PASSWORD = 'yourPasswordHere';
const EMAIL2 = 'your@mail.here';
const PASSWORD2 = 'yourPasswordHere';
const HOST = 'host';
const PORT = 587;

const date = new Date();
const filename = date.getTime() + '.png';
const resultPath = path.join(__dirname, filename);

;(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    // const browser = await puppeteer.launch()
    const page = await browser.newPage();

    await page.goto('https://stackoverflow.com', {waitUntil: 'networkidle'});
    // await page.screenshot({path: path.join(__dirname, 'debug-goto.png'), fullPage: true});

    await page.click('a.login-link.btn-clear');
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.screenshot({path: path.join(__dirname, 'debug-a.login-link.btn-clear.png'), fullPage: true});

    await page.click('input#email');
    await page.type(EMAIL);
    await page.screenshot({path: path.join(__dirname, 'debug-input#email.png'), fullPage: true});

    await page.click('input#password');
    await page.type(PASSWORD);
    await page.screenshot({path: path.join(__dirname, 'debug-input#password.png'), fullPage: true});

    await page.click('input#submit-button');
    await page.waitForNavigation({waitUntil: 'networkidle'});
    await page.screenshot({path: path.join(__dirname, 'debug-input#submit-button.png'), fullPage: true});

    obj = "";
    text = "";

    try {
        await page.click('a.my-profile.js-gps-track');
        await page.waitForNavigation({waitUntil: 'networkidle'});
        await page.screenshot({path: resultPath, fullPage: true});
        obj = "login ok";
        text = "";
    } catch (e) {
        // console.log('Error:', e.message);
        await page.screenshot({path: resultPath, fullPage: true});
        obj = "ERROR : login FAIL";
        text = e.message;
    }

    await browser.close();

    transporter = nodemailer.createTransport({
        host: HOST,
        secure: false, // use SSL
        port:PORT,
        use_authentication: true,
        // service: 'gmail',
        auth: {
            user: EMAIL2,
            pass: PASSWORD2
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await fs.readFile(resultPath, function (err, data) {

        transporter.sendMail({
            sender: EMAIL2,
            to: EMAIL2,
            subject: obj,
            body: text,
            attachments: [{'filename': resultPath, 'content': data}]
        }), function(err, success) {
            if (err) {
                // Handle error
            }

        }
    });
})();
