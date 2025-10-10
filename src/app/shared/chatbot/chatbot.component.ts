// chatbot.component.ts
import { TextToHtmlPipe } from '../../text-to-html.pipe';
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
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

  // Knowledge base for the chatbot
  private knowledgeBase = {
    greetings: {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'start'],
      response: {
        message: 'Welcome to Embu County Revenue Authority! I\'m here to assist you with information about our services.',
        followUp: ['What would you like to know about?'],
        quickActions: [
          { id: 'payments', label: 'Payment Options', icon: '💳' },
          { id: 'permits', label: 'Business Permits', icon: '📋' },
          { id: 'contact', label: 'Contact Us', icon: '📞' },
          { id: 'services', label: 'Our Services', icon: '🏛️' }
        ]
      }
    },
    payments: {
      keywords: ['pay', 'payment', 'mpesa', 'bank', 'how to pay', 'paybill', 'transfer', 'money'],
      response: {
        message: 'We offer multiple convenient payment methods:\n\n' +
                 '💳 M-Pesa Paybill:\n' +
                 '   • Paybill No: 800600\n' +
                 '   • Account: Your ID Number\n\n' +
                 '🏦 Bank Transfer:\n' +
                 '   • Bank: Kenya Commercial Bank\n' +
                 '   • Account: 1234567890\n' +
                 '   • Branch: Embu\n\n' +
                 '🏢 Cash Payment:\n' +
                 '   • Visit our offices during working hours',
        quickActions: [
          { id: 'receipt', label: 'Payment Receipt', icon: '🧾' },
          { id: 'office', label: 'Office Location', icon: '📍' },
          { id: 'hours', label: 'Working Hours', icon: '🕒' }
        ]
      }
    },
    permits: {
      keywords: ['permit', 'license', 'business permit', 'registration', 'apply', 'application', 'sbp'],
      response: {
        message: 'Business Permit Application Process:\n\n' +
                 '1️⃣ Required Documents:\n' +
                 '   • ID/Passport copy\n' +
                 '   • KRA PIN Certificate\n' +
                 '   • Business Registration Certificate\n' +
                 '   • Lease Agreement/Ownership Documents\n\n' +
                 '2️⃣ Application Steps:\n' +
                 '   • Fill application form\n' +
                 '   • Submit documents\n' +
                 '   • Pay applicable fees\n' +
                 '   • Await inspection (if required)\n\n' +
                 '3️⃣ Processing Time: 5-7 working days',
        quickActions: [
          { id: 'fees', label: 'Permit Fees', icon: '💰' },
          { id: 'renewal', label: 'Permit Renewal', icon: '🔄' },
          { id: 'status', label: 'Check Status', icon: '📊' }
        ]
      }
    },
    fees: {
      keywords: ['fees', 'cost', 'charges', 'how much', 'price', 'rates'],
      response: {
        message: 'Business Permit Fee Structure:\n\n' +
                 '📊 Based on business category:\n' +
                 '   • Small Scale: Ksh 2,500 - 5,000\n' +
                 '   • Medium Scale: Ksh 5,000 - 15,000\n' +
                 '   • Large Scale: Ksh 15,000 - 50,000\n\n' +
                 '💡 Additional Charges:\n' +
                 '   • Fire Certificate: Ksh 1,000\n' +
                 '   • Health Certificate: Ksh 2,000\n' +
                 '   • Signboard Fee: Ksh 500 - 2,000\n\n' +
                 'Note: Fees vary by business type and location',
        quickActions: [
          { id: 'payments', label: 'Pay Now', icon: '💳' },
          { id: 'permits', label: 'Apply for Permit', icon: '📋' }
        ]
      }
    },
    contact: {
      keywords: ['contact', 'phone', 'email', 'reach', 'call', 'write', 'address'],
      response: {
        message: 'Contact Embu County Revenue Authority:\n\n' +
                 '📞 Phone Numbers:\n' +
                 '   • Main Line: +254 768 800 600\n' +
                 '   • Hotline: 0800 600 600 (Toll Free)\n\n' +
                 '📧 Email:\n' +
                 '   • General: info@emburevenue.go.ke\n' +
                 '   • Support: support@emburevenue.go.ke\n\n' +
                 '🌐 Website: www.emburevenue.go.ke\n\n' +
                 '📱 Social Media: @EmbuRevenue',
        quickActions: [
          { id: 'office', label: 'Visit Office', icon: '📍' },
          { id: 'hours', label: 'Working Hours', icon: '🕒' },
          { id: 'directions', label: 'Get Directions', icon: '🗺️' }
        ]
      }
    },
    office: {
      keywords: ['office', 'location', 'where', 'address', 'visit', 'physical'],
      response: {
        message: '📍 Our Office Location:\n\n' +
                 'Embu County Revenue Authority\n' +
                 'County Headquarters Building, 3rd Floor\n' +
                 'Embu Town, Embu County\n\n' +
                 '🚗 Landmarks:\n' +
                 '   • Opposite Embu Law Courts\n' +
                 '   • Next to County Assembly\n' +
                 '   • 200m from Embu Bus Station\n\n' +
                 '🅿️ Free parking available',
        quickActions: [
          { id: 'hours', label: 'Working Hours', icon: '🕒' },
          { id: 'contact', label: 'Contact Details', icon: '📞' },
          { id: 'directions', label: 'Get Directions', icon: '🗺️' }
        ]
      }
    },
    hours: {
      keywords: ['hours', 'time', 'open', 'close', 'working hours', 'operation', 'when'],
      response: {
        message: '🕒 Working Hours:\n\n' +
                 '📅 Monday - Friday:\n' +
                 '   • 8:00 AM - 5:00 PM\n' +
                 '   • Lunch Break: 1:00 PM - 2:00 PM\n\n' +
                 '📅 Saturday:\n' +
                 '   • 9:00 AM - 1:00 PM\n' +
                 '   • (First & Third Saturday only)\n\n' +
                 '📅 Sunday & Public Holidays:\n' +
                 '   • Closed\n\n' +
                 '💡 Online services available 24/7',
        quickActions: [
          { id: 'contact', label: 'Contact Us', icon: '📞' },
          { id: 'office', label: 'Office Location', icon: '📍' }
        ]
      }
    },
    services: {
      keywords: ['services', 'what do you do', 'revenue', 'streams', 'collect'],
      response: {
        message: '🏛️ Our Revenue Services:\n\n' +
                 '1. Business Permits & Licenses\n' +
                 '2. Land Rates & Property Tax\n' +
                 '3. Parking Fees & Permits\n' +
                 '4. Market & Trade Licenses\n' +
                 '5. Building Plan Approvals\n' +
                 '6. Outdoor Advertising Fees\n' +
                 '7. Health & Fire Certificates\n' +
                 '8. Cess & Agricultural Levies',
        quickActions: [
          { id: 'permits', label: 'Business Permits', icon: '📋' },
          { id: 'payments', label: 'Make Payment', icon: '💳' },
          { id: 'fees', label: 'View Fees', icon: '💰' }
        ]
      }
    },
    renewal: {
      keywords: ['renew', 'renewal', 'extend', 'expire', 'expired'],
      response: {
        message: '🔄 Permit Renewal Process:\n\n' +
                 '✅ Requirements:\n' +
                 '   • Expired/expiring permit\n' +
                 '   • Valid compliance certificates\n' +
                 '   • Updated business documents\n\n' +
                 '📝 Steps:\n' +
                 '   1. Submit renewal application\n' +
                 '   2. Update any changed information\n' +
                 '   3. Pay renewal fees\n' +
                 '   4. Collect renewed permit\n\n' +
                 '⏰ Renew 30 days before expiry to avoid penalties',
        quickActions: [
          { id: 'fees', label: 'Renewal Fees', icon: '💰' },
          { id: 'payments', label: 'Pay Now', icon: '💳' }
        ]
      }
    },
    receipt: {
      keywords: ['receipt', 'proof', 'confirmation', 'payment receipt'],
      response: {
        message: '🧾 Payment Receipt Information:\n\n' +
                 'After payment, you will receive:\n' +
                 '   • SMS confirmation immediately\n' +
                 '   • Official receipt via email\n' +
                 '   • Receipt number for tracking\n\n' +
                 '📥 To get a duplicate receipt:\n' +
                 '   • Visit our office with payment reference\n' +
                 '   • Email: receipts@emburevenue.go.ke\n' +
                 '   • Call: 0800 600 600\n\n' +
                 'Keep your receipt for record purposes',
        quickActions: [
          { id: 'contact', label: 'Contact Support', icon: '📞' },
          { id: 'office', label: 'Visit Office', icon: '📍' }
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
    this.addBotMessage(welcomeResponse.message, welcomeResponse.quickActions);
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
    this.processUserInput(action.id);
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

    // Simulate processing delay
    setTimeout(() => {
      const response = this.findBestResponse(lowerInput);
      this.isTyping = false;
      
      if (response) {
        this.addBotMessage(response.message, response.quickActions);
      } else {
        this.handleUnknownQuery();
      }
    }, 800 + Math.random() * 400);
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
    if (bestMatch && highestScore > 0.3) {
      const categoryData = this.knowledgeBase[bestMatch.category as keyof typeof this.knowledgeBase];
      return categoryData.response;
    }

    return null;
  }

  private calculateMatchScore(input: string, keywords: string[]): number {
    let matches = 0;
    const inputWords = input.split(/\s+/);

    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        matches += 1;
      }
      
      // Check for partial matches in input words
      for (const word of inputWords) {
        if (word.includes(keyword) || keyword.includes(word)) {
          matches += 0.5;
        }
      }
    }

    return matches / Math.max(keywords.length, inputWords.length);
  }

  private handleUnknownQuery() {
    const response: ChatResponse = {
      message: 'I apologize, but I don\'t have specific information about that query. However, I can help you with:\n\n' +
               '• Payment methods and procedures\n' +
               '• Business permit applications\n' +
               '• Fee structures and rates\n' +
               '• Contact information and office hours\n\n' +
               'You can also reach our support team directly for personalized assistance.',
      quickActions: [
        { id: 'contact', label: 'Contact Support', icon: '📞' },
        { id: 'services', label: 'View Services', icon: '🏛️' },
        { id: 'greetings', label: 'Main Menu', icon: '🏠' }
      ]
    };
    this.addBotMessage(response.message, response.quickActions);
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
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