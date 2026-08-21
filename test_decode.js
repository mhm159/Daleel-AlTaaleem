const fs = require('fs');

let corrupted = "ظ…ط¯ط§ط±ط³ ط¯ظ„ظٹظ„ ط§ظ„طھط¹ظ„ظ…";
console.log(Buffer.from(corrupted, 'windows-1252').toString('utf8'));
