require('dotenv').config();
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const objectId = mongoose.Types.ObjectId.createFromTime(Math.floor(sevenDaysAgo.getTime() / 1000));
  const result = await db.collection('knowledges').deleteMany({ _id: { $gte: objectId } });
  console.log('Deleted ' + result.deletedCount + ' records created in the last 7 days.');
  process.exit(0);
}).catch(console.error);
