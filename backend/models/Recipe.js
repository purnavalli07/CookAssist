import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: [
      {
        name: { type: String, required: true },
        amount: { type: String, required: true },
      },
    ],
    steps: [
      {
        order: { type: Number, required: true },
        instruction: { type: String, required: true },
        duration: { type: Number, default: 0 }, // in seconds, 0 = no timer
      },
    ],
    cookingTime: {
      type: Number, // total minutes
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    cuisine: {
      type: String,
      trim: true,
    },
    servings: {
      type: Number,
      default: 4,
    },
    tags: [String],
  },
  { timestamps: true }
);

recipeSchema.index({ name: 'text', tags: 'text', cuisine: 'text' });

export default mongoose.model('Recipe', recipeSchema);
