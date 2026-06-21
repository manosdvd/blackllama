const fs = require('fs');

function parseMammothHTML(content) {
  // It's mostly <table><thead><tr><th><p><strong>Time</strong></p></th>...
  // Let's use regex to extract day headers and rows.
  
  const days = {};
  let currentDay = '';

  // Extract all TRs
  const trRegex = /<tr>(.*?)<\/tr>/g;
  let match;
  while ((match = trRegex.exec(content)) !== null) {
    const rowContent = match[1];
    
    // Extract TH/TD cells
    const cellRegex = /<(?:th|td)[^>]*>(.*?)<\/(?:th|td)>/g;
    const cells = [];
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      // Strip all html tags inside cell
      const text = cellMatch[1].replace(/<[^>]+>/g, '').trim();
      cells.push(text);
    }

    if (cells.length === 1 && cells[0]) {
      // It's a day header, e.g. "FRIDAY, JUNE 25 — Fleet Arrival" or "Time Activity For Your Unit"
      const headerText = cells[0];
      if (headerText.includes("Time") || headerText.includes("LEGEND") || headerText.includes("WEEK 1")) {
        continue;
      }
      
      let dayName = headerText.split(',')[0].split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      if (['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].includes(dayName)) {
         currentDay = dayName;
         days[currentDay] = [];
      } else if (headerText.includes("FRIDAY")) {
         currentDay = "friday";
         days[currentDay] = [];
      } else if (headerText.includes("SATURDAY")) {
         currentDay = "saturday";
         days[currentDay] = [];
      } else if (headerText.includes("SUNDAY")) {
         currentDay = "sunday";
         days[currentDay] = [];
      }
    } else if (cells.length >= 2) {
      // Time, Activity, For Your Unit
      const time = cells[0];
      const task = cells[1];
      const desc = cells[2] || '';
      
      if (time !== 'Time' && currentDay) {
        // filter out transitions
        if (task.includes("Transition") || task.includes("Post-Meal Cleanup Buffer")) {
          // keep them or skip them? The user might want them to see transitions. Let's keep them but maybe simplify.
        }
        days[currentDay].push({ time, task, desc });
      }
    }
  }
  return days;
}

const files = [
  '2027_Cub_Leader_Schedule.txt',
  '2027_Cub_Staff_Schedule.txt',
  '2027_BSA_Leader_Schedule.txt',
  '2027_BSA_Staff_Schedule.txt'
];

const allSchedules = {};

files.forEach(f => {
  if (fs.existsSync(f)) {
    const key = f.replace('.txt', '').replace('2027_', '').replace(' (1)', '');
    const text = fs.readFileSync(f, 'utf8');
    allSchedules[key] = parseMammothHTML(text);
  }
});

fs.writeFileSync('src/data/schedules.json', JSON.stringify(allSchedules, null, 2));
console.log('Parsed schedules and saved to src/data/schedules.json');
