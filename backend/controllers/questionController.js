import Question from '../models/Question.js';

// Get all questions - only return user's questions if authenticated
export const getAllQuestions = async (req, res) => {
    try {
        // If user is authenticated, only return their questions
        if (req.userId) {
            const userIdString = req.userId.toString();
            const questions = await Question.find({ 
                userId: userIdString 
            }).sort({ createdAt: -1 });
            return res.json(questions);
        }
        
        // If not authenticated, return empty array (no questions visible)
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get questions by type (truth/dare/lucky) - only return user's questions if authenticated
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
        
        // Build query
        const query = { type };
        
        // If user is authenticated, only return their questions
        if (req.userId) {
            const userIdString = req.userId.toString();
            query.userId = userIdString;
        } else {
            // If not authenticated, return empty array
            return res.json([]);
        }
        
        const questions = await Question.find(query).sort({ createdAt: -1 });
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

// Get random question by type, excluding drawn questions
export const getRandomQuestion = async (req, res) => {
    try {
        const { type, excludeIds = [] } = req.body;

        if (!type) {
            return res.status(400).json({ error: 'Type is required' });
        }

        // Map type to lowercase
        const typeMap = {
            'TRUTH': 'truth',
            'DARE': 'dare',
            'LUCKY': 'lucky',
            'truth': 'truth',
            'dare': 'dare',
            'lucky': 'lucky'
        };
        const normalizedType = typeMap[type] || type.toLowerCase();

        // Build query: find questions of this type that are not drawn and not in excludeIds
        const query = {
            type: normalizedType,
            isDrawn: false
        };

        // Exclude specific question IDs if provided
        if (excludeIds && excludeIds.length > 0) {
            query._id = { $nin: excludeIds };
        }

        // Get random question
        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: 1 } }
        ]);

        if (!questions || questions.length === 0) {
            // If no undrawn questions, try to get from the other type (truth <-> dare)
            // Only fallback for truth and dare, not for lucky
            const fallbackType = normalizedType === 'truth' ? 'dare' : normalizedType === 'dare' ? 'truth' : null;
            
            if (fallbackType) {
                const fallbackQuery = {
                    type: fallbackType,
                    isDrawn: false
                };
                
                if (excludeIds && excludeIds.length > 0) {
                    fallbackQuery._id = { $nin: excludeIds };
                }
                
                const fallbackQuestions = await Question.aggregate([
                    { $match: fallbackQuery },
                    { $sample: { size: 1 } }
                ]);
                
                if (fallbackQuestions && fallbackQuestions.length > 0) {
                    // Return fallback question
                    return res.json({ question: fallbackQuestions[0] });
                }
                
                // If fallback also has no questions, check if both types are exhausted
                // Only reset if BOTH types are exhausted
                const truthCount = await Question.countDocuments({ type: 'truth', isDrawn: false });
                const dareCount = await Question.countDocuments({ type: 'dare', isDrawn: false });
                
                if (truthCount === 0 && dareCount === 0) {
                    // Both types exhausted, reset both
                    await Question.updateMany(
                        { type: { $in: ['truth', 'dare'] } },
                        { $set: { isDrawn: false } }
                    );
                    
                    // Try again with original type after reset
                    const retryQuery = {
                        type: normalizedType,
                        isDrawn: false
                    };
                    
                    if (excludeIds && excludeIds.length > 0) {
                        retryQuery._id = { $nin: excludeIds };
                    }
                    
                    const retryQuestions = await Question.aggregate([
                        { $match: retryQuery },
                        { $sample: { size: 1 } }
                    ]);
                    
                    if (retryQuestions && retryQuestions.length > 0) {
                        return res.json({ question: retryQuestions[0] });
                    }
                } else {
                    // One type exhausted but other still has questions, return fallback even if empty
                    // This should not happen, but handle gracefully
                    return res.status(404).json({ error: `No questions available. ${normalizedType} exhausted, ${fallbackType} also exhausted.` });
                }
            }
            
            // For lucky or other types, just return error
            return res.status(404).json({ error: 'No questions found for this type' });
        }

        res.json({ question: questions[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark question as drawn
export const markAsDrawn = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByIdAndUpdate(
            id,
            { $set: { isDrawn: true } },
            { new: true }
        );

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.json({ success: true, question });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get question counts by type (total and drawn)
export const getQuestionCounts = async (req, res) => {
    try {
        const counts = await Question.aggregate([
            {
                $group: {
                    _id: '$type',
                    total: { $sum: 1 },
                    drawn: {
                        $sum: {
                            $cond: [{ $eq: ['$isDrawn', true] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        // Format response
        const result = {
            truth: { total: 0, drawn: 0 },
            dare: { total: 0, drawn: 0 },
            lucky: { total: 0, drawn: 0 }
        };

        counts.forEach(item => {
            const type = item._id;
            if (result[type]) {
                result[type] = {
                    total: item.total,
                    drawn: item.drawn
                };
            }
        });

        res.json(result);
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
