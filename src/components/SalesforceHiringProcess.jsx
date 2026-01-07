import { CheckCircle, XCircle, Clock, Users, Code, FileText, MessageSquare, ExternalLink, AlertCircle, Lightbulb, Target, BookOpen, Calendar, HelpCircle } from 'lucide-react'

function SalesforceHiringProcess() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-salesforce-blue to-blue-600 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Salesforce Hiring Process</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Congratulations on beginning the interview process with the Salesforce engineering team! 
          This guide will help you maximize your success in upcoming interviews.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Table of Contents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="#pre-interview" className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Pre-Interview Prep
          </a>
          <a href="#interview-process" className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Interview Process & Expectations
          </a>
          <a href="#post-interview" className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Post Interview Next Steps
          </a>
          <a href="#faq" className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            FAQs
          </a>
          <a href="#job-description" className="text-salesforce-blue hover:text-salesforce-dark-blue hover:underline flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Job Description
          </a>
        </div>
      </div>

      {/* Pre-Interview Prep */}
      <section id="pre-interview" className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Pre-Interview Prep: Interviewing Tips + Tricks
        </h2>
        <p className="text-gray-700 dark:text-slate-300 mb-6">
          Now that you've landed your interview, let's get ready to ace it! Using the below strategies — 
          focusing on clear communication, impactful storytelling, technical preparedness, genuine engagement, 
          and authentic self-presentation — you'll effectively answer our questions and underscore why you're 
          the right candidate for the job.
        </p>

        {/* Before the Interview */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Before the Interview: Your Preparation Checklist
          </h3>
          
          <div className="space-y-4">
            <div className="bg-salesforce-light-blue dark:bg-slate-700/50 border-l-4 border-salesforce-blue p-4 rounded">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2">1. Know Your Story & Skills:</h4>
              <ul className="space-y-2 text-gray-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Deep Dive into Your Resume:</strong> Be ready to articulate your experience with relevant, quantifiable data, specifically tailored to the requirements of the role (refer to the Job Description!).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Master the STAR Method:</strong> Prepare concise and insightful stories using the Situation, Task, Action, Result format to effectively answer behavioral questions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Refresh Technical Skills:</strong> Practice explaining your design or coding process clearly. Be prepared to ask clarifying questions if you encounter a technical challenge during the interview.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-slate-700/50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2">2. Understand the Company & the People: Do Your Salesforce Homework!</h4>
              <ul className="space-y-2 text-gray-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Salesforce Knowledge is Key:</strong> Demonstrate genuine interest by doing your homework to understand our values, recent projects, and mission. Remember, researching us helps you determine if we're a great fit for you too!</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Know Your Audience:</strong> Check out your interviewer on LinkedIn to gain insights into their background</span>
                </li>
              </ul>
              <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-blue-200 dark:border-slate-600">
                <p className="text-sm font-semibold text-salesforce-dark-blue dark:text-white mb-2">Check out these resources:</p>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-salesforce-blue" />
                    <a href="#" className="text-salesforce-blue hover:underline">Hear about the Salesforce Community</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-salesforce-blue" />
                    <a href="#" className="text-salesforce-blue hover:underline">Get up to speed on all things Agentforce</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-salesforce-blue" />
                    <a href="#" className="text-salesforce-blue hover:underline">Review our benefits and perks</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-salesforce-blue" />
                    <a href="#" className="text-salesforce-blue hover:underline">Understand the engineering team</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-slate-700/50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2">3. Prepare for a Strong Interview:</h4>
              <ul className="space-y-2 text-gray-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Review the Job Description:</strong> linked here!</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Create Thoughtful Questions:</strong> Have at least 5 insightful questions prepared to ask the interviewer, showcasing your curiosity about the role, team, and Salesforce</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Bring Your Energy:</strong> Approach each interview with genuine enthusiasm and a positive attitude</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Be Authentic:</strong> Remember that your unique passion and personality are valuable assets. Be yourself! Salesforce is generally a smart casual dress environment — we encourage you to show up in what makes you feel confident and comfortable</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-slate-700/50 border-l-4 border-amber-500 p-4 rounded">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                4. AI Usage, Technology & Presentation Readiness (for Virtual Interviews):
              </h4>
              <p className="text-gray-700 dark:text-slate-300 mb-3">During your job application and interview process it's important to:</p>
              <ul className="space-y-2 text-gray-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Check The Tech:</strong> Ensure you have a strong and stable internet connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Respect and Maintain The Interview Environment:</strong> Do not use AI assistance (or record/transcribe) in the interview unless it is for an accessibility accommodation or explicitly permitted by your recruiter</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Prioritize Honesty:</strong> Use AI for preparation (i.e. resume refinement and practice questions), but ensure all submitted information accurately represents your own skills and experiences. Avoid misrepresenting yourself in any way.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Process & Expectations */}
      <section id="interview-process" className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Interview Process & Expectations
        </h2>
        
        <div className="bg-blue-50 dark:bg-slate-700/50 border-l-4 border-blue-500 p-4 rounded mb-6">
          <p className="text-gray-700 dark:text-slate-300">
            <strong>Overview:</strong> The hiring process at Salesforce prioritizes top talent. Interviews will involve engineers 
            and leaders from various teams, and team assignments occur after all interview rounds are complete. 
            You may not meet potential teammates or your potential team's hiring manager during the interviews.
          </p>
        </div>

        {/* Round 1 */}
        <div className="mb-6 p-5 bg-gradient-to-r from-salesforce-light-blue to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">Round 1: Informational and Behavioral interview</h3>
          </div>
          <p className="text-gray-700 dark:text-slate-300 mb-3 font-semibold">What to Expect:</p>
          <ul className="space-y-2 text-gray-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>45-minute video interview with a Salesforce Hiring Manager (they may be from any team in the company)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Learn more about Salesforce – our exciting projects and initiatives</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Go over your background, previous projects, skillset, interest</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Some technical questions might be asked, but no coding or screen sharing is expected</span>
            </li>
          </ul>
        </div>

        {/* Round 2 */}
        <div className="mb-6 p-5 bg-gradient-to-r from-salesforce-light-blue to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">Round 2: Technical HackerRank Assessment</h3>
          </div>
          <p className="text-gray-700 dark:text-slate-300 mb-3 font-semibold">What to Expect:</p>
          <ul className="space-y-2 text-gray-700 dark:text-slate-300 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>The HackerRank Assessment is a remote test taken at home</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>You will have 60–75 minutes to complete the timed assessment, which will need to be completed in one sitting (no pausing)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Feel free to take the assessment after hours or on the weekend (whatever works best with your schedule)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>The test link will expire 7 days from receipt of the link. If you need additional time, reach out to your recruiter</span>
            </li>
          </ul>
          
          <div className="bg-amber-50 dark:bg-slate-900/50 border border-amber-200 dark:border-amber-800 rounded p-3 mb-4">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Important:
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              The HackerRank Technical Assessment is sent to you in a separate email. If you haven't received the email, 
              please check your spam folder and let your recruiter know as soon as possible.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 dark:text-slate-300 mb-3 font-semibold">Review the below criteria to understand how you'll be assessed:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-slate-600">
                <p className="font-semibold text-salesforce-dark-blue dark:text-white mb-1">Correctness</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Does the test compile and return the correct output?</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-slate-600">
                <p className="font-semibold text-salesforce-dark-blue dark:text-white mb-1">Scalability and Efficiency</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Does the result repeatedly apply a cost-effective strategy for extending its capacity? Does the approach taken use the fewest needed steps or the shorter paths?</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-slate-600">
                <p className="font-semibold text-salesforce-dark-blue dark:text-white mb-1">Design & Style</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Is the overall design well suited to solving the problem and the codes are easy to read and follow the standard coding best practices and styles?</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-slate-600">
                <p className="font-semibold text-salesforce-dark-blue dark:text-white mb-1">Quality Mindset</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Are there any automated tests written? Are codes written in a testable way?</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
              <h4 className="font-bold text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                DO's
              </h4>
              <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
                <li>• Use the programming language of your choice</li>
                <li>• Familiarize yourself with HackerRank and try our Sample Test</li>
                <li>• Solve the problem first, and then iterate on the solution (if needed)</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4">
              <h4 className="font-bold text-red-900 dark:text-red-200 mb-2 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                DON'Ts
              </h4>
              <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                <li>• Over think (or do) it</li>
                <li>• Get worried if you lose internet connectivity, preventing you from having the full duration.</li>
                <li>• Phone a friend (or ask anyone to help you design or write your solution)</li>
                <li>• Plagiarize another's code. You'll be automatically disqualified</li>
                <li>• Include object files or executables</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Round 3 */}
        <div className="mb-6 p-5 bg-gradient-to-r from-salesforce-light-blue to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">Round 3: Virtual Technical / Behavioral Interviews</h3>
          </div>
          <p className="text-gray-700 dark:text-slate-300 mb-3 font-semibold">What to Expect:</p>
          <ul className="space-y-2 text-gray-700 dark:text-slate-300 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>2 separate 60-minute panel interviews</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Each round will focus on technical skills and a few behavioral questions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Interviews may include live coding, technical Q&A or a combination of both</span>
            </li>
          </ul>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-slate-600">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Session 1: Systems Design + Architecture/Data Concepts
              </h4>
              <p className="text-gray-700 dark:text-slate-300">
                <strong>Overview:</strong> Candidates will showcase their ability to lay out data in a way that balances 
                the performance requirements for reads, writes, and deprecation.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-slate-600">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Session 2: Front End Development
              </h4>
              <p className="text-gray-700 dark:text-slate-300">
                <strong>Overview:</strong> Candidates will demonstrate their front-end development expertise, including best 
                practices and effective application in solutions. They will be assessed on efficient coding (language/design), 
                problem anticipation, and clear articulation of their technology-agnostic problem-solving process.
              </p>
            </div>
          </div>
        </div>

        {/* Round 4 */}
        <div className="mb-6 p-5 bg-gradient-to-r from-salesforce-light-blue to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-salesforce-blue text-white flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h3 className="text-xl font-bold text-salesforce-dark-blue dark:text-white">Round 4: Onsite Technical and Behavioral Panels</h3>
            <span className="text-sm bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 px-2 py-1 rounded">Held every Tuesday and Wednesday</span>
          </div>
          <p className="text-gray-700 dark:text-slate-300 mb-3 font-semibold">What to Expect:</p>
          <ul className="space-y-2 text-gray-700 dark:text-slate-300 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>2 separate 60-minute panel interviews</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Each round will focus on technical skills and a few behavioral questions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
              <span>Interviews may include live coding, technical Q&A or a combination of both</span>
            </li>
          </ul>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-slate-600">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Session 1: Algorithms & Data Structures & OO Design
              </h4>
              <p className="text-gray-700 dark:text-slate-300">
                <strong>Overview:</strong> Candidates will be evaluated on their mastery of algorithms and data structures 
                in addition to their ability to apply them effectively in problem-solving. They will demonstrate their skills 
                in selecting the optimal and simplest algorithm, implementing it efficiently, anticipating potential issues, 
                and clearly communicating their abstract thought-process.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-slate-600">
              <h4 className="font-bold text-salesforce-dark-blue dark:text-white mb-2 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Session 2: Domain/Architecture
              </h4>
              <p className="text-gray-700 dark:text-slate-300">
                <strong>Overview:</strong> Candidates will be assessed on their ability to architect and articulate complex 
                system designs. They will demonstrate proficiency in key engineering best practices, including accessibility, 
                fault tolerance, concurrency, reusability, extensibility, API design, database modeling, maintainability, 
                security, scalability, testability, and overall software quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Post Interview Next Steps */}
      <section id="post-interview" className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          Post Interview Next Steps
        </h2>
        <p className="text-gray-700 dark:text-slate-300 mb-4">
          After completing your interviews, here's what happens next in the process.
        </p>
      </section>

      {/* FAQs */}
      <section id="faq" className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          FAQs
        </h2>
        <div className="space-y-4">
          <div className="bg-salesforce-light-blue dark:bg-slate-700/50 border-l-4 border-salesforce-blue p-4 rounded">
            <h3 className="font-bold text-salesforce-dark-blue dark:text-white mb-2">
              When will I hear back with an offer decision?
            </h3>
            <p className="text-gray-700 dark:text-slate-300">
              It typically takes 2-3 business days to gather all the feedback from the interviewers with a decision! 
              Afterwards, your recruiter will reach out to provide and update and discuss next steps.
            </p>
          </div>

          <div className="bg-salesforce-light-blue dark:bg-slate-700/50 border-l-4 border-salesforce-blue p-4 rounded">
            <h3 className="font-bold text-salesforce-dark-blue dark:text-white mb-2">
              How will my level be determined?
            </h3>
            <p className="text-gray-700 dark:text-slate-300">
              This is determined after all interviews have been completed!
            </p>
          </div>

          <div className="bg-salesforce-light-blue dark:bg-slate-700/50 border-l-4 border-salesforce-blue p-4 rounded">
            <h3 className="font-bold text-salesforce-dark-blue dark:text-white mb-2">
              Which team will I be on?
            </h3>
            <p className="text-gray-700 dark:text-slate-300">
              After you have successfully completed the 3 rounds, we will set you to meet with the manager of your 
              assigned team for an informational call!
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-700/50 border border-blue-200 dark:border-slate-600 rounded">
          <p className="text-gray-700 dark:text-slate-300">
            <strong>Please know that our Salesforce recruiting team is here to support you on your interview journey!</strong> 
            If you have any additional questions or concerns, please don't hesitate to reach out!
          </p>
        </div>
      </section>

      {/* Job Description */}
      <section id="job-description" className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-salesforce-dark-blue dark:text-white mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Job Description
        </h2>
        
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 dark:text-slate-300 mb-4">
              Salesforce has immediate opportunities for experienced software developers who want their lines of code to have 
              significant and measurable positive impact for users, the company's bottom line, and the industry. You will be 
              working with a group of world-class engineers to build the breakthrough features our customers will love, adopt, 
              and use while keeping our trusted CRM platform stable and scalable. The software engineer role at Salesforce 
              encompasses architecture, design, implementation, and testing to ensure we build products right and release them 
              with high quality.
            </p>
            <p className="text-gray-700 dark:text-slate-300 mb-4">
              We pride ourselves on writing high quality, maintainable code that strengthens the stability of the product and 
              makes our lives easier. We embrace the hybrid model and celebrate the individual strengths of each team member 
              while cultivating everyone on the team to grow into the best version of themselves. We believe that autonomous 
              teams with the freedom to make decisions will empower the individuals, the product, the company, and the 
              customers they serve to thrive.
            </p>
          </div>

          <div className="bg-salesforce-light-blue dark:bg-slate-700/50 border-l-4 border-salesforce-blue p-4 rounded">
            <h3 className="font-bold text-salesforce-dark-blue dark:text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Your Impact:
            </h3>
            <p className="text-gray-700 dark:text-slate-300 mb-3">
              Our ideal candidate is passionate about crafting a new product to serve thousands of enterprise customers by using 
              innovative technology and striving for the best quality and throughput. As part of this role, you will:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
                <span>Architect, design, implement, test and deliver highly scalable products</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
                <span>Master our development process, culture and code base, then improve it</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
                <span>Operate optimally in the hybrid engineering model where engineers are encouraged to be able to craft and complete the vital work to ensure quality in their own code as well as other engineers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
                <span>Mentor others in development technologies, tools, and processes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
                <span>Present your own designs to internal/external groups and review designs of others</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
                <span>Develop test strategies, design automation frameworks, write unit/functional tests to drive up code coverage and automation metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-salesforce-blue flex-shrink-0 mt-0.5" />
                <span>Participate in the team's on-call rotation to address sophisticated problems in real-time and keep services operational and highly available</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-bold text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Required Skills:
              </h3>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>A related technical degree required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>4+ years of professional software development experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Deep knowledge of object oriented programming and experience with at least one object oriented programming language (Java, Javascript, C++, C#, Ruby, Python)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>High proficiency in at least one high-level programming language and web framework (NodeJS, Express, Hapi, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Proven understanding of web technologies, such as JavaScript, CSS, HTML5, XML, JavaScript, JSON, and/or Ajax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Validated understanding of Database technologies such as SQL, PL/SQL and relational database schema design</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Experience in automated testing including unit and functional testing using Java, JUnit, JSUnit, Selenium</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Excellent interpersonal skills</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Preferred Skills:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Experience building highly scalable web applications.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Experience with Agile software development and test-driven development.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Bachelor's degree in Computer Science or equivalent field</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Track record of being a top performer in current and past roles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SalesforceHiringProcess
