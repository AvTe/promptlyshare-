import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
    index: true // Index for performance
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
    trim: true,
    minlength: [10, 'Prompt must be at least 10 characters long'],
    maxlength: [2000, 'Prompt must be less than 2000 characters']
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag must be less than 50 characters'],
    match: [/^[a-zA-Z0-9\s\-_]+$/, 'Tag can only contain letters, numbers, spaces, hyphens, and underscores'],
    index: true // Index for searching
  }
}, {
  timestamps: true, // Add createdAt and updatedAt fields
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields when converting to JSON
      delete ret.__v;
      return ret;
    }
  }
});

// Compound index for better query performance
PromptSchema.index({ creator: 1, createdAt: -1 });
PromptSchema.index({ tag: 1, createdAt: -1 });

// Pre-save middleware for additional validation
PromptSchema.pre('save', function(next) {
  // Sanitize the prompt content
  this.prompt = this.prompt.replace(/<script[^>]*>.*?<\/script>/gi, '');
  this.prompt = this.prompt.replace(/<[^>]*>/g, '');
  this.prompt = this.prompt.replace(/javascript:/gi, '');
  
  next();
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;