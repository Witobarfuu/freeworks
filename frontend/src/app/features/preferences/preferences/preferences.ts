import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';


@Component({
  selector: 'app-preferences',

  imports: [
    FormsModule
  ],

  templateUrl: './preferences.html',
  styleUrl: './preferences.css'
})
export class Preferences implements OnInit {

  freelancerName = 'William';

  freelancerRole = 'Freelancer';

  email = 'william@freeworks.local';


  emailNotifications = true;

  overdueNotifications = true;

  showSystemStatus = true;

  compactMode = false;


  saved =
    signal(false);


  ngOnInit(): void {

    const stored =
      localStorage.getItem(
        'freeworks_preferences'
      );


    if (!stored) {
      return;
    }


    try {

      const preferences =
        JSON.parse(stored);


      this.freelancerName =
        preferences.freelancerName
        ?? this.freelancerName;

      this.freelancerRole =
        preferences.freelancerRole
        ?? this.freelancerRole;

      this.email =
        preferences.email
        ?? this.email;

      this.emailNotifications =
        preferences.emailNotifications
        ?? this.emailNotifications;

      this.overdueNotifications =
        preferences.overdueNotifications
        ?? this.overdueNotifications;

      this.showSystemStatus =
        preferences.showSystemStatus
        ?? this.showSystemStatus;

      this.compactMode =
        preferences.compactMode
        ?? this.compactMode;

    } catch (error) {

      console.error(
        'No fue posible cargar las preferencias:',
        error
      );

    }

  }


  savePreferences(): void {

    const preferences = {

      freelancerName:
        this.freelancerName.trim(),

      freelancerRole:
        this.freelancerRole.trim(),

      email:
        this.email.trim(),

      emailNotifications:
        this.emailNotifications,

      overdueNotifications:
        this.overdueNotifications,

      showSystemStatus:
        this.showSystemStatus,

      compactMode:
        this.compactMode

    };


    localStorage.setItem(
      'freeworks_preferences',
      JSON.stringify(preferences)
    );


    this.saved.set(true);


    setTimeout(
      () => {
        this.saved.set(false);
      },
      2500
    );

  }


  restoreDefaults(): void {

    this.freelancerName =
      'William';

    this.freelancerRole =
      'Freelancer';

    this.email =
      'william@freeworks.local';

    this.emailNotifications =
      true;

    this.overdueNotifications =
      true;

    this.showSystemStatus =
      true;

    this.compactMode =
      false;


    localStorage.removeItem(
      'freeworks_preferences'
    );


    this.saved.set(true);


    setTimeout(
      () => {
        this.saved.set(false);
      },
      2500
    );

  }

}