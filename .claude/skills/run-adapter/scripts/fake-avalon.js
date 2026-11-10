// Fake Avalon Nano 3S cgminer API (TCP, default 127.0.0.1:4028), replaying the repo fixtures.
//   node fake-avalon.js                      # filter runtime 45000 min (~31 d): reminder due
//   FILTER_MIN=0 PORT=4029 node fake-avalon.js
// Handles the adapter's poll (summary+version+stats+litestats), `stats` (LED read before the first poll) and any
// `ascset` (answered "ASC 0 set OK"; `0,filter-clean,1` also resets the filter runtime). Logs every request.
const net = require('net');
const fs = require('fs');
const path = require('path');

const fixtures = path.resolve(__dirname, '../../../../src/lib/miner/fixture');
const summaryVersionStats = JSON.parse(
    fs.readFileSync(path.join(fixtures, 'nano3s-summary+version+stats.json'), 'utf8'),
);
const liteStats = fs.readFileSync(path.join(fixtures, 'nano3s-litestats.json'), 'utf8');
const port = Number(process.env.PORT || 4028);
let filterMinutes = Number(process.env.FILTER_MIN ?? 45000);

net.createServer(socket => {
    socket.on('data', data => {
        const request = JSON.parse(data.toString());
        console.log(new Date().toISOString(), JSON.stringify(request));
        let reply;
        if (request.command === 'ascset') {
            if (request.parameter === '0,filter-clean,1') {
                filterMinutes = 0;
            }
            reply = {
                STATUS: [{ STATUS: 'I', When: 0, Code: 118, Msg: 'ASC 0 set OK', Description: 'cgminer 4.11.1' }],
                id: 1,
            };
        } else if (request.command === 'stats') {
            reply = summaryVersionStats.stats[0];
        } else {
            const lite = JSON.parse(liteStats.replace(/Filter\[\d+\]/, `Filter[${filterMinutes}]`));
            reply = request.command.includes('litestats')
                ? { ...summaryVersionStats, litestats: [lite] }
                : summaryVersionStats;
        }
        socket.end(JSON.stringify(reply));
    });
}).listen(port, '127.0.0.1', () => console.log(`fake avalon on 127.0.0.1:${port}`));
