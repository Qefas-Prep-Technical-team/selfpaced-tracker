// // lib/models/Channel.ts
// import mongoose from 'mongoose';

// const ChannelSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type: { type: String, required: true },
//   description: String,
//   sourceCategory: String,
//   trackingId: String,
//   imageUrl: String, // From Cloudinary
//   isActive: { type: Boolean, default: true },
// }, { timestamps: true });

// export const Channel = mongoose.models.Channel || mongoose.model('Channel', ChannelSchema);

// lib/models/Channel.ts
import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['digital', 'person', 'offline'] // Matches your UI types
  },
  status: { 
    type: String, 
    enum: ['active', 'paused', 'archived'], 
    default: 'active' 
  },
  // Visuals
  imageUrl: String,    // Cloudinary URL
  iconName: String,    // Store Lucide icon name (e.g., 'Camera', 'User')
  iconColor: { 
    type: String, 
    default: 'text-primary bg-primary/10' 
  },
  // Metadata
  description: String,
  sourceCategory: String,
  trackingId: { type: String, unique: true },
  // Metrics (Initializing at 0 for new channels)
  leads: { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
}, { 
  timestamps: true, // This gives us 'createdAt' which we can format as 'dateCreated'
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for date formatting to match "Oct 12, 2023"
ChannelSchema.virtual('dateCreated').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
});

export const Channel = mongoose.models.Channel || mongoose.model('Channel', ChannelSchema);