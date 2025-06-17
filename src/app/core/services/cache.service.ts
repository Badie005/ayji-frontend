import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  expiry: number;
  response: HttpResponse<any>;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes en millisecondes

  constructor() {
    // Nettoyer le cache périodiquement
    setInterval(() => this.cleanExpiredCache(), 60 * 1000); // Chaque minute
  }

  /**
   * Obtient une réponse mise en cache ou retourne null
   */
  get(key: string): HttpResponse<any> | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Vérifier si le cache est expiré
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  /**
   * Met en cache une réponse
   */
  set(key: string, response: HttpResponse<any>, ttl: number = this.DEFAULT_TTL): void {
    // Ne pas mettre en cache les réponses non 2xx
    if (response.status >= 300) {
      return;
    }

    const entry: CacheEntry = {
      expiry: Date.now() + ttl,
      response
    };

    this.cache.set(key, entry);
  }

  /**
   * Supprime une entrée du cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Vide les entrées avec un préfixe spécifique (utile pour invalider par catégorie)
   */
  clearByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Nettoie les entrées expirées du cache
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Utilitaire pour opérateur RxJS de mise en cache
   */
  cacheResponse<T>(key: string, ttl?: number) {
    return (source: Observable<HttpResponse<T>>): Observable<HttpResponse<T>> => {
      return new Observable(observer => {
        const cachedResponse = this.get(key);
        if (cachedResponse) {
          observer.next(cachedResponse as HttpResponse<T>);
          observer.complete();
        } else {
          return source.pipe(
            tap(response => {
              this.set(key, response, ttl);
            })
          ).subscribe(observer);
        }
      });
    };
  }
}
