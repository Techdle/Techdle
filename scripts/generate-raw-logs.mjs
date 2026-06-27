import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, '../src/data/puzzles/index.json');
const indexRaw = fs.readFileSync(indexPath, 'utf-8');
const puzzles = JSON.parse(indexRaw);

// We define rawLogs manually for hard puzzles to simulate P1 outage logs.
// These are typical server crash / hardware failure logs.
const hardLogTemplates = {
  'dead-capacitor': [
    'kernel: [ Hardware Error ]: CPU 0: Machine Check Exception: 5 Bank 0: b200000000010005',
    'kernel: [ Hardware Error ]: RIP !INEXACT! 10:<ffffffffb7e0d37e>',
    'ipmi_sensors: Lower Non-Recoverable threshold breached for Voltage V_DIMM',
    'systemd[1]: Reached target Power-Off.',
    'kernel: watchdog: BUG: soft lockup - CPU#0 stuck for 23s!'
  ],
  'cracked-bga-gpu': [
    'NVRM: GPU at PCI:0000:01:00: GPU-0902c3a5-b542-f815-6c70-692ab3c49e22',
    'NVRM: Xid (PCI:0000:01:00): 62, pid=1923, 0000(0000) 00000000 00000000',
    'kernel: pcieport 0000:00:01.0: AER: Corrected error received: 0000:01:00.0',
    'kernel: pcieport 0000:00:01.0: AER: Multiple Corrected errors received: 0000:01:00.0',
    'NVRM: RmInitAdapter failed! (0x23:0x56:458)'
  ],
  'water-cooling-pump-dead': [
    'kernel: CPU1: Package temperature above threshold, cpu clock throttled (total events = 1)',
    'ipmi_sensors: Sensor FAN_1 reading 0 RPM. Lower Critical threshold breached.',
    'kernel: thermal thermal_zone0: critical temperature reached (105 C), shutting down',
    'systemd[1]: Reached target Shutdown.',
    'kernel: mce: [Hardware Error]: Machine check events logged'
  ],
  'supply-chain-attack': [
    'npm ERR! code EINTEGRITY',
    'npm ERR! sha512-xxxxxx integrity checksum failed when using sha512',
    'npm ERR! expected: sha512-xxxxxx',
    'kernel: [UFW BLOCK] IN=eth0 OUT= MAC=... SRC=192.168.1.100 DST=185.12.3.4 LEN=60 TTL=64 PROTO=TCP DPT=4444',
    'auditd: type=SYSCALL msg=audit(1620000000.000:100): arch=c000003e syscall=59 success=yes exit=0 a0=55f8b9a1a010 items=2 ppid=1 pid=1234'
  ]
};

// Fallback generator
function generateGenericHardLogs(puzzleId) {
  const timestamp = new Date().toISOString();
  return [
    `${timestamp} server-prod-01 kernel: Out of memory: Killed process 1523 (java) total-vm:15320144kB, anon-rss:9241020kB, file-rss:0kB, shmem-rss:0kB`,
    `${timestamp} server-prod-01 systemd[1]: java.service: Main process exited, code=killed, status=9/KILL`,
    `${timestamp} server-prod-01 systemd[1]: java.service: Failed with result 'signal'.`,
    `${timestamp} server-prod-01 systemd[1]: java.service: Consumed 14h 23min 12s CPU time.`
  ];
}

let modified = 0;
const updatedPuzzles = puzzles.map(p => {
  // Select some puzzles that represent P1 outages (Servers, Network, Database)
  const isP1Candidate = p.category === 'Network' || p.category === 'Server' || p.category === 'Infrastructure' || p.id.includes('server') || p.id.includes('dns') || p.id.includes('database');
  
  if (isP1Candidate && !p.rawLogs) {
    if (hardLogTemplates[p.id]) {
      p.rawLogs = hardLogTemplates[p.id];
    } else {
      // Find partial match
      const matchingKey = Object.keys(hardLogTemplates).find(key => p.id.includes(key) || key.includes(p.id));
      if (matchingKey) {
        p.rawLogs = hardLogTemplates[matchingKey];
      } else {
        p.rawLogs = generateGenericHardLogs(p.id);
      }
    }
    modified++;
  }
  return p;
});

fs.writeFileSync(indexPath, JSON.stringify(updatedPuzzles, null, 2) + '\n');
console.log(`Added rawLogs to ${modified} P1 candidate puzzles.`);
