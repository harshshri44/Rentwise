import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trust-safety',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust-safety.component.html',
  styleUrl: './trust-safety.component.css'
})
export class TrustSafetyComponent {
  guidelines = [
    {
      icon: 'visit',
      title: 'Inspect In Person Before Paying',
      description: 'Always schedule a physical visit to inspect room condition, water supply, fixtures, and neighborhood vibe before paying any token amount.'
    },
    {
      icon: 'direct',
      title: 'Direct Owner / Flatmate Chat',
      description: 'Communicate directly with the person living there or the property owner via WhatsApp or phone. Never deal with unauthorized middlemen.'
    },
    {
      icon: 'receipt',
      title: 'Get Written Deposit Terms',
      description: 'Clearly document the security deposit amount, notice period, deduction clauses, and refund timeline before signing or moving in.'
    },
    {
      icon: 'shield',
      title: 'Beware of Advance Scams',
      description: 'Never wire money to someone claiming to hold the flat while they are "traveling" or before you have met them and confirmed keys.'
    }
  ];
}
