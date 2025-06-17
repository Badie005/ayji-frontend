// src/app/admin/components/settings/settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  saveSuccess = false;
  saveError = false;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      siteName: ['Plateforme de Formation', [Validators.required]],
      siteEmail: ['contact@plateforme.com', [Validators.required, Validators.email]],
      enableNotifications: [true],
      maintenanceMode: [false],
      maxUploadSize: [10, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    // Load settings from API if available
    // For now, using default values
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      const settings = this.settingsForm.value;
      console.log('Saving settings:', settings);
      
      // Simulate API call
      setTimeout(() => {
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 3000);
      }, 800);
    } else {
      this.saveError = true;
      setTimeout(() => this.saveError = false, 3000);
    }
  }

  resetSettings(): void {
    this.settingsForm.reset({
      siteName: 'Plateforme de Formation',
      siteEmail: 'contact@plateforme.com',
      enableNotifications: true,
      maintenanceMode: false,
      maxUploadSize: 10
    });
  }
}
