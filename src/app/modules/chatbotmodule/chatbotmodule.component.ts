import { Component } from '@angular/core';
import { ChatserviceService } from '../../services/chatservice.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chatbotmodule',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, HttpClientModule],
  providers:[ChatserviceService],
  templateUrl: './chatbotmodule.component.html',
  styleUrl: './chatbotmodule.component.css'
})
export class ChatbotmoduleComponent {
   userInput: string = '';
    messages: { text: string; sender: 'user' | 'bot' }[] = []; // Stores chat history
    isListening: boolean = false;
  
  
    constructor(private chatService: ChatserviceService) {}
  
    sendMessage() {
      if (this.userInput.trim()) {
        // Add user message to chat history
        this.messages.push({ text: this.userInput, sender: 'user' });
    
        // Call chatbot service for response
        this.chatService.getBotResponse(this.userInput).subscribe({
          next: (response: any) => {
            console.log("API Response:", response);
            // Ensure response is mapped correctly
            const botReply = response.response || "Sorry, I didn't understand.";
            this.messages.push({ text: botReply, sender: 'bot' });
          },
          error: (error: any) => {
            console.error('Error:', error);
            this.messages.push({ text: 'Sorry, there was an error processing your request.', sender: 'bot' });
          }
        });
    
        this.userInput = ''; 
      }
    }
    
    
  
    // Method to start voice recognition
    startListening() {
      const recognition = new (window as any).webkitSpeechRecognition();
  
      recognition.lang = 'en-US';
      recognition.start();
      this.isListening = true;
  
      recognition.onresult = (event: any) => {
        this.userInput = event.results[0][0].transcript;
        this.isListening = false;
        this.sendMessage();
      };
  
      recognition.onerror = () => {
        this.isListening = false;
        alert('Speech recognition error. Try again.');
      };
    }

}
