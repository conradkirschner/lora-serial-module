const fs = require('fs')
const path = require('path')
const {NodeSSH} = require('node-ssh')
require('dotenv').config()

const ssh = new NodeSSH()
const homePath = '/home/pi/';
const user = 'conrad';
const checkoutUrl = 'https://github.com/conradkirschner/lora-serial-module.git';
const checkoutFolder = 'lora-serial-module';

const PIs = {
    1: '10.10.10.31',
    2: '10.10.10.32',
    3: '10.10.10.33',
    4: '10.10.10.34',
    5: '10.10.10.35',
    6: '10.10.10.36',
    7: '10.10.10.37',
    8: '10.10.10.38',
    9: '10.10.10.39',
    10: '10.10.10.40',
    11: '10.10.10.41',
    12: '10.10.10.42',
    13: '10.10.10.43',
    14: '10.10.10.44',
    15: '10.10.10.45',
    16: '10.10.10.46',
    20: '10.10.10.50',
}
ssh.connect({
    host: PIs[14] ,
    username: 'pi',
    password: process.env.PASSWORD
})
    /*
     Or
     ssh.connect({
       host: 'localhost',
       username: 'steel',
       privateKey: fs.readFileSync('/home/steel/.ssh/id_rsa', 'utf8')
     })
     if you want to use the raw string as private key
     */
    .then(function() {
        ssh.execCommand('mkdir '+ user, { cwd: homePath }).then(function(result) {
            ssh.execCommand('git clone ' + checkoutUrl, { cwd: homePath + '/' + user }).then(function(result) {
                ssh.execCommand('npm i && npm run start', { cwd: homePath + '/' + user + '/' + checkoutFolder }).then(function(result) {

                });
            });
        })

    })
