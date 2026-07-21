const Course      = require('../models/Course')
const QuizAttempt = require('../models/QuizAttempt')

// @route  POST /api/ai/chat
const chat = async (req, res) => {
  try {
     console.log('AI chat hit', req.body)
    const { message, courseId, conversationHistory = [] } = req.body

    let courseContext = 'general programming'
    if (courseId) {
      const course = await Course.findById(courseId).select('title category')
      if (course) courseContext = `"${course.title}" (${course.category})`
    }

    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI tutor for the course ${courseContext} on LearnFlow LMS.
                  Only answer questions related to this course or general programming.
                  Be concise, friendly and beginner-friendly.
                  Use simple examples when explaining concepts.`
      },
      ...conversationHistory.slice(-6),
      { role: 'user', content: message }
    ]
 console.log('Calling Groq API...') 
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
       model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 500,
        temperature: 0.7
      })
    })
     console.log('Groq response status:', response.status)

    const data = await response.json()
    console.log('Groq data:', JSON.stringify(data))
    if (data.error) return res.status(500).json({ message: data.error.message })

    res.json({ reply: data.choices[0].message.content })

  } catch (err) {
    console.error('Groq Error:', err.message)
    res.status(500).json({ message: 'AI service error. Please try again.' })
  }
}

// @route  POST /api/ai/weak-topics
const analyseWeakTopics = async (req, res) => {
  try {
    const { courseId } = req.body

    const attempts = await QuizAttempt.find({
      student: req.user._id,
      course:  courseId,
    }).sort({ attemptedAt: -1 }).limit(10)

    if (attempts.length === 0) {
      return res.json({
        weakTopics: [],
        message: 'Complete at least one quiz to get topic analysis.',
      })
    }

    const topicStats = {}
    attempts.forEach(attempt => {
      attempt.answers.forEach(ans => {
        if (ans.topic) {
          if (!topicStats[ans.topic]) topicStats[ans.topic] = { correct: 0, total: 0 }
          topicStats[ans.topic].total++
          if (ans.isCorrect) topicStats[ans.topic].correct++
        }
      })
    })

    const weakTopics = Object.entries(topicStats)
      .filter(([, stats]) => (stats.correct / stats.total) < 0.6)
      .map(([topic, stats]) => ({
        topic,
        score: Math.round((stats.correct / stats.total) * 100),
      }))
      .sort((a, b) => a.score - b.score)

    res.json({ weakTopics })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { chat, analyseWeakTopics }