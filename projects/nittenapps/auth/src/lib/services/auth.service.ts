import { Injectable, Optional } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(@Optional() private keycloak?: KeycloakService) {}

  get profile(): Promise<KeycloakProfile | null> {
    if (this.keycloak?.isLoggedIn()) {
      return this.keycloak.loadUserProfile();
    }
    return Promise.resolve(null);
  }

  get username(): string {
    return this.keycloak?.getUsername() || 'Usuario';
  }

  getUserRoles(): string[] {
    return this.keycloak?.getUserRoles(true) || [];
  }

  isLoggedIn(): boolean {
    return this.keycloak?.isLoggedIn() || false;
  }

  login(redirectUri?: string): Promise<void> {
    if (this.keycloak) {
      const uri = window.location.origin + (redirectUri || '');
      return this.keycloak.login({ redirectUri: uri });
    }
    return Promise.resolve();
  }

  logout(redirectUri?: string): void {
    if (this.keycloak) {
      const uri = window.location.origin + (redirectUri || '');
      this.keycloak.logout(uri);
    }
  }
}
