import { ArrowRight, BookOpen, GraduationCap, Sparkles, MessageSquare, Target, CheckCircle, ExternalLink, BarChart3, Code, Database, Bookmark, Info } from 'lucide-react'

function About() {
  const navigateToSection = (sectionId) => {
    window.dispatchEvent(new CustomEvent('navigate', { 
      detail: { section: sectionId } 
    }))
  }
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-salesforce-dark-blue mb-2">
              About This App
            </h2>
            <p className="text-salesforce-gray">
              Your comprehensive Salesforce interview preparation dashboard. Learn how to use it effectively below.
            </p>
          </div>
          <button
            onClick={() => navigateToSection('dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-salesforce-blue text-white rounded-lg hover:bg-salesforce-dark-blue transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            View Dashboard
          </button>
        </div>
      </div>

      {/* Workflow Diagram */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-salesforce-dark-blue mb-6">
          Recommended Learning Workflow
        </h3>
        
        {/* Workflow Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-6 h-6 text-salesforce-blue" />
                <button
                  onClick={() => navigateToSection('study-guide')}
                  className="font-bold text-lg text-salesforce-dark-blue hover:text-salesforce-blue transition-colors flex items-center gap-2"
                >
                  Start with Study Guide
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-700 mb-3">
                Review the Round 3 study plan. Understand what topics you need to master for each interview session.
              </p>
              <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-3 rounded">
                <p className="text-sm text-salesforce-dark-blue">
                  <strong>Tip:</strong> Check off items as you complete them to track your progress.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-salesforce-gray" />
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6 text-salesforce-blue" />
                <button
                  onClick={() => navigateToSection('lessons')}
                  className="font-bold text-lg text-salesforce-dark-blue hover:text-salesforce-blue transition-colors flex items-center gap-2"
                >
                  Deep Dive with Lessons
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-700 mb-3">
                Click "View Lesson" on any Study Guide topic to access comprehensive, concise lessons. Each lesson is designed to be completed in 10-18 minutes.
              </p>
              <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-3 rounded">
                <p className="text-sm text-salesforce-dark-blue">
                  <strong>Tip:</strong> Lessons include code examples, key takeaways, and interview-focused content.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-salesforce-gray" />
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-salesforce-blue" />
                <h4 className="font-bold text-lg text-salesforce-dark-blue">
                  Practice & Apply
                </h4>
              </div>
              <p className="text-gray-700 mb-3">
                Use the interactive tools to reinforce learning:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3 ml-4">
                <li>
                  <button
                    onClick={() => navigateToSection('js-trivia')}
                    className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline"
                  >
                    <strong>JS Trivia Lab:</strong>
                  </button> Interactive playgrounds for closures, event loop, pure functions
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('scheduling')}
                    className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline"
                  >
                    <strong>Scheduling Architect:</strong>
                  </button> Design schemas and understand concurrency patterns
                </li>
                <li>
                  <button
                    onClick={() => navigateToSection('frontend-fundamentals')}
                    className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline"
                  >
                    <strong>Frontend Fundamentals:</strong>
                  </button> Master core JavaScript and React concepts
                </li>
              </ul>
              <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-3 rounded">
                <p className="text-sm text-salesforce-dark-blue">
                  <strong>Tip:</strong> Hands-on practice helps concepts stick better than just reading.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-salesforce-gray" />
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-6 h-6 text-salesforce-blue" />
                <button
                  onClick={() => navigateToSection('interview-questions')}
                  className="font-bold text-lg text-salesforce-dark-blue hover:text-salesforce-blue transition-colors flex items-center gap-2"
                >
                  Review Interview Questions
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-700 mb-3">
                Study real interview questions from Salesforce. Filter by category (System Design, Frontend, etc.) or source (Glassdoor, LeetCode).
              </p>
              <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-3 rounded">
                <p className="text-sm text-salesforce-dark-blue">
                  <strong>Tip:</strong> Try to answer before expanding to see the solution. This builds recall.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-salesforce-gray" />
          </div>

          {/* Step 5 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              5
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-salesforce-blue" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateToSection('ai-tutor')}
                    className="font-bold text-lg text-salesforce-dark-blue hover:text-salesforce-blue transition-colors flex items-center gap-2"
                  >
                    Ask AI Tutor
                  </button>
                  <span className="text-gray-400">&</span>
                  <button
                    onClick={() => navigateToSection('quizzer')}
                    className="font-bold text-lg text-salesforce-dark-blue hover:text-salesforce-blue transition-colors flex items-center gap-2"
                  >
                    Test Knowledge
                  </button>
                  <ExternalLink className="w-4 h-4 text-salesforce-gray" />
                </div>
              </div>
              <p className="text-gray-700 mb-3">
                Use AI Tutor to clarify concepts or ask follow-up questions. Save important Q&As for review. Test yourself with Active Recall Quizzer flashcards.
              </p>
              <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-3 rounded">
                <p className="text-sm text-salesforce-dark-blue">
                  <strong>Tip:</strong> Save questions you struggle with and review them regularly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Workflow Diagram */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-salesforce-dark-blue mb-6">
          Quick Reference Workflow
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Learning Path */}
          <div className="space-y-3">
            <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue p-4 rounded">
              <h4 className="font-bold text-salesforce-dark-blue mb-2">Learning Path</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Study Guide → Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Practice with Interactive Tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Review Interview Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Test with Flashcards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Support Tools */}
          <div className="space-y-3">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
              <h4 className="font-bold text-salesforce-dark-blue mb-2">Support Tools</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-salesforce-blue" />
                  <span>AI Tutor for clarifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-salesforce-blue" />
                  <span>Saved Questions for review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-salesforce-blue" />
                  <span>Frontend Fundamentals for JS/React</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Guide - Organized by Groups */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-salesforce-dark-blue mb-4">
          Section Guide
        </h3>
        <p className="text-sm text-salesforce-gray mb-6">
          Sections are organized into groups in the sidebar for easier navigation
        </p>
        
        <div className="space-y-6">
          {/* Getting Started Group */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Getting Started
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SectionCard
                title="About"
                description="Learn how to use this app effectively with workflow guides."
                icon={Info}
                sectionId="about"
              />
              <SectionCard
                title="Dashboard"
                description="Monitor your progress and get AI-recommended daily study schedules."
                icon={BarChart3}
                sectionId="dashboard"
              />
            </div>
          </div>

          {/* Study Materials Group */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Study Materials
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <SectionCard
                title="Study Guide"
                description="Your roadmap for Round 3 interviews. Track progress and access resources."
                icon={GraduationCap}
                sectionId="study-guide"
              />
              <SectionCard
                title="Lessons"
                description="Comprehensive lessons for each topic. 10-18 min per lesson."
                icon={BookOpen}
                sectionId="lessons"
              />
              <SectionCard
                title="Interview Questions"
                description="Real Salesforce interview questions with detailed answers."
                icon={MessageSquare}
                sectionId="interview-questions"
              />
            </div>
          </div>

          {/* Practice Tools Group */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3 flex items-center gap-2">
              <Code className="w-4 h-4" />
              Practice Tools
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <SectionCard
                title="Frontend Fundamentals"
                description="Master JavaScript and React concepts with interactive examples."
                icon={Target}
                sectionId="frontend-fundamentals"
              />
              <SectionCard
                title="JS Trivia Lab"
                description="Interactive playgrounds: closures, event loop, pure functions."
                icon={Code}
                sectionId="js-trivia"
              />
              <SectionCard
                title="Scheduling Architect"
                description="Design database schemas and understand concurrency patterns."
                icon={Database}
                sectionId="scheduling"
              />
              <SectionCard
                title="Active Recall Quizzer"
                description="Flashcards for Salesforce topics: LDV, Data Skew, CSS Grid, INP."
                icon={BookOpen}
                sectionId="quizzer"
              />
            </div>
          </div>

          {/* AI Assistance Group */}
          <div>
            <h4 className="font-semibold text-salesforce-dark-blue mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Assistance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SectionCard
                title="AI Tutor"
                description="Ask questions, get categorized answers. Save important Q&As."
                icon={Sparkles}
                sectionId="ai-tutor"
              />
              <SectionCard
                title="Saved Questions"
                description="Review your saved Q&As from AI Tutor. Search and filter by category."
                icon={Bookmark}
                sectionId="saved-questions"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-salesforce-light-blue border-l-4 border-salesforce-blue rounded-lg p-6">
        <h3 className="text-xl font-bold text-salesforce-dark-blue mb-4">
          Best Practices
        </h3>
        <ul className="space-y-2 text-salesforce-dark-blue">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
            <span><strong>Follow the workflow:</strong> Don't skip steps. Each builds on the previous.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
            <span><strong>Practice actively:</strong> Use interactive tools, don't just read.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
            <span><strong>Save what you struggle with:</strong> Use AI Tutor and save difficult concepts.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
            <span><strong>Review regularly:</strong> Use flashcards and saved questions for spaced repetition.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
            <span><strong>Track progress:</strong> Use Study Guide checklists to see what you've mastered.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function SectionCard({ title, description, icon: Icon, sectionId }) {
  const navigateToSection = (sectionId) => {
    if (sectionId) {
      window.dispatchEvent(new CustomEvent('navigate', { 
        detail: { section: sectionId } 
      }))
    }
  }

  return (
    <button
      onClick={() => sectionId && navigateToSection(sectionId)}
      className={`w-full text-left bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-salesforce-blue transition-colors ${sectionId ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold text-salesforce-dark-blue mb-1 ${sectionId ? 'hover:text-salesforce-blue' : ''}`}>
              {title}
            </h4>
            {sectionId && <ExternalLink className="w-3 h-3 text-salesforce-gray" />}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  )
}

export default About
