const fs = require('fs');
const { parse } = require('csv-parse');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: '.env' });
}

// Ensure the URI is there
if (!process.env.MONGODB_URI) {
  console.error("No MONGODB_URI found");
  process.exit(1);
}

// Define the Schema matching your backend
const EngagementReportSchema = new mongoose.Schema({
    nameChannel: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    hotLeads: { type: Number, required: true, default: 0 },
    convertedStudents: { type: Number, required: true, default: 0 },
    flyersDistributed: { type: Number, required: true, default: 0 },
    giftsDistributed: { type: Number, required: true, default: 0 },
    contactsUploaded: { type: Number, required: true, default: 0 },
    dataCollected: { type: String, default: '' },
    challenges: { type: String, default: '' },
    suggestions: { type: String, default: '' },
    objections: [{ type: String }],
    supportNeeded: [{ type: String }],
    comments: { type: String, required: true },
});
const EngagementReport = mongoose.models.EngagementReport || mongoose.model('EngagementReport', EngagementReportSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const records = [];
  const parser = fs
    .createReadStream('old_data.csv')
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const row of parser) {
    // Find the right keys via partial matches since some CSV headers might have invisible spaces or weird characters
    const keys = Object.keys(row);
    
    const findKey = (str) => keys.find(k => k.toLowerCase().includes(str.toLowerCase()));

    const name = row[findKey('Name')] || 'Unknown';
    const dateStr = row[findKey('Date')] || new Date().toISOString();
    const location = row[findKey('School') || findKey('Location')] || 'Unknown';
    const hotLeads = parseInt(row[findKey('Hot Leads')]) || 0;
    const converted = parseInt(row[findKey('Paying customers')]) || 0;
    const flyers = parseInt(row[findKey('Flyers Distributed')]) || 0;
    const gifts = parseInt(row[findKey('Gifts Distributed')]) || 0;
    const contacts = parseInt(row[findKey('Contacts Uploaded')]) || 0;
    
    const dataCollected = row[findKey('Parent/Student Data')] || '';
    const challenges = row[findKey('Challenges')] || '';
    const suggestions = row[findKey('Suggestions')] || '';
    
    const objectionsStr = row[findKey('Objections & Feedback')] || '';
    const objections = objectionsStr ? objectionsStr.split(',').map(s => s.trim()) : [];
    
    const supportStr = row[findKey('Support Needed')] || '';
    const supportNeeded = supportStr ? supportStr.split(',').map(s => s.trim()) : [];
    
    const comments = row[findKey('Comment')] || 'Imported from Google Forms';

    records.push({
      nameChannel: name,
      date: new Date(dateStr),
      location: location,
      hotLeads,
      convertedStudents: converted,
      flyersDistributed: flyers,
      giftsDistributed: gifts,
      contactsUploaded: contacts,
      dataCollected,
      challenges,
      suggestions,
      objections,
      supportNeeded,
      comments
    });
  }

  console.log(`Parsed ${records.length} records. Importing...`);
  
  if (records.length > 0) {
    await EngagementReport.insertMany(records);
    console.log("Import completely successfully!");
  } else {
    console.log("No records to import.");
  }
  
  await mongoose.disconnect();
}

run().catch(e => {
  console.error("Error importing:", e);
  process.exit(1);
});
