import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/truth-or-dare';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Question Schema
const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['TRUTH', 'DARE', 'CỎ 3 LÁ'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Question = mongoose.model('Question', questionSchema);

// Routes

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get questions by category
app.get('/api/questions/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.find({ category }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new question
app.post('/api/questions', async (req, res) => {
  try {
    const { category, content } = req.body;
    
    if (!category || !content) {
      return res.status(400).json({ error: 'Category and content are required' });
    }
    
    const question = new Question({ category, content });
    await question.save();
    
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete question
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    if (question.isDefault) {
      return res.status(403).json({ error: 'Cannot delete default questions' });
    }
    
    await Question.findByIdAndDelete(id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed default questions
app.post('/api/seed', async (req, res) => {
  try {
    const defaultQuestions = [
      // TRUTH
      { category: 'TRUTH', content: 'Điều gì khiến bạn cảm thấy xấu hổ nhất?', isDefault: true },
      { category: 'TRUTH', content: 'Bạn đã từng nói dối ai đó trong nhóm chưa?', isDefault: true },
      { category: 'TRUTH', content: 'Crush bí mật của bạn là ai?', isDefault: true },
      { category: 'TRUTH', content: 'Điều gì bạn chưa bao giờ dám nói với bố mẹ?', isDefault: true },
      { category: 'TRUTH', content: 'Bạn đã từng làm gì mà giờ nghĩ lại thấy ngượng?', isDefault: true },
      
      // DARE
      { category: 'DARE', content: 'Nhảy một điệu nhảy ngẫu hứng trong 30 giây', isDefault: true },
      { category: 'DARE', content: 'Gọi điện cho crush và nói "Em nhớ anh/chị"', isDefault: true },
      { category: 'DARE', content: 'Hát một bài hát mà mọi người chọn', isDefault: true },
      { category: 'DARE', content: 'Đăng một status xấu hổ lên Facebook', isDefault: true },
      { category: 'DARE', content: 'Làm 20 cái hít đất ngay bây giờ', isDefault: true },
      
      // CỎ 3 LÁ
      { category: 'CỎ 3 LÁ', content: '🍀 May mắn! Bạn được miễn nhiệm vụ lần này', isDefault: true },
      { category: 'CỎ 3 LÁ', content: '🍀 Chúc mừng! Bạn có thể chọn người khác thay', isDefault: true },
      { category: 'CỎ 3 LÁ', content: '🍀 Tuyệt vời! Bạn được nghỉ một lượt', isDefault: true },
      { category: 'CỎ 3 LÁ', content: '🍀 Thật may! Bạn thoát nạn rồi', isDefault: true },
      { category: 'CỎ 3 LÁ', content: '🍀 Cỏ 3 lá mang lại may mắn cho bạn!', isDefault: true }
    ];
    
    // Clear existing default questions
    await Question.deleteMany({ isDefault: true });
    
    // Insert new default questions
    await Question.insertMany(defaultQuestions);
    
    res.json({ message: 'Default questions seeded successfully', count: defaultQuestions.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
