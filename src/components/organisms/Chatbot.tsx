'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User } from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

const FAQ_DATA = [
  // General Platform Questions
  {
    question: "What is Rate My Employee?",
    answer: "Rate My Employee is a comprehensive platform that helps businesses improve customer service by collecting real-time feedback on employee performance. We combine employee ratings, performance analytics, and smart recruitment to transform service quality across India."
  },
  {
    question: "How does the platform work?",
    answer: "Our platform works in three simple steps: 1) Customers rate employees through QR codes or direct links, 2) Real-time analytics show performance trends and insights, 3) Businesses use this data to improve training, recognize top performers, and make better hiring decisions."
  },
  {
    question: "What industries do you serve?",
    answer: "We serve restaurants, retail stores, hotels, healthcare facilities, banks, government offices, and any business that wants to improve customer service. Our platform is designed to work across all service-oriented industries in India."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely! We use enterprise-grade security with data encryption, secure servers, and comply with all data protection regulations. Your employee and customer data is protected with the highest security standards."
  },
  
  // Business Owner Questions
  {
    question: "How can this help my business?",
    answer: "Rate My Employee helps your business by: identifying top performers for recognition, spotting training needs, improving customer satisfaction, reducing employee turnover, making data-driven hiring decisions, and ultimately increasing revenue through better service quality."
  },
  {
    question: "What analytics do I get?",
    answer: "You get comprehensive analytics including: individual employee performance scores, customer satisfaction trends, peak performance times, customer feedback insights, team comparisons, and actionable recommendations for improvement."
  },
  {
    question: "How quickly can I see results?",
    answer: "You can start collecting feedback immediately after setup (under 10 minutes). Most businesses see meaningful insights within the first week, and significant service improvements within 30 days of implementation."
  },
  {
    question: "Can I customize the feedback forms?",
    answer: "Yes! You can customize rating criteria, add specific questions, choose rating scales, and tailor the feedback experience to match your business needs and industry requirements."
  },
  
  // Employee Questions
  {
    question: "How does this benefit employees?",
    answer: "Employees benefit through: recognition for good performance, clear feedback on areas to improve, fair evaluation based on customer input, opportunities for growth and development, and a transparent performance system."
  },
  {
    question: "Is the feedback anonymous?",
    answer: "Yes, customer feedback is completely anonymous. This ensures honest feedback while protecting both customers and employees. Employees see their overall performance data but not individual customer comments."
  },
  {
    question: "How often do I get feedback?",
    answer: "Feedback is collected in real-time whenever customers interact with you. You can view your performance dashboard anytime to see your current ratings, trends, and areas for improvement."
  },
  {
    question: "Can I see my performance history?",
    answer: "Yes! You have access to your personal dashboard showing your performance history, improvement trends, customer feedback patterns, and your ranking within your team."
  },
  
  // Employer/HR Questions
  {
    question: "How does this help with recruitment?",
    answer: "Our platform helps identify top performers for internal promotions, provides data-driven insights for hiring decisions, shows which employees excel in customer service, and helps create better job descriptions based on successful employee traits."
  },
  {
    question: "Can I track team performance?",
    answer: "Absolutely! You get team-level analytics, department comparisons, manager dashboards, and insights into which teams or locations are performing best. This helps with resource allocation and management decisions."
  },
  {
    question: "How do I handle poor performers?",
    answer: "The platform provides objective data to identify performance issues early. You can use this for targeted training, performance improvement plans, or making informed decisions about employee development or transitions."
  },
  {
    question: "Can I integrate with existing HR systems?",
    answer: "Yes! We offer integrations with popular HR systems, payroll software, and performance management tools. Our API allows seamless data flow between systems for comprehensive employee management."
  },
  
  // Industry Problem Statements
  {
    question: "What problems does this solve?",
    answer: "We solve India's ₹4,550 Cr customer service crisis by: reducing the 90% of Indians who face poor service, saving the 15B+ hours wasted yearly on bad service, addressing the $55B economic loss, and improving the 48% who report poor customer experience."
  },
  {
    question: "Why is customer service so bad in India?",
    answer: "Poor customer service in India stems from: lack of real-time feedback systems, no performance tracking, inadequate training programs, poor employee recognition, and disconnect between customer satisfaction and employee evaluation. Our platform addresses all these issues."
  },
  {
    question: "How does this help restaurants?",
    answer: "Restaurants benefit by: improving table service quality, reducing customer complaints, identifying best servers for better shifts, training staff on specific improvement areas, and increasing customer retention through better dining experiences."
  },
  {
    question: "How does this help retail stores?",
    answer: "Retail stores can: improve customer assistance quality, reduce checkout issues, identify top sales associates, train staff on customer interaction, and increase sales through better customer service and satisfaction."
  },
  {
    question: "How does this help healthcare?",
    answer: "Healthcare facilities can: improve patient care quality, reduce patient complaints, identify compassionate staff, train on patient interaction, and enhance overall patient satisfaction and care outcomes."
  },
  
  // Pricing and Setup
  {
    question: "What are your pricing plans?",
    answer: "We offer flexible pricing starting with a free trial. Our plans are designed to scale with your business size. Contact us for custom pricing based on your number of employees and specific needs. No setup fees, cancel anytime."
  },
  {
    question: "How long does setup take?",
    answer: "Setup takes under 10 minutes! Simply add your employees, customize your feedback forms, and start collecting feedback immediately. Our guided onboarding process makes it incredibly easy to get started."
  },
  {
    question: "Do I need technical expertise?",
    answer: "Not at all! Our platform is designed for non-technical users. The interface is intuitive, and we provide step-by-step guidance. If you need help, our support team is always available to assist you."
  },
  {
    question: "Can I try before buying?",
    answer: "Yes! We offer a free trial with full access to all features. No credit card required. You can test the platform with your team and see real results before making any commitment."
  }
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi there! 👋 I'm here to help you learn about Rate My Employee. Ask me about our features, how it helps different industries, or how to get started with improving your customer service!",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const findBestAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    for (const faq of FAQ_DATA) {
      const keywords = faq.question.toLowerCase().split(' ')
      const questionWords = lowerQuestion.split(' ')
      
      const matchCount = keywords.filter(keyword => 
        questionWords.some(word => word.includes(keyword) || keyword.includes(word))
      ).length
      
      if (matchCount >= 2) {
        return faq.answer
      }
    }
    
    // Default responses for common queries
    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('plan')) {
      return "We offer flexible pricing plans starting with a free trial. Our plans scale with your business size and include all features. Contact us for custom pricing based on your specific needs. No setup fees, cancel anytime!"
    }
    
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('support') || lowerQuestion.includes('help')) {
      return "We're here to help! You can reach our support team through the contact form on our website or email us directly. We also offer live chat support and dedicated account managers for enterprise customers."
    }
    
    if (lowerQuestion.includes('demo') || lowerQuestion.includes('trial') || lowerQuestion.includes('free')) {
      return "Absolutely! Start with our free trial—no credit card required. You get full access to all features and can start collecting feedback immediately. Setup takes under 10 minutes, and you'll see results within the first week!"
    }
    
    if (lowerQuestion.includes('business') || lowerQuestion.includes('company') || lowerQuestion.includes('employer')) {
      return "For businesses, Rate My Employee helps improve customer service by providing real-time feedback on employee performance. You'll get analytics, identify top performers, spot training needs, and make data-driven decisions to boost customer satisfaction and revenue."
    }
    
    if (lowerQuestion.includes('employee') || lowerQuestion.includes('staff') || lowerQuestion.includes('worker')) {
      return "For employees, our platform provides fair, anonymous feedback from customers, helps you track your performance, identifies areas for improvement, and ensures recognition for good work. It's designed to help you grow and excel in customer service."
    }
    
    if (lowerQuestion.includes('industry') || lowerQuestion.includes('restaurant') || lowerQuestion.includes('retail') || lowerQuestion.includes('healthcare')) {
      return "We serve all service-oriented industries including restaurants, retail, healthcare, hospitality, banking, and more. Our platform adapts to any industry where customer service quality matters. Each industry faces unique challenges that we help address."
    }
    
    if (lowerQuestion.includes('problem') || lowerQuestion.includes('crisis') || lowerQuestion.includes('issue')) {
      return "India faces a ₹4,550 Cr customer service crisis with 90% of people experiencing poor service, 15B+ hours wasted yearly, and $55B in economic loss. Our platform directly addresses these issues by improving service quality through real-time feedback and performance management."
    }
    
    if (lowerQuestion.includes('feature') || lowerQuestion.includes('analytics') || lowerQuestion.includes('dashboard')) {
      return "Our key features include: real-time feedback collection, comprehensive analytics dashboards, performance tracking, team comparisons, customer satisfaction insights, customizable feedback forms, mobile app access, and integration with existing HR systems."
    }
    
    return "I'd be happy to help! Rate My Employee is a platform that helps businesses improve customer service through real-time employee feedback and performance analytics. We serve restaurants, retail, healthcare, and other service industries. What would you like to know more about?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = findBestAnswer(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "What is Rate My Employee?",
    "How does this help my business?",
    "What industries do you serve?",
    "How quickly can I see results?"
  ]

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.05 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: [
              "0 10px 25px rgba(124, 58, 237, 0.4)",
              "0 15px 35px rgba(124, 58, 237, 0.6)",
              "0 10px 25px rgba(124, 58, 237, 0.4)"
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Image
            src="/bot.jpeg"
            alt="Rate My Employee Chat"
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-full"
            priority
            onError={(e) => {
              console.log('Bot icon failed to load, using fallback')
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'block'
            }}
          />
          {/* Fallback icon */}
          <div className="hidden w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
        </motion.button>
        
        {/* Text Label */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          Ask about RME
        </motion.div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center p-1">
                  <Image
                    src="/bot.jpeg"
                    alt="Rate My Employee"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain rounded"
                  />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">Rate My Employee</h3>
                  <p className="text-gray-600 text-xs">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-violet-600' 
                        : 'bg-gradient-to-r from-violet-600 to-purple-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Image
                          src="/bot.jpeg"
                          alt="Bot"
                          width={16}
                          height={16}
                          className="w-4 h-4 object-contain rounded"
                        />
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center p-1">
                      <Image
                        src="/bot.jpeg"
                        alt="Bot"
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain rounded"
                      />
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-900 border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-gray-200">
                <p className="text-gray-600 text-xs mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs rounded-full border border-violet-200 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Rate My Employee..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
