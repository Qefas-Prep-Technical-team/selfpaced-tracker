const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: '.env' });
}

if (!process.env.MONGODB_URI) {
  console.error("No MONGODB_URI found");
  process.exit(1);
}

const EngagementReportSchema = new mongoose.Schema({
    nameChannel: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
});
const EngagementReport = mongoose.models.EngagementReport || mongoose.model('EngagementReport', EngagementReportSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const result = await EngagementReport.deleteMany({
      nameChannel: 'Unknown',
      location: 'Unknown',
      hotLeads: 0,
      convertedStudents: 0
    });

    console.log(`Deleted ${result.deletedCount} unknown records.`);
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

run();
