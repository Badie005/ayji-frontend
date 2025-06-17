// src/app/admin/components/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';

  constructor(
    private userService: UserManagementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Données reçues du backend:', data);
        this.users = data;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur détaillée lors du chargement des utilisateurs:', error);
        this.errorMessage = 'Une erreur s\'est produite lors du chargement des utilisateurs';
        console.error('Erreur lors du chargement des utilisateurs', error);
        this.loading = false;
      }
    });
  }

  searchUsers(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      return (
        (user.nom && user.nom.toLowerCase().includes(this.searchTerm)) ||
        (user.prenom && user.prenom.toLowerCase().includes(this.searchTerm)) ||
        (user.email && user.email.toLowerCase().includes(this.searchTerm)) ||
        (user.role && user.role.toLowerCase().includes(this.searchTerm))
      );
    });
  }

  sortUsersByField(field: string): void {
    this.filteredUsers.sort((a: any, b: any) => {
      if (!a[field]) return 1;
      if (!b[field]) return -1;
      if (typeof a[field] === 'string') {
        return a[field].localeCompare(b[field]);
      }
      return a[field] - b[field];
    });
  }

  editUser(userId: string): void {
    this.router.navigate(['/admin/users/edit', userId]);
  }

  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.loading = true;
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user._id !== userId);
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Une erreur s\'est produite lors de la suppression';
          console.error('Erreur lors de la suppression', error);
          this.loading = false;
        }
      });
    }
  }

  addNewUser(): void {
    this.router.navigate(['/admin/users/add']);
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}