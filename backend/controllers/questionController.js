import Question from '../models/Question.js';

// Get all questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get questions by type (truth/dare/lucky)
export const getQuestionsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        // Map old category names to new type names
        const typeMap = {
            'TRUTH': 'truth',
            'DARE': 'dare',
            'CỎ 3 LÁ': 'lucky',
            'truth': 'truth',
            'dare': 'dare',
            'lucky': 'lucky'
        };
        const type = typeMap[category] || category.toLowerCase();
        const questions = await Question.find({ type }).sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get questions by user ID
export const getUserQuestions = async (req, res) => {
    try {
        const { userId } = req.params;
        // Query with both string and ObjectId format to handle both cases
        const questions = await Question.find({ 
            $or: [
                { userId: userId },
                { userId: userId.toString() }
            ]
        }).sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add new question
export const addQuestion = async (req, res) => {
    try {
        const { category, content, type: questionType } = req.body;

        // Support both old 'category' and new 'type' field names
        let finalType = questionType || category;

        // Map old category names to new type names
        const typeMap = {
            'TRUTH': 'truth',
            'DARE': 'dare',
            'CỎ 3 LÁ': 'lucky'
        };

        if (typeMap[finalType]) {
            finalType = typeMap[finalType];
        }

        if (!finalType || !content) {
            return res.status(400).json({ error: 'Type and content are required' });
        }

        // Use authenticated user's ID from JWT token
        // Convert to string to ensure consistent format
        const userIdString = req.userId ? req.userId.toString() : req.userId;
        
        // Check limit: max 10 questions per category per user
        const MAX_QUESTIONS_PER_CATEGORY = 10;
        const currentType = finalType.toLowerCase();
        
        // Count existing questions of this type for this user
        const existingCount = await Question.countDocuments({ 
            userId: userIdString,
            type: currentType
        });
        
        if (existingCount >= MAX_QUESTIONS_PER_CATEGORY) {
            const categoryName = currentType === 'truth' ? 'Truth' : currentType === 'dare' ? 'Dare' : 'Lucky';
            return res.status(400).json({ 
                error: `Bạn đã đạt giới hạn tối đa ${MAX_QUESTIONS_PER_CATEGORY} câu hỏi ${categoryName}. Vui lòng xóa một số câu hỏi cũ để thêm mới.` 
            });
        }
        
        const question = new Question({
            userId: userIdString, // From authenticate middleware, converted to string
            type: currentType,
            content
        });
        await question.save();

        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete question
export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        await Question.findByIdAndDelete(id);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Seed default questions
export const seedDefaultQuestions = async (req, res) => {
    try {
        const defaultQuestions = [
            // TRUTH
            { userId: 'system', type: 'truth', content: 'Điều gì khiến bạn cảm thấy xấu hổ nhất?' },
            { userId: 'system', type: 'truth', content: 'Bạn đã từng nói dối ai đó trong nhóm chưa?' },
            { userId: 'system', type: 'truth', content: 'Crush bí mật của bạn là ai?' },
            { userId: 'system', type: 'truth', content: 'Điều gì bạn chưa bao giờ dám nói với bố mẹ?' },
            { userId: 'system', type: 'truth', content: 'Bạn đã từng làm gì mà giờ nghĩ lại thấy ngượng?' },

            // DARE
            { userId: 'system', type: 'dare', content: 'Nhảy một điệu nhảy ngẫu hứng trong 30 giây' },
            { userId: 'system', type: 'dare', content: 'Gọi điện cho crush và nói "Em nhớ anh/chị"' },
            { userId: 'system', type: 'dare', content: 'Hát một bài hát mà mọi người chọn' },
            { userId: 'system', type: 'dare', content: 'Đăng một status xấu hổ lên Facebook' },
            { userId: 'system', type: 'dare', content: 'Làm 20 cái hít đất ngay bây giờ' },

            // LUCKY
            { userId: 'system', type: 'lucky', content: '🍀 May mắn! Bạn được miễn nhiệm vụ lần này' },
            { userId: 'system', type: 'lucky', content: '🍀 Chúc mừng! Bạn có thể chọn người khác thay' },
            { userId: 'system', type: 'lucky', content: '🍀 Tuyệt vời! Bạn được nghỉ một lượt' },
            { userId: 'system', type: 'lucky', content: '🍀 Thật may! Bạn thoát nạn rồi' },
            { userId: 'system', type: 'lucky', content: '🍀 Cỏ 3 lá mang lại may mắn cho bạn!' }
        ];

        // Clear existing system questions
        await Question.deleteMany({ userId: 'system' });

        // Insert new default questions
        await Question.insertMany(defaultQuestions);

        res.json({ message: 'Default questions seeded successfully', count: defaultQuestions.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
