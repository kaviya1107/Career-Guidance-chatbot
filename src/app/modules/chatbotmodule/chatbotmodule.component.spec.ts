import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotmoduleComponent } from './chatbotmodule.component';

describe('ChatbotmoduleComponent', () => {
  let component: ChatbotmoduleComponent;
  let fixture: ComponentFixture<ChatbotmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotmoduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
