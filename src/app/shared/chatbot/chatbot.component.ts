import { TextToHtmlPipe } from '../../text-to-html.pipe';
import { Component, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
}

interface ChatResponse {
  message: string;
  followUp?: string[];
  quickActions?: QuickAction[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, TextToHtmlPipe],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ]),
    trigger('quickActionsAnimation', [
      transition(':enter', [
        query('.quick-action-btn', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(80, [
            animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
              style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ])
    ]),
    trigger('quickActionAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ChatbotComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  isOpen = false;
  isChatStarted = false;
  messages: Message[] = [];
  userInput = '';
  isTyping = false;
  unreadCount = 0;
  showQuickActions = true;
  currentQuickActions: QuickAction[] = [];
  shouldScrollToBottom = false;
  copiedMessageId: string | null = null;
  private copyTimeout: any;

  // Knowledge base for the chatbot
  private knowledgeBase = {
    greetings: {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'start', 'menu'],
      response: {
        message: '👋 Welcome to Embu County Revenue Authority!\n\nI\'m your virtual assistant, here to help you with:\n\n✅ Payment information\n✅ Business permits\n✅ Fee structures\n✅ Contact details\n✅ Office locations\n\nHow may I assist you today?',
        quickActions: [
          { id: 'payments', label: 'Payment Options', icon: '💳' },
          { id: 'permits', label: 'Business Permits', icon: '📋' },
          { id: 'contact', label: 'Contact Us', icon: '📞' },
          { id: 'services', label: 'Our Services', icon: '🏛️' }
        ]
      }
    },
    payments: {
      keywords: ['pay', 'payment', 'mpesa', 'bank', 'how to pay', 'paybill', 'transfer', 'money', 'pay now'],
      response: {
        message: '💰 **Payment Methods Available:**\n\n' +
                 '📱 **M-Pesa Paybill**\n' +
                 '   • Paybill Number: 800600\n' +
                 '   • Account: Your ID Number\n' +
                 '   • Instant confirmation via SMS\n\n' +
                 '🏦 **Bank Transfer**\n' +
                 '   • Bank: Kenya Commercial Bank\n' +
                 '   • Account: 1234567890\n' +
                 '   • Branch: Embu Town\n' +
                 '   • Swift Code: KCBLKENX\n\n' +
                 '💵 **Cash Payment**\n' +
                 '   • Visit our offices during working hours\n' +
                 '   • Ground Floor, County Headquarters\n' +
                 '   • Get instant receipt\n\n' +
                 '💡 *Tip: Save your payment receipts for future reference!*',
        quickActions: [
          { id: 'receipt', label: 'Payment Receipt', icon: '🧾' },
          { id: 'office', label: 'Office Location', icon: '📍' },
          { id: 'hours', label: 'Working Hours', icon: '🕒' }
        ]
      }
    },
    permits: {
      keywords: ['permit', 'license', 'business permit', 'registration', 'apply', 'application', 'sbp', 'trade license'],
      response: {
        message: '📋 **Business Permit Application Guide:**\n\n' +
                 '📄 **Required Documents:**\n' +
                 '   1. Copy of National ID/Passport\n' +
                 '   2. KRA PIN Certificate\n' +
                 '   3. Business Registration Certificate\n' +
                 '   4. Lease Agreement or Ownership Docs\n' +
                 '   5. Recent Passport Photo\n\n' +
                 '⚙️ **Application Process:**\n' +
                 '   Step 1: Fill application form\n' +
                 '   Step 2: Submit required documents\n' +
                 '   Step 3: Pay application fees\n' +
                 '   Step 4: Await inspection (if required)\n' +
                 '   Step 5: Collect your permit\n\n' +
                 '⏱️ **Processing Time:** 5-7 working days\n' +
                 '✅ **Validity:** 12 months from issue date',
        quickActions: [
          { id: 'fees', label: 'View Permit Fees', icon: '💰' },
          { id: 'renewal', label: 'Renew Permit', icon: '🔄' },
          { id: 'status', label: 'Check Application', icon: '📊' }
        ]
      }
    },
    fees: {
      keywords: ['fees', 'cost', 'charges', 'how much', 'price', 'rates', 'amount'],
      response: {
        message: '💵 **Business Permit Fee Structure:**\n\n' +
                 '🏪 **Small Scale Businesses**\n' +
                 '   • Retail Shops: Ksh 2,500 - 5,000\n' +
                 '   • Kiosks: Ksh 2,000 - 3,500\n' +
                 '   • Home-based: Ksh 2,000 - 4,000\n\n' +
                 '🏢 **Medium Scale Businesses**\n' +
                 '   • Restaurants: Ksh 8,000 - 15,000\n' +
                 '   • Salons/Spas: Ksh 5,000 - 12,000\n' +
                 '   • Pharmacies: Ksh 10,000 - 20,000\n\n' +
                 '🏭 **Large Scale Businesses**\n' +
                 '   • Supermarkets: Ksh 25,000 - 50,000\n' +
                 '   • Hotels: Ksh 30,000 - 100,000\n' +
                 '   • Industries: Ksh 50,000+\n\n' +
                 '📝 **Additional Certificates:**\n' +
                 '   • Fire Certificate: Ksh 1,000\n' +
                 '   • Health Certificate: Ksh 2,000\n' +
                 '   • Signboard Permit: Ksh 500 - 2,000\n\n' +
                 '⚠️ *Note: Actual fees depend on business type, location, and size*',
        quickActions: [
          { id: 'payments', label: 'Make Payment', icon: '💳' },
          { id: 'permits', label: 'Apply for Permit', icon: '📋' },
          { id: 'contact', label: 'Get Assistance', icon: '📞' }
        ]
      }
    },
    contact: {
      keywords: ['contact', 'phone', 'email', 'reach', 'call', 'write', 'address', 'talk to'],
      response: {
        message: '📞 **Contact Embu County Revenue Authority:**\n\n' +
                 '☎️ **Phone Numbers:**\n' +
                 '   • Main Line: +254 768 800 600\n' +
                 '   • Toll Free: 0800 600 600\n' +
                 '   • WhatsApp: +254 768 800 601\n\n' +
                 '📧 **Email Addresses:**\n' +
                 '   • General Inquiries: info@emburevenue.go.ke\n' +
                 '   • Technical Support: support@emburevenue.go.ke\n' +
                 '   • Complaints: complaints@emburevenue.go.ke\n\n' +
                 '🌐 **Online Presence:**\n' +
                 '   • Website: www.emburevenue.go.ke\n' +
                 '   • Facebook: @EmbuCountyRevenue\n' +
                 '   • Twitter: @EmbuRevenue\n' +
                 '   • Instagram: @embu_revenue\n\n' +
                 '📮 **Postal Address:**\n' +
                 '   P.O. Box 72-60100, Embu, Kenya',
        quickActions: [
          { id: 'office', label: 'Visit Our Office', icon: '📍' },
          { id: 'hours', label: 'Working Hours', icon: '🕒' },
          { id: 'directions', label: 'Get Directions', icon: '🗺️' }
        ]
      }
    },
    office: {
      keywords: ['office', 'location', 'where', 'address', 'visit', 'physical', 'directions', 'find you'],
      response: {
        message: '📍 **Our Office Location:**\n\n' +
                 '🏛️ **Main Office:**\n' +
                 'Embu County Revenue Authority\n' +
                 'County Headquarters Building, 3rd Floor\n' +
                 'Embu Town, Embu County, Kenya\n\n' +
                 '🗺️ **Nearby Landmarks:**\n' +
                 '   • Opposite Embu Law Courts\n' +
                 '   • Next to County Assembly Building\n' +
                 '   • 200 meters from Embu Bus Station\n' +
                 '   • Near Embu Sports Club\n\n' +
                 '🚗 **Parking:**\n' +
                 '   • Free parking available\n' +
                 '   • Accessible for persons with disabilities\n\n' +
                 '🚌 **Public Transport:**\n' +
                 '   • Accessible by matatus and buses\n' +
                 '   • Walking distance from town center',
        quickActions: [
          { id: 'hours', label: 'Working Hours', icon: '🕒' },
          { id: 'contact', label: 'Contact Details', icon: '📞' },
          { id: 'services', label: 'Our Services', icon: '🏛️' }
        ]
      }
    },
    hours: {
      keywords: ['hours', 'time', 'open', 'close', 'working hours', 'operation', 'when', 'schedule'],
      response: {
        message: '🕒 **Working Hours & Schedule:**\n\n' +
                 '📅 **Monday - Friday:**\n' +
                 '   • Morning: 8:00 AM - 1:00 PM\n   • Afternoon: 2:00 PM - 5:00 PM\n   • Lunch Break: 1:00 PM - 2:00 PM\n\n' +
                 '📅 **Saturday:**\n' +
                 '   • 9:00 AM - 1:00 PM\n' +
                 '   • (First & Third Saturday of each month)\n\n' +
                 '📅 **Sunday & Public Holidays:**\n' +
                 '   • Closed\n\n' +
                 '💻 **Online Services:**\n' +
                 '   • Available 24/7 on our website\n   • Online payments always open\n   • Email support monitored daily\n\n' +
                 '☎️ **Emergency Contact:**\n' +
                 '   • Hotline: 0800 600 600 (24/7)',
        quickActions: [
          { id: 'contact', label: 'Contact Us', icon: '📞' },
          { id: 'office', label: 'Office Location', icon: '📍' },
          { id: 'payments', label: 'Pay Online', icon: '💳' }
        ]
      }
    },
    services: {
      keywords: ['services', 'what do you do', 'revenue', 'streams', 'collect', 'what can you help'],
      response: {
        message: '🏛️ **Embu County Revenue Services:**\n\n' +
                 '📋 **Licensing & Permits:**\n' +
                 '   • Business Permits & Licenses\n   • Trade Licenses\n   • Outdoor Advertising Permits\n   • Liquor Licenses\n\n' +
                 '🏠 **Property Revenue:**\n' +
                 '   • Land Rates & Rent\n   • Property Tax Assessment\n   • House & Shop Rent\n\n' +
                 '🚗 **Transport & Parking:**\n' +
                 '   • Parking Fees & Permits\n   • Seasonal Parking\n   • Clamping & Impounding\n\n' +
                 '🏪 **Market Services:**\n' +
                 '   • Market Stall Fees\n   • Cess Collection\n   • Slaughter House Fees\n\n' +
                 '🏗️ **Development Services:**\n   • Building Plan Approvals\n   • Inspection Fees\n   • Completion Certificates\n\n' +
                 '🏥 **Health & Safety:**\n   • Health Certificates\n   • Fire Safety Certificates\n   • Food Handler Permits',
        quickActions: [
          { id: 'permits', label: 'Business Permits', icon: '📋' },
          { id: 'payments', label: 'Make Payment', icon: '💳' },
          { id: 'fees', label: 'View All Fees', icon: '💰' }
        ]
      }
    },
    renewal: {
      keywords: ['renew', 'renewal', 'extend', 'expire', 'expired', 'renewing'],
      response: {
        message: '🔄 **Permit Renewal Process:**\n\n' +
                 '✅ **Renewal Requirements:**\n' +
                 '   • Current/expired permit copy\n   • Updated business documents\n   • Valid compliance certificates\n   • Clearance from relevant departments\n\n' +
                 '📝 **Renewal Steps:**\n' +
                 '   1. Submit renewal application\n   2. Update business information\n   3. Pay renewal fees\n   4. Submit compliance documents\n   5. Collect renewed permit\n\n' +
                 '💰 **Renewal Fees:**\n' +
                 '   • Same as new application fees\n   • No late fees if renewed on time\n   • 50% penalty for late renewal\n\n' +
                 '⚠️ **Important:**\n' +
                 '   • Renew 30 days before expiry\n   • Late renewals attract penalties\n   • Keep business compliant year-round',
        quickActions: [
          { id: 'fees', label: 'View Renewal Fees', icon: '💰' },
          { id: 'payments', label: 'Pay Now', icon: '💳' },
          { id: 'contact', label: 'Get Help', icon: '📞' }
        ]
      }
    },
    receipt: {
      keywords: ['receipt', 'proof', 'confirmation', 'payment receipt', 'proof of payment'],
      response: {
        message: '🧾 **Payment Receipt Information:**\n\n' +
                 '📱 **After Payment You Receive:**\n' +
                 '   • Instant SMS confirmation\n   • Official receipt via email\n   • Unique receipt number\n   • Transaction reference code\n\n' +
                 '📥 **To Get Duplicate Receipt:**\n' +
                 '   • Visit our office with ID & reference\n   • Email: receipts@emburevenue.go.ke\n   • Call: 0800 600 600\n   • Provide transaction details\n\n' +
                 '💾 **Receipt Management:**\n' +
                 '   • Download from our website\n   • Save digital copies\n   • Keep for audit purposes\n   • Valid for 7 years\n\n' +
                 '⚠️ **Important:**\n' +
                 'Always verify receipt authenticity on our website',
        quickActions: [
          { id: 'contact', label: 'Contact Support', icon: '📞' },
          { id: 'office', label: 'Visit Office', icon: '📍' },
          { id: 'payments', label: 'Make Payment', icon: '💳' }
        ]
      }
    },
    status: {
      keywords: ['status', 'check', 'application status', 'track', 'progress'],
      response: {
        message: '📊 **Check Application Status:**\n\n' +
                 '🔍 **How to Track Your Application:**\n' +
                 '   • Visit our website portal\n   • Use your application reference number\n   • Call our helpline: 0800 600 600\n   • Visit our office in person\n\n' +
                 '📌 **Application Stages:**\n' +
                 '   1. ✅ Submitted\n   2. 🔄 Under Review\n   3. 🔍 Inspection (if required)\n   4. ✔️ Approved\n   5. 📋 Ready for Collection\n\n' +
                 '⏱️ **Expected Timeline:**\n' +
                 '   • New applications: 5-7 days\n   • Renewals: 3-5 days\n   • Urgent requests: 2-3 days (extra fee)\n\n' +
                 '📧 **Updates:**\n' +
                 'You\'ll receive SMS & email notifications at each stage',
        quickActions: [
          { id: 'contact', label: 'Contact Support', icon: '📞' },
          { id: 'office', label: 'Visit Office', icon: '📍' },
          { id: 'permits', label: 'Apply for Permit', icon: '📋' }
        ]
      }
    },
    directions: {
      keywords: ['directions', 'how to get', 'navigate', 'map', 'route'],
      response: {
        message: '🗺️ **Directions to Our Office:**\n\n' +
                 '📍 **From Embu Bus Station:**\n' +
                 '   • Walk 200m towards town center\n   • Pass Equity Bank on your left\n   • County Headquarters on your right\n   • Take elevator/stairs to 3rd Floor\n\n' +
                 '🚗 **By Car:**\n' +
                 '   • Use Google Maps: "Embu County HQ"\n   • From Nairobi: 120km via Thika Road\n   • Free parking at County grounds\n\n' +
                 '🚌 **By Public Transport:**\n' +
                 '   • Board matatus to Embu Town\n   • Alight at main bus station\n   • 5-minute walk to our office\n\n' +
                 '♿ **Accessibility:**\n' +
                 '   • Ramps available for wheelchair users\n   • Elevator to all floors\n   • Accessible restrooms',
        quickActions: [
          { id: 'office', label: 'Office Details', icon: '📍' },
          { id: 'hours', label: 'Working Hours', icon: '🕒' },
          { id: 'contact', label: 'Call Us', icon: '📞' }
        ]
      }
    },
    thanks: {
      keywords: ['thank', 'thanks', 'thank you', 'appreciate'],
      response: {
        message: '😊 You\'re very welcome!\n\nI\'m glad I could help. If you have any other questions about:\n\n• Payments & fees\n• Business permits\n• Our services\n• Office locations\n\nFeel free to ask anytime!\n\nHave a great day! 🌟',
        quickActions: [
          { id: 'greetings', label: 'Main Menu', icon: '🏠' },
          { id: 'services', label: 'View Services', icon: '🏛️' },
          { id: 'contact', label: 'Contact Us', icon: '📞' }
        ]
      }
    },
    goodbye: {
      keywords: ['bye', 'goodbye', 'see you', 'exit', 'quit', 'leave'],
      response: {
        message: '👋 Thank you for contacting Embu County Revenue Authority!\n\nWe hope we\'ve been helpful. Remember:\n\n✅ Our services are available 24/7 online\n✅ Call us anytime: 0800 600 600\n✅ Visit us during working hours\n\nHave a wonderful day! 🌟',
        quickActions: [
          { id: 'greetings', label: 'Start Over', icon: '🔄' },
          { id: 'contact', label: 'Save Contacts', icon: '📞' }
        ]
      }
    }
  };

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.unreadCount = 0;
      if (!this.isChatStarted) {
        this.startConversation();
        this.isChatStarted = true;
      }
      this.shouldScrollToBottom = true;
    }
  }

  startConversation() {
    const welcomeResponse = this.knowledgeBase.greetings.response;
    setTimeout(() => {
      this.addBotMessage(welcomeResponse.message, welcomeResponse.quickActions);
    }, 300);
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isTyping) return;

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';
    this.showQuickActions = false;

    this.processUserInput(userMessage);
  }

  selectQuickAction(action: QuickAction) {
    this.addUserMessage(action.label);
    this.showQuickActions = false;
    this.processUserInput(action.id);
  }

  clearChat() {
    if (confirm('Are you sure you want to clear the conversation?')) {
      this.messages = [];
      this.isChatStarted = false;
      this.showQuickActions = true;
      this.currentQuickActions = [];
      this.startConversation();
    }
  }

  copyMessage(text: string) {
    // Remove HTML formatting for clean copy
    const cleanText = text.replace(/\*\*/g, '').replace(/\n/g, '\n');
    
    navigator.clipboard.writeText(cleanText).then(() => {
      const messageId = this.messages.find(m => m.text === text)?.id;
      if (messageId) {
        this.copiedMessageId = messageId;
        
        // Reset after 2 seconds
        if (this.copyTimeout) {
          clearTimeout(this.copyTimeout);
        }
        this.copyTimeout = setTimeout(() => {
          this.copiedMessageId = null;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy message:', err);
    });
  }

  showAttachmentOptions() {
    const response: ChatResponse = {
      message: '📎 **Additional Options:**\n\n' +
               'For now, you can:\n\n' +
               '• Ask me any questions\n' +
               '• Use quick action buttons\n' +
               '• Contact us directly for file uploads\n\n' +
               'File upload feature coming soon! 🚀',
      quickActions: [
        { id: 'contact', label: 'Contact Support', icon: '📞' },
        { id: 'greetings', label: 'Main Menu', icon: '🏠' }
      ]
    };
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      this.addBotMessage(response.message, response.quickActions);
    }, 500);
  }

  private addUserMessage(text: string) {
    const message: Message = {
      id: this.generateId(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.shouldScrollToBottom = true;
  }

  private addBotMessage(text: string, quickActions?: QuickAction[]) {
    const message: Message = {
      id: this.generateId(),
      text,
      isBot: true,
      timestamp: new Date()
    };
    this.messages.push(message);
    
    if (quickActions && quickActions.length > 0) {
      this.currentQuickActions = quickActions;
      this.showQuickActions = true;
    } else {
      this.currentQuickActions = [];
      this.showQuickActions = false;
    }

    if (!this.isOpen) {
      this.unreadCount++;
    }

    this.shouldScrollToBottom = true;
  }

  private processUserInput(input: string) {
    this.isTyping = true;
    const lowerInput = input.toLowerCase().trim();

    // Simulate processing delay for more natural feel
    const delay = 800 + Math.random() * 600;
    
    setTimeout(() => {
      const response = this.findBestResponse(lowerInput);
      this.isTyping = false;
      
      if (response) {
        this.addBotMessage(response.message, response.quickActions);
      } else {
        this.handleUnknownQuery();
      }
    }, delay);
  }

  private findBestResponse(input: string): ChatResponse | null {
    let bestMatch: { category: string; score: number } | null = null;
    let highestScore = 0;

    // Check each category in knowledge base
    for (const [category, data] of Object.entries(this.knowledgeBase)) {
      const score = this.calculateMatchScore(input, data.keywords);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { category, score };
      }
    }

    // Return response if match score is above threshold
    if (bestMatch && highestScore > 0.25) {
      const categoryData = this.knowledgeBase[bestMatch.category as keyof typeof this.knowledgeBase];
      return categoryData.response;
    }

    return null;
  }

  private calculateMatchScore(input: string, keywords: string[]): number {
    let matches = 0;
    const inputWords = input.split(/\s+/);

    for (const keyword of keywords) {
      // Exact phrase match gets highest score
      if (input.includes(keyword)) {
        matches += 2;
      }
      
      // Check for partial matches in input words
      for (const word of inputWords) {
        if (word.length > 2) {
          if (word.includes(keyword) || keyword.includes(word)) {
            matches += 1;
          }
          // Check for similar words (Levenshtein-like)
          if (this.areSimilar(word, keyword)) {
            matches += 0.5;
          }
        }
      }
    }

    return matches / Math.max(keywords.length, inputWords.length);
  }

  private areSimilar(word1: string, word2: string): boolean {
    if (word1.length < 3 || word2.length < 3) return false;
    
    // Check if words start with same letters
    if (word1.substring(0, 3) === word2.substring(0, 3)) {
      return true;
    }
    
    return false;
  }

  private handleUnknownQuery() {
    const response: ChatResponse = {
      message: '🤔 I\'m not quite sure about that specific query.\n\n' +
               '**But I can definitely help you with:**\n\n' +
               '💳 Payment methods and procedures\n' +
               '📋 Business permit applications\n' +
               '💰 Fee structures and rates\n' +
               '📞 Contact information\n' +
               '📍 Office locations and hours\n' +
               '🔄 Permit renewals\n' +
               '🧾 Payment receipts\n\n' +
               'Try rephrasing your question, or choose from the options below:',
      quickActions: [
        { id: 'contact', label: 'Talk to Support', icon: '📞' },
        { id: 'services', label: 'View All Services', icon: '🏛️' },
        { id: 'greetings', label: 'Main Menu', icon: '🏠' }
      ]
    };
    this.addBotMessage(response.message, response.quickActions);
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      try {
        const element = this.messagesContainer.nativeElement;
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
        }, 100);
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}