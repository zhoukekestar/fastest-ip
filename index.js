#!/usr/bin/env node

const ncp = require('copy-paste');
const exec = require('child_process').exec;

const ping = (ip) => {
  return new Promise((resolve, reject) => {
    exec(`ping ${ip}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ip, stdout});
    });
  });
}

ncp.paste((e, ips) => {
  if (e) {
    throw e;
    return;
  }

  ips = ips.split(/\s{1,}/g).filter((ip) => ip.length > 0);
  console.log(`IPs: ` + ips.join(', '));
  Promise.race(ips.map((ip) => ping(ip))).then(({ip, stdout}) => {
    console.log(`\n------- Result -------\n${ip} is fastest.`);
    console.log(stdout)
  }).catch((e) => {
    throw e;
  });
});
