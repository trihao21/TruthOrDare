import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },

        type: {
            type: String,
            required: true,
            enum: ["truth", "dare", "lucky"],
        },

        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 300
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Question", QuestionSchema);
