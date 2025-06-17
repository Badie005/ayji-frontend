import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MCQGroup, MCQQuestion } from '../models/mcq.model';

@Injectable({
  providedIn: 'root'
})
export class McqService {
  // This data could be fetched from a database or backend API
  // For now, we're using a static implementation with the MCQs provided

  constructor(private http: HttpClient) { }

  getMcqGroups(courseId: string): Observable<MCQGroup[]> {
    // In a production environment, we would fetch from API
    // return this.http.get<MCQGroup[]>(`/api/courses/${courseId}/mcqs`);
    
    // For now, we're returning static data
    // This simulates what would come from the backend
    if (courseId === '2') {
      console.log('Returning OSI and IP Addressing MCQ for course ID 2');
      return of(this.getOSINetworkMcqGroups());
    } else if (courseId === '3') {
      console.log('Returning Local Network Addressing Techniques MCQ for course ID 3');
      return of(this.getLocalNetworkAddressingMcqGroups());
    } else if (courseId === '4') {
      console.log('Returning DHCP Service MCQ for course ID 4');
      return of(this.getDHCPServiceMcqGroups());
    } else if (courseId === '5') {
      console.log('Returning DNS Service MCQ for course ID 5');
      return of(this.getDNSServiceMcqGroups());
    } else if (courseId === '6') {
      console.log('Returning Web Services MCQ for course ID 6');
      return of(this.getWebServicesMcqGroups());
    } else if (courseId) {
      return of(this.getMockMcqGroups());
    }
    return of([]);
  }

  private getLocalNetworkAddressingMcqGroups(): MCQGroup[] {
    // Retourne le QCM sur les techniques d'adressage d'un réseau local pour le cours 3
    return [
      {
        id: 1,
        title: 'Série 1 – Notions fondamentales d\'adresse IP (Niveau Très Facile)',
        difficulty: 'facile',
        difficultyLevel: 1,
        questions: [
          {
            id: 1,
            text: 'Quel est le nombre total de bits dans une adresse IPv4 ?',
            options: [
              { id: 0, text: '16 bits' },
              { id: 1, text: '32 bits' },
              { id: 2, text: '64 bits' },
              { id: 3, text: '128 bits' }
            ],
            correctAnswerId: 1,
            explanation: 'Chaque adresse IPv4 est codée sur 32 bits, répartis en 4 octets.'
          },
          {
            id: 2,
            text: 'Comment appelle-t-on la notation la plus courante des adresses IPv4 (ex. 192.168.1.1) ?',
            options: [
              { id: 0, text: 'Hexadécimale' },
              { id: 1, text: 'Binaire' },
              { id: 2, text: 'Décimale pointée' },
              { id: 3, text: 'Notation CIDR' }
            ],
            correctAnswerId: 2,
            explanation: 'On sépare les octets par des points et on les écrit en décimal (0–255).'
          },
          {
            id: 3,
            text: 'Une adresse IP est composée de deux parties : NET_ID et HOST_ID. À quoi sert NET_ID ?',
            options: [
              { id: 0, text: 'Identifier l\'hôte dans le réseau' },
              { id: 1, text: 'Identifier le réseau pour le routage' },
              { id: 2, text: 'Spécifier la passerelle par défaut' },
              { id: 3, text: 'Allouer les ports TCP/UDP' }
            ],
            correctAnswerId: 1,
            explanation: 'La partie NET_ID permet de déterminer à quel réseau appartient l\'adresse pour acheminer les paquets.'
          },
          {
            id: 4,
            text: 'Quel outil permet de déterminer la partie réseau et la partie hôte d\'une adresse ?',
            options: [
              { id: 0, text: 'ARP' },
              { id: 1, text: 'Masque de sous-réseau' },
              { id: 2, text: 'DHCP' },
              { id: 3, text: 'DNS' }
            ],
            correctAnswerId: 1,
            explanation: 'Le masque, codé en 32 bits, sépare par des 1 la partie réseau et par des 0 la partie hôte.'
          },
          {
            id: 5,
            text: 'Quelle adresse IPv4 spéciale est réservée pour communiquer avec soi-même ?',
            options: [
              { id: 0, text: '0.0.0.0' },
              { id: 1, text: '255.255.255.255' },
              { id: 2, text: '127.0.0.1' },
              { id: 3, text: '192.168.0.1' }
            ],
            correctAnswerId: 2,
            explanation: 'La boucle locale (localhost) utilise toutes les adresses 127.X.Y.Z pour les communications internes.'
          },
          {
            id: 6,
            text: 'Lequel de ces éléments n\'est PAS configuré par DHCP ?',
            options: [
              { id: 0, text: 'Adresse IP' },
              { id: 1, text: 'Masque de sous-réseau' },
              { id: 2, text: 'Passerelle par défaut' },
              { id: 3, text: 'Adresse MAC' }
            ],
            correctAnswerId: 3,
            explanation: 'Le serveur DHCP attribue IP, masque et passerelle, mais pas l\'adresse matérielle MAC, qui est fixe.'
          }
        ]
      },
      {
        id: 2,
        title: 'Série 2 – Classes d\'adresses IP (Niveau Facile)',
        difficulty: 'facile',
        difficultyLevel: 1,
        questions: [
          {
            id: 7,
            text: 'Quelle plage correspond aux adresses de classe A ?',
            options: [
              { id: 0, text: '0.0.0.0 – 127.255.255.255' },
              { id: 1, text: '1.0.0.0 – 126.255.255.255' },
              { id: 2, text: '128.0.0.0 – 191.255.255.255' },
              { id: 3, text: '192.0.0.0 – 223.255.255.255' }
            ],
            correctAnswerId: 1,
            explanation: 'Les adresses de classe A ont leur bit de poids fort à 0 et vont de 1.0.0.0 à 126.0.0.0.'
          },
          {
            id: 8,
            text: 'Dans une adresse de classe B, combien d\'octets représentent le réseau ?',
            options: [
              { id: 0, text: '1 octet' },
              { id: 1, text: '2 octets' },
              { id: 2, text: '3 octets' },
              { id: 3, text: '4 octets' }
            ],
            correctAnswerId: 1,
            explanation: 'Les deux premiers octets (bits commençant par 10) forment le NET_ID.'
          },
          {
            id: 9,
            text: 'Quelle classe est destinée à la multidiffusion (multicast) ?',
            options: [
              { id: 0, text: 'Classe A' },
              { id: 1, text: 'Classe B' },
              { id: 2, text: 'Classe C' },
              { id: 3, text: 'Classe D' }
            ],
            correctAnswerId: 3,
            explanation: 'La plage 224.0.0.0 à 239.255.255.255 est réservée au multicast.'
          },
          {
            id: 10,
            text: 'Quel est le masque par défaut pour une adresse de classe C ?',
            options: [
              { id: 0, text: '255.0.0.0' },
              { id: 1, text: '255.255.0.0' },
              { id: 2, text: '255.255.255.0' },
              { id: 3, text: '255.255.255.255' }
            ],
            correctAnswerId: 2,
            explanation: 'Par défaut, classe C utilise 24 bits pour le réseau.'
          },
          {
            id: 11,
            text: 'Quelle plage d\'adresses est réservée pour des expérimentations (classe E) ?',
            options: [
              { id: 0, text: '240.0.0.0 – 255.255.255.254' },
              { id: 1, text: '224.0.0.0 – 239.255.255.255' },
              { id: 2, text: '192.168.0.0 – 192.168.255.255' },
              { id: 3, text: '10.0.0.0 – 10.255.255.255' }
            ],
            correctAnswerId: 0,
            explanation: 'Les adresses de classe E sont réservées pour usage futur/expérimental.'
          },
          {
            id: 12,
            text: 'Combien de réseaux possibles offre la classe C ?',
            options: [
              { id: 0, text: '128' },
              { id: 1, text: '256' },
              { id: 2, text: '2 097 152' },
              { id: 3, text: '16 777 214' }
            ],
            correctAnswerId: 2,
            explanation: '3 bits de poids fort (110) => 21 × 2 097 152 réseaux.'
          }
        ]
      },
      {
        id: 3,
        title: 'Série 3 – Adresses particulières et privées (Niveau Moyen)',
        difficulty: 'moyen',
        difficultyLevel: 3,
        questions: [
          {
            id: 13,
            text: 'Quelle adresse est celle de diffusion limitée (link-local) ?',
            options: [
              { id: 0, text: '255.255.255.255' },
              { id: 1, text: '0.0.0.0' },
              { id: 2, text: '192.168.0.0' },
              { id: 3, text: '127.0.0.1' }
            ],
            correctAnswerId: 0,
            explanation: 'Diffusion limitée à tous les hôtes du réseau local.'
          },
          {
            id: 14,
            text: 'Quelle plage définit les adresses privées de classe B ?',
            options: [
              { id: 0, text: '10.0.0.0/8' },
              { id: 1, text: '172.16.0.0/12' },
              { id: 2, text: '192.168.0.0/16' },
              { id: 3, text: '224.0.0.0/4' }
            ],
            correctAnswerId: 1,
            explanation: 'Plage réservée aux réseaux privés de classe B.'
          },
          {
            id: 15,
            text: 'Que représente l\'adresse 0.0.0.0 dans un hôte en démarrage ?',
            options: [
              { id: 0, text: 'Passerelle par défaut' },
              { id: 1, text: 'Adresse réseau' },
              { id: 2, text: 'Adresse machine courante' },
              { id: 3, text: 'Adresse de diffusion' }
            ],
            correctAnswerId: 2,
            explanation: 'Utilisée avant qu\'un hôte obtienne sa propre adresse IP.'
          },
          {
            id: 16,
            text: 'Quel protocole utilise des "baux" pour gérer les adresses IP dynamiques ?',
            options: [
              { id: 0, text: 'DNS' },
              { id: 1, text: 'FTP' },
              { id: 2, text: 'DHCP' },
              { id: 3, text: 'SMTP' }
            ],
            correctAnswerId: 2,
            explanation: 'Assigne automatiquement IP, masque et passerelle sous forme de location temporaire.'
          },
          {
            id: 17,
            text: 'Laquelle de ces plages ne doit JAMAIS être annoncée dans le routage Internet ?',
            options: [
              { id: 0, text: '10.0.0.0 – 10.255.255.255' },
              { id: 1, text: '172.16.0.0 – 172.31.255.255' },
              { id: 2, text: '192.168.0.0 – 192.168.255.255' },
              { id: 3, text: '224.0.0.0 – 239.255.255.255' }
            ],
            correctAnswerId: 0,
            explanation: 'Toutes les adresses privées ne sont pas routées sur Internet.'
          },
          {
            id: 18,
            text: 'Quelle est la première action d\'un hôte A pour envoyer un paquet à un hôte C sur un réseau différent ?',
            options: [
              { id: 0, text: 'Envoyer directement au MAC de C' },
              { id: 1, text: 'Requête ARP pour l\'adresse MAC de la passerelle' },
              { id: 2, text: 'Requête DNS' },
              { id: 3, text: 'Envoyer une diffusion limitée' }
            ],
            correctAnswerId: 1,
            explanation: 'A envoie un ARP à la passerelle pour savoir où transmettre le paquet destiné à C.'
          }
        ]
      },
      {
        id: 4,
        title: 'Série 4 – Routage et fragmentation (Niveau Un Peu Plus Dur)',
        difficulty: 'moyen-difficile',
        difficultyLevel: 4,
        questions: [
          {
            id: 19,
            text: 'Qu\'est-ce que la MTU (Maximum Transmission Unit) ?',
            options: [
              { id: 0, text: 'Taille maximale d\'une adresse IP' },
              { id: 1, text: 'Taille maximale des données incluant l\'en-tête' },
              { id: 2, text: 'Nombre maximal de sous-réseaux' },
              { id: 3, text: 'Durée du bail DHCP' }
            ],
            correctAnswerId: 1,
            explanation: 'Si un datagramme dépasse la MTU, il doit être fragmenté.'
          },
          {
            id: 20,
            text: 'Dans quel cas le réassemblage des fragments IP se fait-il ?',
            options: [
              { id: 0, text: 'Uniquement par le routeur' },
              { id: 1, text: 'Uniquement par le destinataire' },
              { id: 2, text: 'Seulement pour le multicast' },
              { id: 3, text: 'Jamais' }
            ],
            correctAnswerId: 1,
            explanation: 'Le récepteur remet les fragments dans l\'ordre grâce aux numéros de fragment.'
          },
          {
            id: 21,
            text: 'Quelle commande Windows affiche la table de routage d\'un hôte ?',
            options: [
              { id: 0, text: 'ipconfig' },
              { id: 1, text: 'netstat –r' },
              { id: 2, text: 'tracert' },
              { id: 3, text: 'nslookup' }
            ],
            correctAnswerId: 1,
            explanation: 'Affiche routes directement connectées et routes distantes.'
          },
          {
            id: 22,
            text: 'Quelle est l\'adresse de diffusion dirigée pour le réseau 192.168.4.0/24 ?',
            options: [
              { id: 0, text: '192.168.4.0' },
              { id: 1, text: '192.168.4.255' },
              { id: 2, text: '255.255.255.255' },
              { id: 3, text: '192.168.0.255' }
            ],
            correctAnswerId: 1,
            explanation: 'Tous les bits hôte à 1 ciblent tous les hôtes de ce réseau.'
          },
          {
            id: 23,
            text: 'Si MTU = 1500 octets et un datagramme IP fait 4000 octets, en combien de fragments minimale se découpe-t-il (sans options) ?',
            options: [
              { id: 0, text: '2' },
              { id: 1, text: '3' },
              { id: 2, text: '4' },
              { id: 3, text: '1' }
            ],
            correctAnswerId: 1,
            explanation: '4000 – 20 (en-tête) = 3980 utiles → 2×1480 + 1020 → il faut 3 fragments.'
          },
          {
            id: 24,
            text: 'Quel champ du datagramme IP permet d\'indiquer s\'il y a d\'autres fragments à suivre ?',
            options: [
              { id: 0, text: 'Identification' },
              { id: 1, text: 'Flags (MF)' },
              { id: 2, text: 'Offset' },
              { id: 3, text: 'Version' }
            ],
            correctAnswerId: 1,
            explanation: 'Le bit MF indique si le fragment n\'est pas le dernier.'
          }
        ]
      },
      {
        id: 5,
        title: 'Série 5 – Subnetting et CIDR (Niveau Difficile)',
        difficulty: 'difficile',
        difficultyLevel: 5,
        questions: [
          {
            id: 25,
            text: 'Pour subdiviser 192.168.1.0/24 en 4 sous-réseaux égaux, quel masque utilise-t-on ?',
            options: [
              { id: 0, text: '/25' },
              { id: 1, text: '/26' },
              { id: 2, text: '/27' },
              { id: 3, text: '/28' }
            ],
            correctAnswerId: 1,
            explanation: '2 bits empruntés → 2²=4 sous-réseaux.'
          },
          {
            id: 26,
            text: 'Combien d\'hôtes valides par sous-réseau avec un masque /27 ?',
            options: [
              { id: 0, text: '30' },
              { id: 1, text: '62' },
              { id: 2, text: '126' },
              { id: 3, text: '254' }
            ],
            correctAnswerId: 0,
            explanation: '5 bits hôte → 2⁵–2 adresses réservées = 30.'
          },
          {
            id: 27,
            text: 'Quel est le troisième sous-réseau de 192.168.1.0/24 en /26 ?',
            options: [
              { id: 0, text: '192.168.1.128/26' },
              { id: 1, text: '192.168.1.192/26' },
              { id: 2, text: '192.168.1.64/26' },
              { id: 3, text: '192.168.1.0/26' }
            ],
            correctAnswerId: 0,
            explanation: 'Sous-réseaux : 0–63, 64–127, 128–191, 192–255.'
          },
          {
            id: 28,
            text: 'Dans le routage CIDR, que signifie "classless" ?',
            options: [
              { id: 0, text: 'Plus de classes A, B, C prédéfinies' },
              { id: 1, text: 'Adresses dynamiques uniquement' },
              { id: 2, text: 'Seulement pour IPv6' },
              { id: 3, text: 'Masque toujours /32' }
            ],
            correctAnswerId: 0,
            explanation: 'On peut emprunter un nombre arbitraire de bits pour le réseau.'
          },
          {
            id: 29,
            text: 'Quel calcul donne le nombre de sous-réseaux créés en empruntant n bits ?',
            options: [
              { id: 0, text: 'n²' },
              { id: 1, text: '2ⁿ' },
              { id: 2, text: '2ⁿ–2' },
              { id: 3, text: 'n!' }
            ],
            correctAnswerId: 1,
            explanation: 'Chaque bit emprunté double le nombre de sous-réseaux.'
          },
          {
            id: 30,
            text: 'Quelle plage d\'un sous-réseau /28 incluant l\'adresse 10.0.0.17 ?',
            options: [
              { id: 0, text: '10.0.0.16–10.0.0.31' },
              { id: 1, text: '10.0.0.0–10.0.0.15' },
              { id: 2, text: '10.0.0.17–10.0.0.30' },
              { id: 3, text: '10.0.0.8–10.0.0.23' }
            ],
            correctAnswerId: 0,
            explanation: 'Blocs de 16 adresses => 0–15, 16–31, etc.'
          }
        ]
      },
      {
        id: 6,
        title: 'Série 6 – Cas pratiques et calculs avancés (Niveau Très Difficile)',
        difficulty: 'très-difficile',
        difficultyLevel: 6,
        questions: [
          {
            id: 31,
            text: 'Vous avez 5 sous-réseaux à créer dans 192.168.1.0/24. Combien de bits devez-vous emprunter au minimum ?',
            options: [
              { id: 0, text: '2 bits' },
              { id: 1, text: '3 bits' },
              { id: 2, text: '4 bits' },
              { id: 3, text: '5 bits' }
            ],
            correctAnswerId: 1,
            explanation: '2³=8 ≥ 5 sous-réseaux; 2²=4 < 5.'
          },
          {
            id: 32,
            text: 'Quel est le masque correspondant à cet emprunt de 3 bits ?',
            options: [
              { id: 0, text: '/25' },
              { id: 1, text: '/26' },
              { id: 2, text: '/27' },
              { id: 3, text: '/28' }
            ],
            correctAnswerId: 2,
            explanation: '24+3=27 bits pour le réseau.'
          },
          {
            id: 33,
            text: 'Dans un sous-réseau /27, quelle est l\'adresse de diffusion du 5ᵉ sous-réseau si celui-ci commence à 192.168.1.128 ?',
            options: [
              { id: 0, text: '192.168.1.159' },
              { id: 1, text: '192.168.1.158' },
              { id: 2, text: '192.168.1.159' },
              { id: 3, text: '192.168.1.160' }
            ],
            correctAnswerId: 0,
            explanation: 'Bloc 128–159, diffusion = dernier hôte +1 = 159.'
          },
          {
            id: 34,
            text: 'Un hôte 192.168.1.98/27 utilise quelle passerelle par défaut si c\'est le 3ᵉ sous-réseau ?',
            options: [
              { id: 0, text: '192.168.1.97' },
              { id: 1, text: '192.168.1.98' },
              { id: 2, text: '192.168.1.126' },
              { id: 3, text: '192.168.1.95' }
            ],
            correctAnswerId: 0,
            explanation: 'Première adresse utile du sous-réseau 96–127.'
          },
          {
            id: 35,
            text: 'Pour rejoindre un hôte sur un réseau distant, que fait l\'équipement émetteur ?',
            options: [
              { id: 0, text: 'Il envoie un ARP sur 255.255.255.255' },
              { id: 1, text: 'Il transmet au MAC de la passerelle' },
              { id: 2, text: 'Il modifie directement le NET_ID' },
              { id: 3, text: 'Il fragmente le paquet' }
            ],
            correctAnswerId: 1,
            explanation: 'Tout trafic non local est envoyé à la gateway dont on connaît la MAC.'
          },
          {
            id: 36,
            text: 'Vous devez segmenter 200 hôtes sur 192.168.10.0. Quel masque minimal utiliserez-vous ?',
            options: [
              { id: 0, text: '/24' },
              { id: 1, text: '/25' },
              { id: 2, text: '/26' },
              { id: 3, text: '/27' }
            ],
            correctAnswerId: 1,
            explanation: '/25 offre 2¹⁷–2=126 hôtes par sous-réseau; deux sous-réseaux de 126 = 252 adresses.'
          }
        ]
      }
    ];
  }

  private getOSINetworkMcqGroups(): MCQGroup[] {
    // Retourne le QCM sur le modèle OSI et l'adressage IP pour le cours 2
    return [
      {
        id: 1,
        title: 'Série 1 : Classes d\'adresses IP (niveau facile)',
        difficulty: 'facile',
        difficultyLevel: 1,
        questions: [
          {
            id: 1,
            text: 'Quelle est la classe de l\'adresse IP 10.0.0.1 ?',
            options: [
              { id: 0, text: 'Classe A' },
              { id: 1, text: 'Classe B' },
              { id: 2, text: 'Classe C' },
              { id: 3, text: 'Classe D' }
            ],
            correctAnswerId: 0,
            explanation: 'Les adresses dont le premier octet va de 1 à 126 sont en classe A.'
          },
          {
            id: 2,
            text: 'Quelle est la classe de l\'adresse IP 192.117.3.1 ?',
            options: [
              { id: 0, text: 'A' },
              { id: 1, text: 'B' },
              { id: 2, text: 'C' },
              { id: 3, text: 'D' }
            ],
            correctAnswerId: 2,
            explanation: 'Les adresses de 192 à 223 appartiennent à la classe C.'
          },
          {
            id: 3,
            text: 'L\'adresse IP 226.8.55.130 appartient à la classe ?',
            options: [
              { id: 0, text: 'A' },
              { id: 1, text: 'B' },
              { id: 2, text: 'C' },
              { id: 3, text: 'D (multidiffusion)' }
            ],
            correctAnswerId: 3,
            explanation: 'Les adresses de 224 à 239 sont réservées à la multidiffusion (classe D).'
          },
          {
            id: 4,
            text: 'Parmi ces adresses, laquelle n\'est pas valide ?',
            options: [
              { id: 0, text: '129.117.3.1' },
              { id: 1, text: '15.257.3.1' },
              { id: 2, text: '173.2.10.130' },
              { id: 3, text: '222.93.200.1' }
            ],
            correctAnswerId: 1,
            explanation: 'Un octet doit être entre 0 et 255 ; 257 est hors borne.'
          },
          {
            id: 5,
            text: 'Quel est le premier bit à 1 dans le masque par défaut d\'une adresse de classe A ?',
            options: [
              { id: 0, text: '1er bit' },
              { id: 1, text: '9ᵉ bit' },
              { id: 2, text: '17ᵉ bit' },
              { id: 3, text: '25ᵉ bit' }
            ],
            correctAnswerId: 1,
            explanation: 'Masque par défaut de classe A = 255.0.0.0, c\'est donc 8 bits à 1 puis des 0.'
          },
          {
            id: 6,
            text: 'Une adresse de classe B a par défaut un masque en décimal pointé de ?',
            options: [
              { id: 0, text: '255.0.0.0' },
              { id: 1, text: '255.255.0.0' },
              { id: 2, text: '255.255.255.0' },
              { id: 3, text: '255.255.255.128' }
            ],
            correctAnswerId: 1,
            explanation: 'Par convention, classe B = deux octets à 1 puis deux à 0.'
          }
        ]
      },
      {
        id: 2,
        title: 'Série 2 : Masques et parties Réseau/Hôte (niveau un peu plus élevé)',
        difficulty: 'facile-moyen',
        difficultyLevel: 2,
        questions: [
          {
            id: 7,
            text: 'Pour 172.3.2.1 (classe B), quelle est la partie réseau ?',
            options: [
              { id: 0, text: '172' },
              { id: 1, text: '172.3' },
              { id: 2, text: '172.3.2' },
              { id: 3, text: '172.3.2.1' }
            ],
            correctAnswerId: 1,
            explanation: 'En classe B, les deux premiers octets identifient le réseau.'
          },
          {
            id: 8,
            text: 'Quel est le masque par défaut de 123.22.4.2 (classe A) ?',
            options: [
              { id: 0, text: '255.255.0.0' },
              { id: 1, text: '255.0.0.0' },
              { id: 2, text: '255.255.255.0' },
              { id: 3, text: '255.255.255.255' }
            ],
            correctAnswerId: 1,
            explanation: 'Les adresses de classe A ont 8 bits de masque à 1.'
          },
          {
            id: 9,
            text: 'Pour 193.200.3.6, la partie hôte est :',
            options: [
              { id: 0, text: '.6' },
              { id: 1, text: '.3.6' },
              { id: 2, text: '193.200.3' },
              { id: 3, text: '193.200' }
            ],
            correctAnswerId: 0,
            explanation: 'Classe C, 24 bits réseau, donc seul le 4ᵉ octet est hôte.'
          },
          {
            id: 10,
            text: 'Quel est le premier octet de diffusion pour le réseau 192.168.1.0/24 ?',
            options: [
              { id: 0, text: '192.168.1.0' },
              { id: 1, text: '192.168.1.1' },
              { id: 2, text: '192.168.1.254' },
              { id: 3, text: '192.168.1.255' }
            ],
            correctAnswerId: 3,
            explanation: 'Adresse de diffusion = adresse réseau + tous les bits hôte à 1.'
          },
          {
            id: 11,
            text: 'Combien d\'hôtes possibles dans 10.0.0.0/8 sans sous-réseaux ?',
            options: [
              { id: 0, text: '16 777 216' },
              { id: 1, text: '16 777 214' },
              { id: 2, text: '16 777 214 + 2' },
              { id: 3, text: '256' }
            ],
            correctAnswerId: 1,
            explanation: '2³²–2 adresses utilisables en /8 (masque 255.0.0.0).'
          },
          {
            id: 12,
            text: 'Pour l\'adresse réseau 173.2.0.0, la dernière adresse valide est :',
            options: [
              { id: 0, text: '173.2.255.255' },
              { id: 1, text: '173.2.255.254' },
              { id: 2, text: '173.2.0.255' },
              { id: 3, text: '173.2.0.254' }
            ],
            correctAnswerId: 1,
            explanation: 'Classe B, broadcast = .255.255, donc dernier hôte = .255.254.'
          }
        ]
      },
      {
        id: 3,
        title: 'Série 3 : Modèle OSI (niveau intermédiaire)',
        difficulty: 'moyen',
        difficultyLevel: 3,
        questions: [
          {
            id: 13,
            text: 'Combien de couches comporte le modèle OSI ?',
            options: [
              { id: 0, text: '4' },
              { id: 1, text: '5' },
              { id: 2, text: '7' },
              { id: 3, text: '8' }
            ],
            correctAnswerId: 2,
            explanation: 'Le modèle OSI comprend les couches 1 à 7.'
          },
          {
            id: 14,
            text: 'Quelle couche gère l\'adressage IP et le routage ?',
            options: [
              { id: 0, text: 'Liaison de données' },
              { id: 1, text: 'Physique' },
              { id: 2, text: 'Réseau' },
              { id: 3, text: 'Transport' }
            ],
            correctAnswerId: 2,
            explanation: 'La couche 3 (Réseau) s\'occupe de l\'adressage et du routage.'
          },
          {
            id: 15,
            text: 'Parmi ces services, lequel relève de la couche Présentation ?',
            options: [
              { id: 0, text: 'Choix du chemin' },
              { id: 1, text: 'Cryptage et compression' },
              { id: 2, text: 'Établissement de session' },
              { id: 3, text: 'Contrôle de flux de segments' }
            ],
            correctAnswerId: 1,
            explanation: 'La couche 6 (Présentation) convertit, crypte et compresse.'
          },
          {
            id: 16,
            text: 'Quelle sous-couche est responsable du contrôle d\'accès au support dans la couche Liaison ?',
            options: [
              { id: 0, text: 'LLC' },
              { id: 1, text: 'MAC' },
              { id: 2, text: 'PHY' },
              { id: 3, text: 'IP' }
            ],
            correctAnswerId: 1,
            explanation: 'La Media Access Control gère l\'accès au média.'
          },
          {
            id: 17,
            text: 'Quel protocole de la couche Transport est orienté connexion et fiable ?',
            options: [
              { id: 0, text: 'UDP' },
              { id: 1, text: 'IP' },
              { id: 2, text: 'TCP' },
              { id: 3, text: 'ICMP' }
            ],
            correctAnswerId: 2,
            explanation: 'TCP assure l\'ordonnancement et les accusés de réception.'
          },
          {
            id: 18,
            text: 'À quel niveau se situe le protocole ARP ?',
            options: [
              { id: 0, text: 'Physique' },
              { id: 1, text: 'Transport' },
              { id: 2, text: 'Session' },
              { id: 3, text: 'Réseau' }
            ],
            correctAnswerId: 3,
            explanation: 'ARP (Address Resolution Protocol) traduit IP→MAC, c\'est une fonction couche 3.'
          }
        ]
      },
      {
        id: 4,
        title: 'Série 4 : Calcul de sous-réseaux (niveau avancé)',
        difficulty: 'moyen-difficile',
        difficultyLevel: 4,
        questions: [
          {
            id: 19,
            text: 'Combien de bits faut-il emprunter pour obtenir 14 sous-réseaux sans utiliser zéro ni tous-uns ?',
            options: [
              { id: 0, text: '3 (2³–2=6)' },
              { id: 1, text: '4 (2⁴–2=14)' },
              { id: 2, text: '5 (2⁵–2=30)' },
              { id: 3, text: '2 (2²–2=2)' }
            ],
            correctAnswerId: 1,
            explanation: '2⁴–2 = 16–2 = 14 sous-réseaux.'
          },
          {
            id: 20,
            text: 'Pour subdiviser 198.63.24.0 en 2 sous-réseaux, quel masque adopter ?',
            options: [
              { id: 0, text: '255.255.255.128' },
              { id: 1, text: '255.255.255.192' },
              { id: 2, text: '255.255.255.224' },
              { id: 3, text: '255.255.255.240' }
            ],
            correctAnswerId: 1,
            explanation: '2 sous-réseaux → 2²–2=2 bits empruntés → /24+2 = /26.'
          },
          {
            id: 21,
            text: 'Combien d\'hôtes par sous-réseau pour 110.0.0.0/18 ?',
            options: [
              { id: 0, text: '16 382' },
              { id: 1, text: '4 094' },
              { id: 2, text: '2 046' },
              { id: 3, text: '1 022' }
            ],
            correctAnswerId: 0,
            explanation: '/18 = 32–18 = 14 bits hôte → 2¹⁴–2 = 16 382.'
          },
          {
            id: 22,
            text: 'Quel est le préfixe pour le sous-réseau dont la plage va de 10.1.1.1 à 10.1.1.126 ?',
            options: [
              { id: 0, text: '/24' },
              { id: 1, text: '/25' },
              { id: 2, text: '/26' },
              { id: 3, text: '/27' }
            ],
            correctAnswerId: 1,
            explanation: '/25 donne 128 adresses (126 hôtes), plage .1→.126.'
          },
          {
            id: 23,
            text: 'Pour obtenir 4094 hôtes par sous-réseau, on utilise :',
            options: [
              { id: 0, text: '/28' },
              { id: 1, text: '/20' },
              { id: 2, text: '/16' },
              { id: 3, text: '/12' }
            ],
            correctAnswerId: 1,
            explanation: '/20 → 32–20 = 12 bits hôte → 2¹²–2 = 4094.'
          },
          {
            id: 24,
            text: 'Pour créer 60 sous-réseaux à partir d\'un réseau C, combien de bits empruntés ?',
            options: [
              { id: 0, text: '5 (2⁵–2=30)' },
              { id: 1, text: '6 (2⁶–2=62)' },
              { id: 2, text: '7 (2⁷–2=126)' },
              { id: 3, text: '8 (2⁸–2=254)' }
            ],
            correctAnswerId: 1,
            explanation: '2⁶–2 = 64–2 = 62 >= 60.'
          }
        ]
      },
      {
        id: 5,
        title: 'Série 5 : Adressage et plages d\'hôtes (niveau expert)',
        difficulty: 'difficile',
        difficultyLevel: 5,
        questions: [
          {
            id: 25,
            text: 'ID de sous-réseau : 148.56.64.0/22. Quelle est la première adresse hôte valide ?',
            options: [
              { id: 0, text: '148.56.64.0' },
              { id: 1, text: '148.56.64.1' },
              { id: 2, text: '148.56.67.255' },
              { id: 3, text: '148.56.67.254' }
            ],
            correctAnswerId: 1,
            explanation: '/22 couvre 64.0→67.255, premier hôte = .64.1.'
          },
          {
            id: 26,
            text: 'Même sous-réseau, adresse de broadcast ?',
            options: [
              { id: 0, text: '148.56.67.255' },
              { id: 1, text: '148.56.67.254' },
              { id: 2, text: '148.56.64.255' },
              { id: 3, text: '148.56.64.254' }
            ],
            correctAnswerId: 0,
            explanation: '/22 span 4 octets de 64 à 67, broadcast = dernier = .67.255.'
          },
          {
            id: 27,
            text: 'ID = 192.168.0.0/20. Combien d\'octets fixe couvre-t-il dans le 3ᵉ octet ?',
            options: [
              { id: 0, text: '0–15' },
              { id: 1, text: '0–31' },
              { id: 2, text: '0–63' },
              { id: 3, text: '0–255' }
            ],
            correctAnswerId: 0,
            explanation: '/20 = 12 bits hôte; tiers octet fixe = haut 4 bits réseau → 0000→1111 (= 0–15).'
          },
          {
            id: 28,
            text: 'ID = 132.56.16.0/21. Quel est le pas d\'incrément ?',
            options: [
              { id: 0, text: '8' },
              { id: 1, text: '16' },
              { id: 2, text: '32' },
              { id: 3, text: '64' }
            ],
            correctAnswerId: 0,
            explanation: '/21 emprunte 5 bits; pas = 2^(8–5) = 8 dans le 4ᵉ octet.'
          },
          {
            id: 29,
            text: 'Plage hôtes valides pour 198.53.24.64/26 ?',
            options: [
              { id: 0, text: '.65 – .126' },
              { id: 1, text: '.64 – .127' },
              { id: 2, text: '.65 – .126 inclus' },
              { id: 3, text: '.66 – .125' }
            ],
            correctAnswerId: 2,
            explanation: '/26 = blocs de 64; sous-réseau 24.64→24.127; hôtes .65→.126.'
          },
          {
            id: 30,
            text: 'ID = 152.56.144.0/23. Combien d\'hôtes ?',
            options: [
              { id: 0, text: '254' },
              { id: 1, text: '510' },
              { id: 2, text: '1022' },
              { id: 3, text: '2046' }
            ],
            correctAnswerId: 1,
            explanation: '/23 = 9 bits hôte → 2⁹–2 = 510.'
          }
        ]
      },
      {
        id: 6,
        title: 'Série 6 : Cas pratiques mixtes (niveau très avancé)',
        difficulty: 'très-difficile',
        difficultyLevel: 6,
        questions: [
          {
            id: 31,
            text: 'Subdiviser 192.168.1.0 en 5 sous-réseaux (en considérant zéro et tous-uns interdits). Quel nouveau masque ?',
            options: [
              { id: 0, text: '/25' },
              { id: 1, text: '/27' },
              { id: 2, text: '/28' },
              { id: 3, text: '/29' }
            ],
            correctAnswerId: 1,
            explanation: '5 sous-réseaux → 2³–2=6 ≥5, donc +3 bits → /24+3 = /27.'
          },
          {
            id: 32,
            text: 'Le 3ᵉ sous-réseau obtenu (numérotation débutant à 1) commence à :',
            options: [
              { id: 0, text: '192.168.1.32' },
              { id: 1, text: '192.168.1.64' },
              { id: 2, text: '192.168.1.96' },
              { id: 3, text: '192.168.1.128' }
            ],
            correctAnswerId: 2,
            explanation: '/27 = pas de 32; 1ᵉ=0, 2ᵉ=32, 3ᵉ=64, 4ᵉ=96… (numérotation à partir de zéro pour "subnet 0")'
          },
          {
            id: 33,
            text: 'Pour 11.0.0.0 en 12 sous-réseaux (zéro/tous-uns interdits), quel masque ?',
            options: [
              { id: 0, text: '/18' },
              { id: 1, text: '/20' },
              { id: 2, text: '/22' },
              { id: 3, text: '/24' }
            ],
            correctAnswerId: 0,
            explanation: '12 sous-réseaux → 2⁴–2=14 ≥12, donc +4 bits → /8+4 = /12 … mais c\'est classe A; en TI Proc: A=8, +10 bits = /18.'
          },
          {
            id: 34,
            text: 'Adresse du 10ᵉ sous-réseau pour 185.42.0.0/22 ?',
            options: [
              { id: 0, text: '185.42.10.0' },
              { id: 1, text: '185.42.40.0' },
              { id: 2, text: '185.42.88.0' },
              { id: 3, text: '185.42.144.0' }
            ],
            correctAnswerId: 1,
            explanation: '/22 pas = 4 dans 3ᵉ octet → 4×10 = 40.'
          },
          {
            id: 35,
            text: 'Pour 223.21.25.0, 14 hôtes max par sous-réseau (avec zéro/tous-uns interdits), quel masque ?',
            options: [
              { id: 0, text: '/28' },
              { id: 1, text: '/29' },
              { id: 2, text: '/30' },
              { id: 3, text: '/27' }
            ],
            correctAnswerId: 0,
            explanation: '14 = 2ⁿ–2 → n=4 bits hôte → 32–4 = /28… mais /28 donne 14 hôtes ; toutefois en excluant zéro/tous-uns, n=4 bits → 2⁴–2=14, donc /28.'
          },
          {
            id: 36,
            text: 'ID réseau 63.0.0.0, 100 hôtes max par sous-réseau → nombre de sous-réseaux possibles ?',
            options: [
              { id: 0, text: '256' },
              { id: 1, text: '128' },
              { id: 2, text: '64' },
              { id: 3, text: '512' }
            ],
            correctAnswerId: 2,
            explanation: 'hôtes ≤100 ⇒ bits hôte ≥7 (2⁷–2=126) → /25 ; sous-réseaux bits empruntés = 25–8 =17 bits réservés pour sous-réseau → 2¹⁷ = 131 072 ; mais en classe A, réseau /8 initial, donc nb de sous-réseaux = 2^(25–8) = 2¹⁷ = 131 072.'
          }
        ]
      }
    ];
  }

  private getWebServicesMcqGroups(): MCQGroup[] {
    // QCM pour le cours de Services Web
    return [
      {
        id: 1,
        title: 'Série 1 – Niveau Très Facile',
        difficulty: 'facile',
        difficultyLevel: 1,
        questions: [
          {
            id: 1,
            text: 'Qu\'est-ce qu\'un service Web ?',
            options: [
              { id: 0, text: 'Un navigateur spécialisé' },
              { id: 1, text: 'Un composant distribué accessible via HTTP/XML' },
              { id: 2, text: 'Un protocole de routage réseau' },
              { id: 3, text: 'Un framework de base de données' }
            ],
            correctAnswerId: 1,
            explanation: 'Un service Web est un composant accessible sur Internet via le protocole HTTP et échangeant des messages au format XML.'
          },
          {
            id: 2,
            text: 'Quel protocole de transport sous‑tend principalement les services Web ?',
            options: [
              { id: 0, text: 'FTP' },
              { id: 1, text: 'SMTP' },
              { id: 2, text: 'HTTP' },
              { id: 3, text: 'SSH' }
            ],
            correctAnswerId: 2,
            explanation: 'Les services Web s\'appuient sur HTTP pour véhiculer requêtes et réponses entre clients et serveurs.'
          },
          {
            id: 3,
            text: 'Lequel des formats suivants est couramment utilisé pour les messages échangés par un service Web ?',
            options: [
              { id: 0, text: 'JSON' },
              { id: 1, text: 'XML' },
              { id: 2, text: 'CSV' },
              { id: 3, text: 'YAML' }
            ],
            correctAnswerId: 1,
            explanation: 'Traditionnellement, les services Web classiques utilisent le format XML pour l\'interopérabilité.'
          },
          {
            id: 4,
            text: 'Parmi les acteurs du Web Service, on compte :',
            options: [
              { id: 0, text: 'Le routeur' },
              { id: 1, text: 'Le fournisseur' },
              { id: 2, text: 'Le proxy' },
              { id: 3, text: 'Le firewall' }
            ],
            correctAnswerId: 1,
            explanation: 'Le fournisseur (provider) implémente et publie le service Web dans un annuaire.'
          },
          {
            id: 5,
            text: 'Qu\'est‑ce que UDDI ?',
            options: [
              { id: 0, text: 'Un langage de description de service' },
              { id: 1, text: 'Un protocole de transport' },
              { id: 2, text: 'Un annuaire de services Web' },
              { id: 3, text: 'Un moteur de base de données' }
            ],
            correctAnswerId: 2,
            explanation: 'UDDI est un registre/annuaire où sont publiées et recherchées les descriptions de services Web.'
          },
          {
            id: 6,
            text: 'Quelle est la méthode HTTP utilisée pour récupérer un document sans le modifier ?',
            options: [
              { id: 0, text: 'POST' },
              { id: 1, text: 'PUT' },
              { id: 2, text: 'GET' },
              { id: 3, text: 'DELETE' }
            ],
            correctAnswerId: 2,
            explanation: 'GET est la méthode standard pour demander la lecture d\'une ressource sans altération.'
          }
        ]
      },
      {
        id: 2,
        title: 'Série 2 – Niveau Facile',
        difficulty: 'facile-moyen',
        difficultyLevel: 2,
        questions: [
          {
            id: 7,
            text: 'Quel langage décrit la structure et les méthodes d\'un service Web ?',
            options: [
              { id: 0, text: 'SOAP' },
              { id: 1, text: 'REST' },
              { id: 2, text: 'WSDL' },
              { id: 3, text: 'HTML' }
            ],
            correctAnswerId: 2,
            explanation: 'WSDL (Web Services Description Language) spécifie les opérations, entrées/sorties et points d\'accès.'
          },
          {
            id: 8,
            text: 'Lors de la publication d\'un service, on l\'enregistre dans :',
            options: [
              { id: 0, text: 'Un fichier JSON' },
              { id: 1, text: 'Un annuaire UDDI' },
              { id: 2, text: 'Un serveur FTP' },
              { id: 3, text: 'Une base de données locale' }
            ],
            correctAnswerId: 1,
            explanation: 'La publication rend le service listé dans un annuaire UDDI pour qu\'il soit découvrable.'
          },
          {
            id: 9,
            text: 'Quelle étape suit immédiatement la découverte d\'un service Web ?',
            options: [
              { id: 0, text: 'Invocation' },
              { id: 1, text: 'Composition' },
              { id: 2, text: 'Enregistrement (binding)' },
              { id: 3, text: 'Sélection' }
            ],
            correctAnswerId: 2,
            explanation: 'Après découverte, le client s\'enregistre (bind) auprès du fournisseur via la description WSDL.'
          },
          {
            id: 10,
            text: 'La composition de services Web permet de :',
            options: [
              { id: 0, text: 'Doubler la bande passante' },
              { id: 1, text: 'Combiner plusieurs services pour en créer un nouveau' },
              { id: 2, text: 'Crypter les messages HTTP' },
              { id: 3, text: 'Déployer un serveur supplémentaire' }
            ],
            correctAnswerId: 1,
            explanation: 'La composition consiste à enchaîner ou fusionner plusieurs services simples pour former un service composite.'
          },
          {
            id: 11,
            text: 'Quel protocole n\'est pas un composant nécessaire à un service Web ?',
            options: [
              { id: 0, text: 'Protocole de description (WSDL)' },
              { id: 1, text: 'Protocole de message (XML/SOAP)' },
              { id: 2, text: 'Protocole de transport (HTTP/TCP)' },
              { id: 3, text: 'Protocole de chiffrement propriétaire' }
            ],
            correctAnswerId: 3,
            explanation: 'Les trois premiers sont essentiels ; un protocole de chiffrement propriétaire n\'est pas obligatoire.'
          },
          {
            id: 12,
            text: 'Dans un scénario complet, l\'invocation du service est l\'étape où :',
            options: [
              { id: 0, text: 'On définit le WSDL' },
              { id: 1, text: 'Le client envoie la requête au fournisseur' },
              { id: 2, text: 'Le fournisseur publie le service' },
              { id: 3, text: 'Le service est combiné à un autre' }
            ],
            correctAnswerId: 1,
            explanation: 'L\'invocation correspond à l\'appel effectif du service, via requête HTTP/XML.'
          }
        ]
      },
      {
        id: 3,
        title: 'Série 3 – Niveau Moyen',
        difficulty: 'moyen',
        difficultyLevel: 3,
        questions: [
          {
            id: 13,
            text: 'La méthode HTTP utilisée pour soumettre des données de formulaire est :',
            options: [
              { id: 0, text: 'GET' },
              { id: 1, text: 'POST' },
              { id: 2, text: 'OPTIONS' },
              { id: 3, text: 'TRACE' }
            ],
            correctAnswerId: 1,
            explanation: 'POST véhicule les données saisies dans le corps de la requête pour traitement serveur.'
          },
          {
            id: 14,
            text: 'Que contient principalement la zone « headers » d\'une requête HTTP ?',
            options: [
              { id: 0, text: 'Le corps HTML de la page' },
              { id: 1, text: 'Les métadonnées (accept, user‑agent, etc.)' },
              { id: 2, text: 'La liste des cookies uniquement' },
              { id: 3, text: 'Le code source JavaScript' }
            ],
            correctAnswerId: 1,
            explanation: 'Les entêtes (headers) listent des paramètres de requête, formats acceptés, agent client, etc.'
          },
          {
            id: 15,
            text: 'Quelle en‑tête HTTP informe le serveur que la réponse ne doit être envoyée que si modifiée ?',
            options: [
              { id: 0, text: 'If-Modified-Since' },
              { id: 1, text: 'Cache-Control' },
              { id: 2, text: 'Content-Type' },
              { id: 3, text: 'Host' }
            ],
            correctAnswerId: 0,
            explanation: 'If-Modified-Since conditionne la réponse à une date de dernière modification supérieure.'
          },
          {
            id: 16,
            text: 'Quel champ d\'en‑tête indique le type MIME attendu par le client ?',
            options: [
              { id: 0, text: 'Accept' },
              { id: 1, text: 'Content-Length' },
              { id: 2, text: 'Server' },
              { id: 3, text: 'Connection' }
            ],
            correctAnswerId: 0,
            explanation: 'Accept spécifie les types de contenu (MIME) que le client peut traiter.'
          },
          {
            id: 17,
            text: 'La méthode HTTP qui demande la suppression d\'une ressource sur le serveur est :',
            options: [
              { id: 0, text: 'DELETE' },
              { id: 1, text: 'PATCH' },
              { id: 2, text: 'CONNECT' },
              { id: 3, text: 'HEAD' }
            ],
            correctAnswerId: 0,
            explanation: 'DELETE est prévue pour ordonner la suppression d\'une ressource.'
          },
          {
            id: 18,
            text: 'Quelle en‑tête appartient à la catégorie « entités » et précise la taille du corps de message ?',
            options: [
              { id: 0, text: 'Content-Base' },
              { id: 1, text: 'Content-Length' },
              { id: 2, text: 'Location' },
              { id: 3, text: 'Retry-After' }
            ],
            correctAnswerId: 1,
            explanation: 'Content-Length donne la longueur en octets du contenu transféré.'
          }
        ]
      },
      {
        id: 4,
        title: 'Série 4 – Niveau Intermédiaire',
        difficulty: 'moyen-difficile',
        difficultyLevel: 4,
        questions: [
          {
            id: 19,
            text: 'Quelle tâche vise à localiser un service dans un registre ?',
            options: [
              { id: 0, text: 'Invocation' },
              { id: 1, text: 'Découverte' },
              { id: 2, text: 'Sélection' },
              { id: 3, text: 'Composition' }
            ],
            correctAnswerId: 1,
            explanation: 'La découverte (discovery) permet au client de rechercher un service dans un annuaire.'
          },
          {
            id: 20,
            text: 'La sélection d\'un service Web s\'appuie sur :',
            options: [
              { id: 0, text: 'Les besoins fonctionnels et non‑fonctionnels' },
              { id: 1, text: 'Le protocole FTP' },
              { id: 2, text: 'La taille de la page HTML' },
              { id: 3, text: 'La version du navigateur' }
            ],
            correctAnswerId: 0,
            explanation: 'On choisit le service le plus adapté selon critères fonctionnels (fonction) et qualité (performance, sécurité).'
          },
          {
            id: 21,
            text: 'L\'invocation SOAP repose en interne sur :',
            options: [
              { id: 0, text: 'HTML5' },
              { id: 1, text: 'XML enveloppé dans HTTP' },
              { id: 2, text: 'Binaire propriétaire' },
              { id: 3, text: 'JSON minimal' }
            ],
            correctAnswerId: 1,
            explanation: 'SOAP encapsule un message XML dans la charge utile d\'une requête HTTP.'
          },
          {
            id: 22,
            text: 'Quel protocole assure l\'échange de descriptions de services Web ?',
            options: [
              { id: 0, text: 'SMTP' },
              { id: 1, text: 'WSDL' },
              { id: 2, text: 'DNS' },
              { id: 3, text: 'NTP' }
            ],
            correctAnswerId: 1,
            explanation: 'WSDL est un langage XML définissant l\'interface et le contrat de service.'
          },
          {
            id: 23,
            text: 'Parmi ces étapes, laquelle précède toujours l\'invocation ?',
            options: [
              { id: 0, text: 'Publication' },
              { id: 1, text: 'Sélection' },
              { id: 2, text: 'Composition' },
              { id: 3, text: 'Archivage' }
            ],
            correctAnswerId: 0,
            explanation: 'On doit publier le service (dans UDDI) avant toute recherche et invocation.'
          },
          {
            id: 24,
            text: 'Le couplage fort entre objets est un inconvénient de :',
            options: [
              { id: 0, text: 'RMI et CORBA' },
              { id: 1, text: 'HTTP et XML' },
              { id: 2, text: 'UDDI et WSDL' },
              { id: 3, text: 'TCP et IP' }
            ],
            correctAnswerId: 0,
            explanation: 'RMI/CORBA imposent un lien étroit entre clients et serveurs, contraire à l\'esprit Web.'
          }
        ]
      },
      {
        id: 5,
        title: 'Série 5 – Niveau Avancé',
        difficulty: 'difficile',
        difficultyLevel: 5,
        questions: [
          {
            id: 25,
            text: 'IIS signifie :',
            options: [
              { id: 0, text: 'Internet Information Services' },
              { id: 1, text: 'Internal Integration System' },
              { id: 2, text: 'Internet Intranet Server' },
              { id: 3, text: 'Integrated Information Shell' }
            ],
            correctAnswerId: 0,
            explanation: 'IIS est l\'acronyme de Internet Information Services, le serveur Web de Microsoft.'
          },
          {
            id: 26,
            text: 'Le protocole sécurisé utilisé par IIS pour chiffrer les communications est :',
            options: [
              { id: 0, text: 'HTTP/2' },
              { id: 1, text: 'HTTPS (SSL/TLS)' },
              { id: 2, text: 'FTP' },
              { id: 3, text: 'SMTP' }
            ],
            correctAnswerId: 1,
            explanation: 'HTTPS repose sur SSL/TLS pour chiffrer échanges HTTP.'
          },
          {
            id: 27,
            text: 'Quelle version d\'IIS a introduit le support multicast de certificats SSL et le scaling multicœur ?',
            options: [
              { id: 0, text: 'IIS 6.0' },
              { id: 1, text: 'IIS 7.5' },
              { id: 2, text: 'IIS 8.0' },
              { id: 3, text: 'IIS 10' }
            ],
            correctAnswerId: 2,
            explanation: 'IIS 8.0 (Windows Server 2012) a ajouté la gestion centralisée des certificats SSL et l\'échelle multicœur.'
          },
          {
            id: 28,
            text: 'Lors de l\'installation d\'IIS via le Gestionnaire de serveur, on active le rôle :',
            options: [
              { id: 0, text: 'Serveur DNS' },
              { id: 1, text: 'Serveur Web (IIS)' },
              { id: 2, text: 'Service DHCP' },
              { id: 3, text: 'Contrôleur de domaine' }
            ],
            correctAnswerId: 1,
            explanation: 'Il faut cocher « rôle Serveur Web (IIS) » pour installer IIS.'
          },
          {
            id: 29,
            text: 'Quel outil Microsoft permet de créer et publier du contenu pour IIS ?',
            options: [
              { id: 0, text: 'WebDAV' },
              { id: 1, text: 'FileZilla' },
              { id: 2, text: 'PuTTY' },
              { id: 3, text: 'WinSCP' }
            ],
            correctAnswerId: 0,
            explanation: 'WebDAV est un protocole et un outil d\'édition/déploiement de contenu Web sur IIS.'
          },
          {
            id: 30,
            text: 'Dans l\'explorateur IIS, pour définir le dossier physique d\'un site, on modifie l\'onglet :',
            options: [
              { id: 0, text: 'Sécurité' },
              { id: 1, text: 'Documents par défaut' },
              { id: 2, text: 'Répertoire de base (Home Directory)' },
              { id: 3, text: 'Connectivité' }
            ],
            correctAnswerId: 2,
            explanation: 'L\'onglet « Home Directory » permet de pointer vers le répertoire local ou réseau hébergeant les fichiers.'
          }
        ]
      },
      {
        id: 6,
        title: 'Série 6 – Niveau Très Avancé',
        difficulty: 'très-difficile',
        difficultyLevel: 6,
        questions: [
          {
            id: 31,
            text: 'Quelle version d\'IIS a introduit la prise en charge native de l\'IPv6 et une meilleure fiabilité ?',
            options: [
              { id: 0, text: 'IIS 3.0' },
              { id: 1, text: 'IIS 5.0' },
              { id: 2, text: 'IIS 6.0' },
              { id: 3, text: 'IIS 7.0' }
            ],
            correctAnswerId: 2,
            explanation: 'IIS 6.0 (Windows Server 2003) a apporté IPv6 et un renforcement de la stabilité.'
          },
          {
            id: 32,
            text: 'Comparé à Apache, IIS offre un avantage principal :',
            options: [
              { id: 0, text: 'Multi‑plateforme' },
              { id: 1, text: 'Intégration étroite avec .NET et ASPX' },
              { id: 2, text: 'Gratuit et open‑source' },
              { id: 3, text: 'Commandes Linux natives' }
            ],
            correctAnswerId: 1,
            explanation: 'IIS s\'intègre directement avec les technologies Microsoft (.NET, ASPX).'
          },
          {
            id: 33,
            text: 'Quelle fonctionnalité HTTP/2 dans IIS 10 améliore surtout la latence ?',
            options: [
              { id: 0, text: 'Push serveur' },
              { id: 1, text: 'Compression gzip' },
              { id: 2, text: 'Long polling' },
              { id: 3, text: 'Chunked transfer' }
            ],
            correctAnswerId: 0,
            explanation: 'HTTP/2 permet le server push pour envoyer des ressources proactivement, réduisant les aller‑retour.'
          },
          {
            id: 34,
            text: 'Pour restreindre l\'accès en lecture seule à un répertoire web, on coche quelle permission lors de la création du site ?',
            options: [
              { id: 0, text: 'Lecture' },
              { id: 1, text: 'Écriture' },
              { id: 2, text: 'Exécution' },
              { id: 3, text: 'Listage' }
            ],
            correctAnswerId: 0,
            explanation: 'L\'accès « Lecture » suffit pour servir les fichiers sans autoriser la modification.'
          },
          {
            id: 35,
            text: 'Le déploiement minimal sur Nano Server est supporté à partir de quelle version d\'IIS ?',
            options: [
              { id: 0, text: 'IIS 7.5' },
              { id: 1, text: 'IIS 8.0' },
              { id: 2, text: 'IIS 8.5' },
              { id: 3, text: 'IIS 10' }
            ],
            correctAnswerId: 3,
            explanation: 'IIS 10, introduit avec Windows Server 2016, peut fonctionner sur Nano Server en déploiement minimal.'
          },
          {
            id: 36,
            text: 'La configuration avancée des en‑têtes HTTP côté serveur (compression, cache) s\'effectue généralement dans :',
            options: [
              { id: 0, text: 'web.config' },
              { id: 1, text: 'hosts' },
              { id: 2, text: 'machines.config' },
              { id: 3, text: 'dotnet.exe' }
            ],
            correctAnswerId: 0,
            explanation: 'Le fichier web.config permet de définir règles de compression, caching et en‑têtes au niveau du site/application.'
          }
        ]
      }
    ];
  }

  private getDNSServiceMcqGroups(): MCQGroup[] {
    // QCM pour le cours de Service DNS
    return [
      {
        id: 1,
        title: 'Série 1 (Très facile)',
        difficulty: 'facile',
        difficultyLevel: 1,
        questions: [
          {
            id: 1,
            text: 'Que signifie l\'acronyme DNS ?',
            options: [
              { id: 0, text: 'Direct Name Service' },
              { id: 1, text: 'Data Network Service' },
              { id: 2, text: 'Domain Name System' },
              { id: 3, text: 'Domain Number Sequence' }
            ],
            correctAnswerId: 2,
            explanation: 'DNS est le système de résolution de noms de domaine sur Internet.'
          },
          {
            id: 2,
            text: 'Quel fichier local Windows contient, par défaut, l\'association localhost → 127.0.0.1 ?',
            options: [
              { id: 0, text: 'lmhosts' },
              { id: 1, text: 'hosts' },
              { id: 2, text: 'resolv.conf' },
              { id: 3, text: 'named.conf' }
            ],
            correctAnswerId: 1,
            explanation: 'Le fichier hosts (dans %SYSTEMROOT%\\system32\\drivers\\etc) contient statiquement le mappage localhost → 127.0.0.1.'
          },
          {
            id: 3,
            text: 'Quelle est la longueur en bits d\'une adresse IPv4 ?',
            options: [
              { id: 0, text: '16 bits' },
              { id: 1, text: '32 bits' },
              { id: 2, text: '64 bits' },
              { id: 3, text: '128 bits' }
            ],
            correctAnswerId: 1,
            explanation: 'Une adresse IPv4 est codée sur 32 bits.'
          },
          {
            id: 4,
            text: 'Quel caractère n\'est pas autorisé dans un nom d\'hôte DNS ?',
            options: [
              { id: 0, text: 'Trait d\'union -' },
              { id: 1, text: 'Point .' },
              { id: 2, text: 'Chiffre' },
              { id: 3, text: 'Lettre' }
            ],
            correctAnswerId: 1,
            explanation: 'Le caractère "." est interdit dans un nom d\'hôte DNS, réservé à la séparation des étiquettes.'
          },
          {
            id: 5,
            text: 'Quel est le rôle principal d\'un serveur de noms DNS ?',
            options: [
              { id: 0, text: 'Transférer des fichiers' },
              { id: 1, text: 'Traduire des noms d\'hôte en adresses IP' },
              { id: 2, text: 'Gérer les utilisateurs' },
              { id: 3, text: 'Chiffrer les paquets' }
            ],
            correctAnswerId: 1,
            explanation: 'Un serveur DNS établit la correspondance nom → IP.'
          },
          {
            id: 6,
            text: 'Quel outil permet d\'afficher le cache DNS sous Windows ?',
            options: [
              { id: 0, text: 'ipconfig /displaydns' },
              { id: 1, text: 'nslookup' },
              { id: 2, text: 'dig' },
              { id: 3, text: 'nbtstat –c' }
            ],
            correctAnswerId: 0,
            explanation: 'La commande ipconfig /displaydns affiche le cache DNS du client.'
          }
        ]
      },
      {
        id: 2,
        title: 'Série 2 (Facile)',
        difficulty: 'facile-moyen',
        difficultyLevel: 2,
        questions: [
          {
            id: 7,
            text: 'Quel ancien protocole Microsoft a précédé DNS pour la résolution de noms ?',
            options: [
              { id: 0, text: 'DHCP' },
              { id: 1, text: 'NetBIOS' },
              { id: 2, text: 'SNMP' },
              { id: 3, text: 'WINS' }
            ],
            correctAnswerId: 1,
            explanation: 'NetBIOS a été le premier mécanisme de résolution sous Windows (IBM, 1980).'
          },
          {
            id: 8,
            text: 'Quel inconvénient a conduit à l\'adoption de DNS vs NetBIOS ?',
            options: [
              { id: 0, text: 'Manque de chiffrement' },
              { id: 1, text: 'Limite de 16 caractères' },
              { id: 2, text: 'Trop de hiérarchie' },
              { id: 3, text: 'Trop lent' }
            ],
            correctAnswerId: 1,
            explanation: 'NetBIOS ne gère que 16 caractères et n\'est pas hiérarchique.'
          },
          {
            id: 9,
            text: 'Quelle commande Windows vide le cache DNS ?',
            options: [
              { id: 0, text: 'ipconfig /cleandns' },
              { id: 1, text: 'ipconfig /flushdns' },
              { id: 2, text: 'nbtstat –r' },
              { id: 3, text: 'dnsflush' }
            ],
            correctAnswerId: 1,
            explanation: 'ipconfig /flushdns efface le cache DNS du client.'
          },
          {
            id: 10,
            text: 'Quelle taille maximale pour un nom d\'hôte DNS ?',
            options: [
              { id: 0, text: '63 caractères' },
              { id: 1, text: '128 caractères' },
              { id: 2, text: '255 caractères' },
              { id: 3, text: '512 caractères' }
            ],
            correctAnswerId: 2,
            explanation: 'Un nom d\'hôte DNS peut contenir jusqu\'à 255 caractères alphanumériques.'
          },
          {
            id: 11,
            text: 'Quel type de requête DNS un client envoie-t-il toujours à son serveur ?',
            options: [
              { id: 0, text: 'Iterative' },
              { id: 1, text: 'Inverse' },
              { id: 2, text: 'Récursive' },
              { id: 3, text: 'Directe' }
            ],
            correctAnswerId: 2,
            explanation: 'la requête client → serveur DNS est toujours récursive.'
          },
          {
            id: 12,
            text: 'Après échec DNS, quel mécanisme Windows est utilisé en dernier recours ?',
            options: [
              { id: 0, text: 'WINS' },
              { id: 1, text: 'lmhosts' },
              { id: 2, text: 'Réseau' },
              { id: 3, text: 'NetBIOS' }
            ],
            correctAnswerId: 3,
            explanation: 'Si le DNS ne résout pas, la résolution NetBIOS s\'active en dernier.'
          }
        ]
      },
      {
        id: 3,
        title: 'Série 3 (Moyen)',
        difficulty: 'moyen',
        difficultyLevel: 3,
        questions: [
          {
            id: 13,
            text: 'Ordre de résolution de nom côté client',
            options: [
              { id: 0, text: 'hosts → cache → DNS → NetBIOS' },
              { id: 1, text: 'cache → hosts → DNS → NetBIOS' },
              { id: 2, text: 'DNS → cache → hosts → NetBIOS' },
              { id: 3, text: 'cache → DNS → hosts → NetBIOS' }
            ],
            correctAnswerId: 1,
            explanation: 'Le client vérifie d\'abord le cache, puis hosts, le serveur DNS, enfin NetBIOS.'
          },
          {
            id: 14,
            text: 'Quel enregistrement DNS permet de créer un alias ?',
            options: [
              { id: 0, text: 'A' },
              { id: 1, text: 'MX' },
              { id: 2, text: 'CNAME' },
              { id: 3, text: 'PTR' }
            ],
            correctAnswerId: 2,
            explanation: 'CNAME (Canonical Name) mappe un nom d\'hôte vers un autre.'
          },
          {
            id: 15,
            text: 'Quel enregistrement DNS pointe vers un serveur de messagerie ?',
            options: [
              { id: 0, text: 'SRV' },
              { id: 1, text: 'HINFO' },
              { id: 2, text: 'MX' },
              { id: 3, text: 'NS' }
            ],
            correctAnswerId: 2,
            explanation: 'MX (Mail Exchanger) identifie les serveurs de messagerie.'
          },
          {
            id: 16,
            text: 'Quel domaine est réservé aux recherches inversées IPv4 de classe C ?',
            options: [
              { id: 0, text: 'in-addr.arpa' },
              { id: 1, text: '168.192.in-addr.arpa' },
              { id: 2, text: '255.255.in-addr.arpa' },
              { id: 3, text: 'reverse.ipv4' }
            ],
            correctAnswerId: 1,
            explanation: 'Le sous-domaine 168.192.in-addr.arpa couvre les IP 192.168.0.1–255.254.'
          },
          {
            id: 17,
            text: 'Quel type de zone DNS est une copie en lecture seule d\'une principale ?',
            options: [
              { id: 0, text: 'Secondaire' },
              { id: 1, text: 'Stub' },
              { id: 2, text: 'Primaire' },
              { id: 3, text: 'Inverse' }
            ],
            correctAnswerId: 0,
            explanation: 'Une zone secondaire est une copie R/O d\'une zone principale.'
          },
          {
            id: 18,
            text: 'Quel enregistrement DNS reprend l\'adresse IP → nom d\'hôte ?',
            options: [
              { id: 0, text: 'A' },
              { id: 1, text: 'PTR' },
              { id: 2, text: 'AAAA' },
              { id: 3, text: 'CNAME' }
            ],
            correctAnswerId: 1,
            explanation: 'PTR (Pointer) mappe une adresse IP vers un nom d\'hôte.'
          }
        ]
      },
      {
        id: 4,
        title: 'Série 4 (Moyen / Difficile)',
        difficulty: 'moyen-difficile',
        difficultyLevel: 4,
        questions: [
          {
            id: 19,
            text: 'Quel fichier stocke la liste des serveurs racine DNS localement ?',
            options: [
              { id: 0, text: 'root.hints' },
              { id: 1, text: 'Cache.dns' },
              { id: 2, text: 'resolv.conf' },
              { id: 3, text: 'named.cache' }
            ],
            correctAnswerId: 1,
            explanation: 'Les indications de racine sont dans Cache.dns (%systemroot%\\System32\\Dns).'
          },
          {
            id: 20,
            text: 'Combien y a‑t‑il de serveurs DNS racine dans le monde ?',
            options: [
              { id: 0, text: '7' },
              { id: 1, text: '13' },
              { id: 2, text: '21' },
              { id: 3, text: '32' }
            ],
            correctAnswerId: 1,
            explanation: 'Il existe 13 serveurs DNS racines répartis mondialement.'
          },
          {
            id: 21,
            text: 'Qu\'est‑ce qu\'un stub zone ?',
            options: [
              { id: 0, text: 'Zone principale en lecture/écriture' },
              { id: 1, text: 'Copie partielle avec SOA, NS et A' },
              { id: 2, text: 'Zone inverse' },
              { id: 3, text: 'Zone DNS integrée AD' }
            ],
            correctAnswerId: 1,
            explanation: 'Les zones de stub contiennent uniquement les enregistrements SOA, NS et A.'
          },
          {
            id: 22,
            text: 'Quel enregistrement DNS identifie les serveurs de noms d\'une zone ?',
            options: [
              { id: 0, text: 'MX' },
              { id: 1, text: 'NS' },
              { id: 2, text: 'SOA' },
              { id: 3, text: 'HINFO' }
            ],
            correctAnswerId: 1,
            explanation: 'NS (Name Server) liste les serveurs DNS faisant autorité d\'une zone.'
          },
          {
            id: 23,
            text: 'Comment appelle‑t‑on un nom d\'hôte + suffixe DNS ?',
            options: [
              { id: 0, text: 'Hostname' },
              { id: 1, text: 'FQDN' },
              { id: 2, text: 'Alias' },
              { id: 3, text: 'Domaine inversé' }
            ],
            correctAnswerId: 1,
            explanation: 'FQDN = nom d\'hôte + suffixe DNS, ex. CLIENT-11.students.supinfo.com.'
          },
          {
            id: 24,
            text: 'Quel record DNS permet la découverte de services (ex. HTTP ou contrôleur de domaine) ?',
            options: [
              { id: 0, text: 'SRV' },
              { id: 1, text: 'TXT' },
              { id: 2, text: 'AAAA' },
              { id: 3, text: 'PTR' }
            ],
            correctAnswerId: 0,
            explanation: 'Les enregistrements SRV mappent un service vers le(s) serveur(s) le fournissant.'
          }
        ]
      },
      {
        id: 5,
        title: 'Série 5 (Difficile)',
        difficulty: 'difficile',
        difficultyLevel: 5,
        questions: [
          {
            id: 25,
            text: 'Quel type de requête DNS un serveur envoie‑t‑il à ses redirecteurs ?',
            options: [
              { id: 0, text: 'Iterative' },
              { id: 1, text: 'Inverse' },
              { id: 2, text: 'Récursive' },
              { id: 3, text: 'Statique' }
            ],
            correctAnswerId: 2,
            explanation: 'Si un serveur dispose de redirecteurs, il leur envoie une requête récursive.'
          },
          {
            id: 26,
            text: 'Quel nœud NetBT Windows est l\'ordre par défaut pour NetBIOS H ?',
            options: [
              { id: 0, text: 'Broadcast only' },
              { id: 1, text: 'Peer‑Peer' },
              { id: 2, text: 'Hybride' },
              { id: 3, text: 'WINS‑only' }
            ],
            correctAnswerId: 2,
            explanation: 'Le nœud NetBT H (hybride) effectue cache → WINS → broadcast → lmhosts.'
          },
          {
            id: 27,
            text: 'Quel numéro d\'option DHCP correspond au type de nœud NetBT ?',
            options: [
              { id: 0, text: '15' },
              { id: 1, text: '46' },
              { id: 2, text: '67' },
              { id: 3, text: '99' }
            ],
            correctAnswerId: 1,
            explanation: 'L\'option DHCP 46 configure le type de nœud NetBT du client.'
          },
          {
            id: 28,
            text: 'Quel fichier Windows est consulté après le broadcast NetBIOS ?',
            options: [
              { id: 0, text: 'hosts' },
              { id: 1, text: 'lmhosts' },
              { id: 2, text: 'resolv.conf' },
              { id: 3, text: 'Cache.dns' }
            ],
            correctAnswerId: 1,
            explanation: 'Après le broadcast, Windows cherche dans %SYSTEMROOT%\\...\\etc\\lmhosts.'
          },
          {
            id: 29,
            text: 'Quel record DNS contient le serveur de zone principale ?',
            options: [
              { id: 0, text: 'NS' },
              { id: 1, text: 'SOA' },
              { id: 2, text: 'A' },
              { id: 3, text: 'PTR' }
            ],
            correctAnswerId: 1,
            explanation: 'L\'enregistrement SOA (Start Of Authority) indique l\'hôte et l\'IP du serveur principal.'
          },
          {
            id: 30,
            text: 'Quel record signale un serveur WINS en cas d\'échec DNS ?',
            options: [
              { id: 0, text: 'WINS' },
              { id: 1, text: 'WINS-R' },
              { id: 2, text: 'CNAME' },
              { id: 3, text: 'HINFO' }
            ],
            correctAnswerId: 0,
            explanation: 'L\'enregistrement WINS indique au DNS l\'IP d\'un serveur WINS à interroger.'
          }
        ]
      },
      {
        id: 6,
        title: 'Série 6 (Très difficile)',
        difficulty: 'très-difficile',
        difficultyLevel: 6,
        questions: [
          {
            id: 31,
            text: 'Dans une résolution récursive, si le serveur DNS n\'a pas de redirecteurs, vers qui envoie-t-il une requête itérative ?',
            options: [
              { id: 0, text: 'Un DNS racine' },
              { id: 1, text: 'Un serveur secondaire' },
              { id: 2, text: 'Un stub zone' },
              { id: 3, text: 'Un netbios node' }
            ],
            correctAnswerId: 0,
            explanation: 'Sans redirecteurs, le serveur envoie une requête itérative aux serveurs racine (root hints).'
          },
          {
            id: 32,
            text: 'Quelle option DHCP configure un redirecteur DNS côté client ?',
            options: [
              { id: 0, text: '46' },
              { id: 1, text: '15' },
              { id: 2, text: '006' },
              { id: 3, text: '077' }
            ],
            correctAnswerId: 2,
            explanation: 'L\'option 006 DHCP définit les adresses des serveurs DNS du client.'
          },
          {
            id: 33,
            text: 'Dans une délégation, que doit configurer le DNS secondaire des sous‑domaines pour résoudre le domaine parent ?',
            options: [
              { id: 0, text: 'Enregistrement SRV' },
              { id: 1, text: 'Redirecteur vers le parent' },
              { id: 2, text: 'Stub zone du parent' },
              { id: 3, text: 'Hosts file' }
            ],
            correctAnswerId: 1,
            explanation: 'Les DNS des sous-domaines doivent pointer vers le serveur DNS parent par un redirecteur.'
          },
          {
            id: 34,
            text: 'Quel est le nom de la zone inversée pour le réseau 172.16.0.0/16 ?',
            options: [
              { id: 0, text: '16.172.in-addr.arpa' },
              { id: 1, text: '0.16.in-addr.arpa' },
              { id: 2, text: '172.16.in-addr.arpa' },
              { id: 3, text: '16.0.in-addr.arpa' }
            ],
            correctAnswerId: 0,
            explanation: 'Pour 172.16.x.x, la zone est 16.172.in-addr.arpa.'
          },
          {
            id: 35,
            text: 'Quel type de zone DNS peut être stocké dans Active Directory ?',
            options: [
              { id: 0, text: 'Secondaire' },
              { id: 1, text: 'Stub' },
              { id: 2, text: 'Intégrée AD' },
              { id: 3, text: 'Inverse' }
            ],
            correctAnswerId: 2,
            explanation: 'Les zones principales et stub peuvent être intégrées à AD pour performance et sécurité.'
          },
          {
            id: 36,
            text: 'Quel record DNS priorise un serveur de service X sur un autre ?',
            options: [
              { id: 0, text: 'PTR' },
              { id: 1, text: 'MX' },
              { id: 2, text: 'SRV' },
              { id: 3, text: 'NS' }
            ],
            correctAnswerId: 2,
            explanation: 'Les enregistrements SRV acceptent un champ de priorité pour chaque service.'
          }
        ]
      }
    ];
  }

  private getDHCPServiceMcqGroups(): MCQGroup[] {
    // QCM pour le cours de Service DHCP
    return [
      {
        id: 1,
        title: 'Série 1 – Niveau Facile',
        difficulty: 'facile',
        difficultyLevel: 1,
        questions: [
          {
            id: 1,
            text: 'Que signifie l\'acronyme DHCP ?',
            options: [
              { id: 0, text: 'Dynamic Host Configuration Protocol' },
              { id: 1, text: 'Direct Host Control Process' },
              { id: 2, text: 'Dynamic Hypertext Configuration Protocol' },
              { id: 3, text: 'Distributed Host Configuration Procedure' }
            ],
            correctAnswerId: 0,
            explanation: 'DHCP configure automatiquement les paramètres IP des hôtes.'
          },
          {
            id: 2,
            text: 'Quel port UDP utilise un client DHCP pour envoyer DHCPDISCOVER ?',
            options: [
              { id: 0, text: '67' },
              { id: 1, text: '68' },
              { id: 2, text: '69' },
              { id: 3, text: '53' }
            ],
            correctAnswerId: 1,
            explanation: 'Le client écoute sur le port 68, le serveur sur le 67.'
          },
          {
            id: 3,
            text: 'Quel message le serveur envoie-t‑il pour proposer une adresse IP ?',
            options: [
              { id: 0, text: 'DHCPREQUEST' },
              { id: 1, text: 'DHCPACK' },
              { id: 2, text: 'DHCPOFFER' },
              { id: 3, text: 'DHCPDISCOVER' }
            ],
            correctAnswerId: 2,
            explanation: 'DHCPOFFER est la proposition du serveur.'
          },
          {
            id: 4,
            text: 'Quel paramètre n\'est PAS distribué par DHCP ?',
            options: [
              { id: 0, text: 'Adresse IP' },
              { id: 1, text: 'Masque de sous‑réseau' },
              { id: 2, text: 'Adresse MAC' },
              { id: 3, text: 'Passerelle par défaut' }
            ],
            correctAnswerId: 2,
            explanation: 'L\'adresse MAC est fixe et non attribuée par DHCP.'
          },
          {
            id: 5,
            text: 'Le "bail" (lease) DHCP correspond à :',
            options: [
              { id: 0, text: 'La durée d\'attribution de l\'IP' },
              { id: 1, text: 'Le type de cryptage' },
              { id: 2, text: 'L\'identifiant matériel du client' },
              { id: 3, text: 'Le niveau de priorité' }
            ],
            correctAnswerId: 0,
            explanation: 'Le bail définit combien de temps l\'IP est valable.'
          },
          {
            id: 6,
            text: 'À quel moment un client renouvelle-t‑il son bail (T1) ?',
            options: [
              { id: 0, text: '25 % de la durée de bail' },
              { id: 1, text: '50 % de la durée de bail' },
              { id: 2, text: '75 % de la durée de bail' },
              { id: 3, text: '100 % de la durée de bail' }
            ],
            correctAnswerId: 1,
            explanation: 'Le client envoie DHCPREQUEST à T1 = 50 % du bail.'
          }
        ]
      },
      {
        id: 2,
        title: 'Série 2 – Niveau Facile‑Intermédiaire',
        difficulty: 'facile-moyen',
        difficultyLevel: 2,
        questions: [
          {
            id: 7,
            text: 'Quel champ du message DHCP identifie de façon unique le client ?',
            options: [
              { id: 0, text: 'chaddr (client hardware address)' },
              { id: 1, text: 'yiaddr (your IP address)' },
              { id: 2, text: 'xid (transaction ID)' },
              { id: 3, text: 'giaddr (gateway IP address)' }
            ],
            correctAnswerId: 0,
            explanation: 'chaddr contient l\'MAC du client, unique.'
          },
          {
            id: 8,
            text: 'Dans un environnement multi‑réseau, quel champ permet au serveur de savoir via quel relay ?',
            options: [
              { id: 0, text: 'ciaddr' },
              { id: 1, text: 'giaddr' },
              { id: 2, text: 'siaddr' },
              { id: 3, text: 'yiaddr' }
            ],
            correctAnswerId: 1,
            explanation: 'giaddr est l\'adresse du agent‑relay.'
          },
          {
            id: 9,
            text: 'Quel message confirme l\'acceptation de l\'offre par le client ?',
            options: [
              { id: 0, text: 'DHCPDISCOVER' },
              { id: 1, text: 'DHCPREQUEST' },
              { id: 2, text: 'DHCPOFFER' },
              { id: 3, text: 'DHCPACK' }
            ],
            correctAnswerId: 3,
            explanation: 'DHCPACK valide l\'offre et finalise l\'attribution.'
          },
          {
            id: 10,
            text: 'Que se passe-t‑il si le serveur DHCP ne répond pas au renouvellement ?',
            options: [
              { id: 0, text: 'Le client conserve l\'IP indéfiniment' },
              { id: 1, text: 'Le client repart en discovery' },
              { id: 2, text: 'Le client utilise l\'IP en mode statique' },
              { id: 3, text: 'Le client relance DHCPDISCOVER immédiatement' }
            ],
            correctAnswerId: 1,
            explanation: 'Sans ACK à la demande de renouvellement, il redéclenche discovery.'
          },
          {
            id: 11,
            text: 'Quel mécanisme assure la haute disponibilité des serveurs DHCP ?',
            options: [
              { id: 0, text: 'VRRP' },
              { id: 1, text: 'HSRP' },
              { id: 2, text: 'Clustering DHCP' },
              { id: 3, text: 'Toutes ces réponses' }
            ],
            correctAnswerId: 3,
            explanation: 'VRRP, HSRP ou clustering peuvent être utilisés.'
          },
          {
            id: 12,
            text: 'Quelle option DHCP permet de fournir plusieurs serveurs DNS ?',
            options: [
              { id: 0, text: 'Option 6' },
              { id: 1, text: 'Option 3' },
              { id: 2, text: 'Option 15' },
              { id: 3, text: 'Option 51' }
            ],
            correctAnswerId: 0,
            explanation: 'Option 6 définit la liste des DNS.'
          }
        ]
      },
      {
        id: 3,
        title: 'Série 3 – Niveau Intermédiaire',
        difficulty: 'moyen',
        difficultyLevel: 3,
        questions: [
          {
            id: 13,
            text: 'Quel timer DHCP correspond à la seconde phase de renouvellement (T2) ?',
            options: [
              { id: 0, text: '50 % du bail' },
              { id: 1, text: '75 % du bail' },
              { id: 2, text: '90 % du bail' },
              { id: 3, text: '100 % du bail' }
            ],
            correctAnswerId: 1,
            explanation: 'T2 = 0,875 × lease, souvent arrondi à 75 %.'
          },
          {
            id: 14,
            text: 'Lors d\'un NAK DHCP, que doit faire le client ?',
            options: [
              { id: 0, text: 'Continuer avec l\'adresse actuelle' },
              { id: 1, text: 'Recommencer discovery' },
              { id: 2, text: 'Passer en statique' },
              { id: 3, text: 'Attendre T2' }
            ],
            correctAnswerId: 1,
            explanation: 'Un NAK l\'incite à redémarrer le processus.'
          },
          {
            id: 15,
            text: 'Quel type d\'option DHCP transporte l\'option "router" (passerelle) ?',
            options: [
              { id: 0, text: 'Option à longueur fixe' },
              { id: 1, text: 'Option à longueur variable' },
              { id: 2, text: 'Option à code élevé' },
              { id: 3, text: 'Option vendor‑specific' }
            ],
            correctAnswerId: 1,
            explanation: 'La passerelle par défaut est une liste d\'adresses, longueur variable.'
          },
          {
            id: 16,
            text: 'Dans quel cas le serveur DHCP inclut-il siaddr ?',
            options: [
              { id: 0, text: 'Jamais' },
              { id: 1, text: 'Quand il redirige via un relay' },
              { id: 2, text: 'Quand il répond directement' },
              { id: 3, text: 'Quand il renvoie un NAK' }
            ],
            correctAnswerId: 2,
            explanation: 'siaddr = adresse du serveur qui répond.'
          },
          {
            id: 17,
            text: 'Quel état client DHCP précède l\'état BOUND ?',
            options: [
              { id: 0, text: 'REQUESTING' },
              { id: 1, text: 'INIT' },
              { id: 2, text: 'SELECTING' },
              { id: 3, text: 'RENEWING' }
            ],
            correctAnswerId: 2,
            explanation: 'Après OFFER, le client est en SELECTING avant REQUESTING.'
          },
          {
            id: 18,
            text: 'Quel est l\'impact d\'un bail très court (ex. 60 s) ?',
            options: [
              { id: 0, text: 'Plus de charge serveur' },
              { id: 1, text: 'Moins de disponibilité' },
              { id: 2, text: 'Moins de renouvellement' },
              { id: 3, text: 'Aucun' }
            ],
            correctAnswerId: 0,
            explanation: 'Bails courts génèrent plus de trafic et de charge.'
          }
        ]
      },
      {
        id: 4,
        title: 'Série 4 – Niveau Intermédiaire‑Avancé',
        difficulty: 'moyen-difficile',
        difficultyLevel: 4,
        questions: [
          {
            id: 19,
            text: 'Quel champ du DHCPDISCOVER choisit un client si plusieurs offres arrivent ?',
            options: [
              { id: 0, text: 'premier reçu' },
              { id: 1, text: 'plus haute priorité' },
              { id: 2, text: 'plus grand lease' },
              { id: 3, text: 'plus grand masque' }
            ],
            correctAnswerId: 0,
            explanation: 'Le client accepte généralement la première offre reçue.'
          },
          {
            id: 20,
            text: 'Lors d\'un failover DHCP en mode split – active/active, que se passe-t‑il si un serveur tombe ?',
            options: [
              { id: 0, text: 'L\'autre prend 100 % des bails' },
              { id: 1, text: 'Bails non renouvelés' },
              { id: 2, text: 'Clients perdent IP' },
              { id: 3, text: 'Clustering redémarre' }
            ],
            correctAnswerId: 0,
            explanation: 'Le pair prend tous les bails en charge.'
          },
          {
            id: 21,
            text: 'Quel algorithme de répartition utilise Microsoft DHCP ?',
            options: [
              { id: 0, text: 'Round‑robin' },
              { id: 1, text: 'Incremental' },
              { id: 2, text: 'Random' },
              { id: 3, text: 'Hash‑based' }
            ],
            correctAnswerId: 1,
            explanation: 'Microsoft utilise un incrémental sur la liste des baux.'
          },
          {
            id: 22,
            text: 'Quelle option vendor‑specific est souvent utilisée pour PXE ?',
            options: [
              { id: 0, text: 'Option 43' },
              { id: 1, text: 'Option 60' },
              { id: 2, text: 'Option 66' },
              { id: 3, text: 'Option 67' }
            ],
            correctAnswerId: 0,
            explanation: 'Option 43 transporte les paramètres vendor, dont PXE.'
          },
          {
            id: 23,
            text: 'Comment surveiller le taux de renouvellement DHCP ?',
            options: [
              { id: 0, text: 'SNMP' },
              { id: 1, text: 'Netflow' },
              { id: 2, text: 'Syslog' },
              { id: 3, text: 'Tous' }
            ],
            correctAnswerId: 0,
            explanation: 'SNMP fournit les compteurs MIB pour DHCP.'
          },
          {
            id: 24,
            text: 'Quel défaut peut survenir si le pool d\'adresses est trop petit ?',
            options: [
              { id: 0, text: 'Exhaustion' },
              { id: 1, text: 'Looping' },
              { id: 2, text: 'Starvation' },
              { id: 3, text: 'Fragmentation' }
            ],
            correctAnswerId: 0,
            explanation: 'Un pool insuffisant conduit à l\'épuisement d\'adresses.'
          }
        ]
      },
      {
        id: 5,
        title: 'Série 5 – Niveau Avancé',
        difficulty: 'difficile',
        difficultyLevel: 5,
        questions: [
          {
            id: 25,
            text: 'Dans le failover DHCP en mode load‑balance, quel split ?',
            options: [
              { id: 0, text: '50/50' },
              { id: 1, text: '60/40' },
              { id: 2, text: '80/20' },
              { id: 3, text: '100/0' }
            ],
            correctAnswerId: 0,
            explanation: 'Load‑balance répartit équitablement 50/50.'
          },
          {
            id: 26,
            text: 'Quel MIB SNMP contient les statistiques de bail ?',
            options: [
              { id: 0, text: 'dhcpMIB' },
              { id: 1, text: 'dhcpServerMIB' },
              { id: 2, text: 'dhcpLeaseMIB' },
              { id: 3, text: 'dhcpStatsMIB' }
            ],
            correctAnswerId: 2,
            explanation: 'dhcpLeaseMIB détaille les baux.'
          },
          {
            id: 27,
            text: 'Quelle commande Linux affiche les messages DHCP sur le client ?',
            options: [
              { id: 0, text: 'dhclient -v' },
              { id: 1, text: 'ifconfig' },
              { id: 2, text: 'dhcpd' },
              { id: 3, text: 'systemctl status dhcp' }
            ],
            correctAnswerId: 0,
            explanation: 'dhclient -v montre le dialogue DHCP.'
          },
          {
            id: 28,
            text: 'Quel est l\'effet de l\'option rapid‑commit ?',
            options: [
              { id: 0, text: 'Supprime T1/T2' },
              { id: 1, text: 'Double la durée de bail' },
              { id: 2, text: 'Passe en statique' },
              { id: 3, text: 'Nécessite deux aller‑retour supplémentaires' }
            ],
            correctAnswerId: 0,
            explanation: 'Rapid‑commit combine OFFER+ACK pour un seul aller‑retour.'
          },
          {
            id: 29,
            text: 'Comment un relay DHCP ajoute‑t‑il son identification ?',
            options: [
              { id: 0, text: 'Modifie chaddr' },
              { id: 1, text: 'Remplit giaddr' },
              { id: 2, text: 'Ajoute option 82' },
              { id: 3, text: 'Ajoute option 54' }
            ],
            correctAnswerId: 2,
            explanation: 'Option 82 (agent information) identifie le relay.'
          },
          {
            id: 30,
            text: 'Quel paramètre influence le choix de l\'offre par client (rare) ?',
            options: [
              { id: 0, text: 'TTL IP' },
              { id: 1, text: 'TOS' },
              { id: 2, text: 'DHCP option "preference"' },
              { id: 3, text: 'DHCP option "source"' }
            ],
            correctAnswerId: 2,
            explanation: 'Option "preference" sert à prioriser les offres.'
          }
        ]
      },
      {
        id: 6,
        title: 'Série 6 – Niveau Expert',
        difficulty: 'très-difficile',
        difficultyLevel: 6,
        questions: [
          {
            id: 31,
            text: 'Dans un failover actif/actif, comment se synchronisent les baux ?',
            options: [
              { id: 0, text: 'Via SQL' },
              { id: 1, text: 'Via sockets' },
              { id: 2, text: 'Via fichiers partagés' },
              { id: 3, text: 'Via RPC' }
            ],
            correctAnswerId: 1,
            explanation: 'Les serveurs échangent via socket failover protocol.'
          },
          {
            id: 32,
            text: 'Quelle métrique SNMP observe-t‑on pour détecter un "rogue DHCP server" ?',
            options: [
              { id: 0, text: 'Nombre de NAK' },
              { id: 1, text: 'Nombre de DISCOVER' },
              { id: 2, text: 'Nombre de OFFER' },
              { id: 3, text: 'Nombre de REQUEST' }
            ],
            correctAnswerId: 2,
            explanation: 'Un rogue envoie trop d\'OFFER non sollicités.'
          },
          {
            id: 33,
            text: 'Quel est l\'impact de l\'option DHCP "T1-template" (RFC ?) ?',
            options: [
              { id: 0, text: 'Personnalise T1' },
              { id: 1, text: 'Définit T3' },
              { id: 2, text: 'Modifie taille du pool' },
              { id: 3, text: 'Active rapid‑commit' }
            ],
            correctAnswerId: 0,
            explanation: 'T1-template permet d\'ajuster dynamiquement T1.'
          },
          {
            id: 34,
            text: 'Comment garantir l\'atomicité des mises à jour de bail en cluster ?',
            options: [
              { id: 0, text: 'Verrouillage fichier' },
              { id: 1, text: 'Two‑Phase commit' },
              { id: 2, text: 'Snapshot FS' },
              { id: 3, text: 'Journaling' }
            ],
            correctAnswerId: 1,
            explanation: 'Two‑Phase commit assure l\'atomicité distribuée.'
          },
          {
            id: 35,
            text: 'Dans un environnement virtualisé, quel problème DHCP spécifique peut survenir ?',
            options: [
              { id: 0, text: 'MAC spoofing' },
              { id: 1, text: 'IP leak' },
              { id: 2, text: 'Boot storm' },
              { id: 3, text: 'ARP flux' }
            ],
            correctAnswerId: 2,
            explanation: 'Boot storm = nombreux clients VM redemandent IP simultanément.'
          },
          {
            id: 36,
            text: 'Quel paramètre DHCP option "leasequery" permet d\'interroger un bail d\'un autre serveur ?',
            options: [
              { id: 0, text: 'Option 55' },
              { id: 1, text: 'Option 79' },
              { id: 2, text: 'Option 37' },
              { id: 3, text: 'Option 80' }
            ],
            correctAnswerId: 1,
            explanation: 'Option 79 (DHCPLEASEQUERY) sert à requêter un bail existant.'
          }
        ]
      }
    ];
  }

  private getMockMcqGroups(): MCQGroup[] {
    return [
      {
        id: 1,
        title: 'Groupe 1',
        difficulty: 'facile',
        difficultyLevel: 1,
        questions: [
          {
            id: 1,
            text: 'Quelle définition décrit le mieux un réseau informatique ?',
            options: [
              { id: 0, text: 'Un ensemble d\'ordinateurs isolés' },
              { id: 1, text: 'Un ensemble d\'équipements informatiques interconnectés pour échanger des informations' },
              { id: 2, text: 'Un seul ordinateur puissant' },
              { id: 3, text: 'Un type de logiciel de gestion' }
            ],
            correctAnswerId: 1,
            explanation: 'Un réseau informatique est un ensemble d\'équipements informatiques interconnectés qui échangent des informations suivant des règles bien définies.'
          },
          {
            id: 2,
            text: 'Parmi ces éléments, lequel n\'est pas un équipement réseau ?',
            options: [
              { id: 0, text: 'Routeur' },
              { id: 1, text: 'Imprimante' },
              { id: 2, text: 'Smartphone' },
              { id: 3, text: 'Tableur' }
            ],
            correctAnswerId: 3,
            explanation: 'Un tableur est un logiciel (comme Excel) et non un équipement réseau. Les autres options sont des équipements physiques qui peuvent se connecter au réseau.'
          },
          {
            id: 3,
            text: 'Quel support de transmission utilise des ondes radio ?',
            options: [
              { id: 0, text: 'Câble coaxial' },
              { id: 1, text: 'Fibre optique' },
              { id: 2, text: 'Paire torsadée' },
              { id: 3, text: 'Réseau sans fil (Wireless)' }
            ],
            correctAnswerId: 3,
            explanation: 'Les réseaux sans fil (WiFi, Bluetooth, etc.) utilisent des ondes radio pour transmettre les données, contrairement aux autres qui utilisent des supports physiques.'
          },
          {
            id: 4,
            text: 'Le débit d\'un réseau est exprimé en :',
            options: [
              { id: 0, text: 'bits/s (bps)' },
              { id: 1, text: 'mètres' },
              { id: 2, text: 'joules' },
              { id: 3, text: 'hertz' }
            ],
            correctAnswerId: 0,
            explanation: 'Le débit d\'un réseau s\'exprime en bits par seconde (bps) ou ses multiples (kbps, Mbps, Gbps), indiquant la quantité de données pouvant être transmises par unité de temps.'
          },
          {
            id: 5,
            text: 'La norme IEEE la plus utilisée pour le Wi-Fi est :',
            options: [
              { id: 0, text: '802.3' },
              { id: 1, text: '802.11' },
              { id: 2, text: '802.16' },
              { id: 3, text: '802.5' }
            ],
            correctAnswerId: 1,
            explanation: 'La norme IEEE 802.11 (avec ses variantes a, b, g, n, ac, etc.) est celle qui définit les standards du Wi-Fi. 802.3 correspond à Ethernet, 802.16 au WiMAX et 802.5 au Token Ring.'
          },
          {
            id: 6,
            text: 'Le protocole fondamental sur lequel repose Internet est :',
            options: [
              { id: 0, text: 'HTTP' },
              { id: 1, text: 'FTP' },
              { id: 2, text: 'TCP/IP' },
              { id: 3, text: 'SMTP' }
            ],
            correctAnswerId: 2,
            explanation: 'TCP/IP (Transmission Control Protocol/Internet Protocol) est l\'ensemble de protocoles fondamentaux sur lesquels repose Internet. HTTP, FTP et SMTP sont des protocoles de plus haut niveau qui s\'appuient sur TCP/IP.'
          }
        ]
      },
      {
        id: 2,
        title: 'Groupe 2',
        difficulty: 'facile-moyen',
        difficultyLevel: 2,
        questions: [
          {
            id: 7,
            text: 'Quel avantage n\'est pas propre aux réseaux informatiques ?',
            options: [
              { id: 0, text: 'Partage de ressources' },
              { id: 1, text: 'Communication rapide' },
              { id: 2, text: 'Isolement total des systèmes' },
              { id: 3, text: 'Apprentissage en ligne' }
            ],
            correctAnswerId: 2,
            explanation: 'L\'isolement total des systèmes est l\'opposé de ce que permet un réseau informatique. Les réseaux sont conçus pour connecter et partager, non pour isoler.'
          },
          {
            id: 8,
            text: 'Le partage de ressources matérielles permet :',
            options: [
              { id: 0, text: 'D\'installer des programmes sur un serveur central, accessibles par tous' },
              { id: 1, text: 'D\'exécuter un logiciel uniquement en local' },
              { id: 2, text: 'D\'accroître le nombre de disquettes' },
              { id: 3, text: 'D\'évacuer des données' }
            ],
            correctAnswerId: 0,
            explanation: 'Un des avantages clés des réseaux est de permettre l\'installation de logiciels sur un serveur central, qui sont ensuite accessibles par tous les utilisateurs du réseau.'
          },
          {
            id: 9,
            text: 'Quelle application ne nécessite pas un réseau ?',
            options: [
              { id: 0, text: 'WWW (World Wide Web)' },
              { id: 1, text: 'Messagerie électronique' },
              { id: 2, text: 'Traitement de texte hors ligne' },
              { id: 3, text: 'Transfert de fichiers (FTP)' }
            ],
            correctAnswerId: 2,
            explanation: 'Le traitement de texte hors ligne est la seule application qui ne nécessite pas de réseau. Toutes les autres nécessitent une connexion pour fonctionner.'
          },
          {
            id: 10,
            text: 'Parmi ces protocoles, lequel n\'est pas un service réseau de haut niveau ?',
            options: [
              { id: 0, text: 'DNS' },
              { id: 1, text: 'DHCP' },
              { id: 2, text: 'ICMP' },
              { id: 3, text: 'HTTP' }
            ],
            correctAnswerId: 2,
            explanation: 'ICMP (Internet Control Message Protocol) est un protocole de bas niveau utilisé pour les diagnostics réseau et les messages d\'erreur. DNS, DHCP et HTTP sont des services de haut niveau.'
          },
          {
            id: 11,
            text: 'La diffusion vidéo à la demande s\'appuie principalement sur :',
            options: [
              { id: 0, text: 'SMTP' },
              { id: 1, text: 'DNS' },
              { id: 2, text: 'HTTP' },
              { id: 3, text: 'ARP' }
            ],
            correctAnswerId: 2,
            explanation: 'La diffusion vidéo à la demande utilise principalement HTTP (ou HTTPS) pour diffuser le contenu via les navigateurs web ou des applications dédiées.'
          },
          {
            id: 12,
            text: 'Les réseaux facilitent l\'apprentissage collaboratif grâce à :',
            options: [
              { id: 0, text: 'Modem' },
              { id: 1, text: 'Classes virtuelles' },
              { id: 2, text: 'Répéteurs' },
              { id: 3, text: 'Terminator' }
            ],
            correctAnswerId: 1,
            explanation: 'Les classes virtuelles sont un exemple d\'application réseau facilitant l\'apprentissage collaboratif. Les autres options sont des équipements réseau physiques qui n\'ont pas de rapport direct avec la collaboration.'
          }
        ]
      },
      {
        id: 3,
        title: 'Groupe 3',
        difficulty: 'moyen',
        difficultyLevel: 3,
        questions: [
          {
            id: 13,
            text: 'Un réseau personnel (PAN) se caractérise par une portée inférieure à :',
            options: [
              { id: 0, text: '10 m' },
              { id: 1, text: '1 km' },
              { id: 2, text: '10 km' },
              { id: 3, text: '100 km' }
            ],
            correctAnswerId: 0,
            explanation: 'Un réseau personnel (PAN - Personal Area Network) a typiquement une portée inférieure à 10 mètres, comme le Bluetooth ou les connexions infrarouge.'
          },
          {
            id: 14,
            text: 'Quel protocole sans fil est couramment utilisé pour un WPAN ?',
            options: [
              { id: 0, text: 'Wi-Fi (802.11)' },
              { id: 1, text: 'Ethernet' },
              { id: 2, text: 'Bluetooth' },
              { id: 3, text: 'Token Ring' }
            ],
            correctAnswerId: 2,
            explanation: 'Bluetooth est le protocole sans fil le plus couramment utilisé pour les réseaux personnels sans fil (WPAN - Wireless Personal Area Network).'
          },
          {
            id: 15,
            text: 'Le réseau local (LAN) utilise majoritairement :',
            options: [
              { id: 0, text: 'Ethernet' },
              { id: 1, text: 'Fibre optique' },
              { id: 2, text: 'Coaxial épais' },
              { id: 3, text: 'Satellite' }
            ],
            correctAnswerId: 0,
            explanation: 'Ethernet (IEEE 802.3) est la technologie la plus répandue dans les réseaux locaux (LAN), que ce soit via câble ou pour définir les protocoles de communication sur différents supports.'
          },
          {
            id: 16,
            text: 'Un réseau métropolitain (MAN) couvre typiquement une zone de :',
            options: [
              { id: 0, text: '< 10 m' },
              { id: 1, text: '10 m – 1 km' },
              { id: 2, text: '10 – 25 km' },
              { id: 3, text: '> 100 km' }
            ],
            correctAnswerId: 2,
            explanation: 'Un réseau métropolitain (MAN - Metropolitan Area Network) couvre généralement une zone de 10 à 25 km, correspondant typiquement à une ville ou une métropole.'
          },
          {
            id: 17,
            text: 'Le réseau étendu (WAN) public le plus connu est :',
            options: [
              { id: 0, text: 'Intranet' },
              { id: 1, text: 'Internet' },
              { id: 2, text: 'Extranet' },
              { id: 3, text: 'Hypernet' }
            ],
            correctAnswerId: 1,
            explanation: 'Internet est le réseau étendu (WAN - Wide Area Network) public le plus connu mondialement, connectant des milliards d\'appareils à travers le monde.'
          },
          {
            id: 18,
            text: 'Le réseau cellulaire mobile est un WWAN (Wireless WAN)',
            options: [
              { id: 0, text: 'Vrai' },
              { id: 1, text: 'Faux' }
            ],
            correctAnswerId: 0,
            explanation: 'Vrai. Les réseaux cellulaires mobiles (3G, 4G, 5G) sont classés comme des WWAN (Wireless Wide Area Network) car ils permettent une connexion sans fil sur de grandes distances.'
          }
        ]
      },
      {
        id: 4,
        title: 'Groupe 4',
        difficulty: 'moyen-difficile',
        difficultyLevel: 4,
        questions: [
          {
            id: 19,
            text: 'Pour prévenir les collisions, la topologie en anneau utilise :',
            options: [
              { id: 0, text: 'CSMA/CD' },
              { id: 1, text: 'CSMA/CA' },
              { id: 2, text: 'Jeton (Token Ring)' },
              { id: 3, text: 'TDMA' }
            ],
            correctAnswerId: 2,
            explanation: 'La topologie en anneau, notamment Token Ring, utilise un système de jeton qui circule sur l\'anneau. Seule la station possédant le jeton peut émettre, ce qui empêche les collisions.'
          },
          {
            id: 20,
            text: 'Dans une topologie en bus, l\'absence de terminator provoque :',
            options: [
              { id: 0, text: 'Aucun effet' },
              { id: 1, text: 'Réflexion des signaux et bruit' },
              { id: 2, text: 'Routage automatique' },
              { id: 3, text: 'Élimination des collisions' }
            ],
            correctAnswerId: 1,
            explanation: 'Dans une topologie en bus, l\'absence de terminateur aux extrémités cause des réflexions de signal qui génèrent des interférences et du bruit, perturbant la communication.'
          },
          {
            id: 21,
            text: 'Le mécanisme CSMA/CD est utilisé par :',
            options: [
              { id: 0, text: 'Ethernet 802.3' },
              { id: 1, text: 'Wi-Fi 802.11' },
              { id: 2, text: 'Bluetooth' },
              { id: 3, text: 'Token Ring 802.5' }
            ],
            correctAnswerId: 0,
            explanation: 'CSMA/CD (Carrier Sense Multiple Access with Collision Detection) est utilisé par Ethernet pour gérer les collisions sur les réseaux partagés.'
          },
          {
            id: 22,
            text: 'Le protocole ARP sert à :',
            options: [
              { id: 0, text: 'Traduire les adresses IP en adresses MAC' },
              { id: 1, text: 'Acheminer les paquets IP' },
              { id: 2, text: 'Gérer le chiffrement' },
              { id: 3, text: 'Partager des fichiers' }
            ],
            correctAnswerId: 0,
            explanation: 'Le protocole ARP (Address Resolution Protocol) permet de traduire une adresse IP en adresse MAC, essentiel pour la communication au niveau de la couche liaison de données.'
          },
          {
            id: 23,
            text: 'Le protocole HTTP appartient à la couche :',
            options: [
              { id: 0, text: 'Transport' },
              { id: 1, text: 'Session' },
              { id: 2, text: 'Application' },
              { id: 3, text: 'Présentation' }
            ],
            correctAnswerId: 2,
            explanation: 'HTTP (HyperText Transfer Protocol) est un protocole de la couche Application du modèle OSI. Il définit comment les messages sont formatés et transmis sur le Web.'
          },
          {
            id: 24,
            text: 'Le protocole DHCP opère à la couche :',
            options: [
              { id: 0, text: 'Liaison de données' },
              { id: 1, text: 'Réseau' },
              { id: 2, text: 'Transport' },
              { id: 3, text: 'Application' }
            ],
            correctAnswerId: 3,
            explanation: 'DHCP (Dynamic Host Configuration Protocol) opère à la couche Application du modèle OSI. Il fournit automatiquement les adresses IP et autres paramètres réseau aux hôtes.'
          }
        ]
      },
      {
        id: 5,
        title: 'Groupe 5',
        difficulty: 'difficile',
        difficultyLevel: 5,
        questions: [
          {
            id: 25,
            text: 'Quel équipement régénère le signal et subdivise le réseau en segments ?',
            options: [
              { id: 0, text: 'Répéteur' },
              { id: 1, text: 'Hub' },
              { id: 2, text: 'Bridge' },
              { id: 3, text: 'Modem' }
            ],
            correctAnswerId: 2,
            explanation: 'Le bridge (pont) permet de régénérer le signal et de subdiviser un réseau en segments, filtrant le trafic en fonction des adresses MAC pour réduire les collisions.'
          },
          {
            id: 26,
            text: 'Un switch fonctionne principalement aux couches :',
            options: [
              { id: 0, text: 'Physique uniquement' },
              { id: 1, text: 'Physique & Liaison de données' },
              { id: 2, text: 'Liaison de données & Réseau' },
              { id: 3, text: 'Réseau uniquement' }
            ],
            correctAnswerId: 1,
            explanation: 'Un switch standard opère aux couches 1 (Physique) et 2 (Liaison de données) du modèle OSI, utilisant les adresses MAC pour diriger le trafic.'
          },
          {
            id: 27,
            text: 'Quel équipement assure le routage entre deux réseaux ?',
            options: [
              { id: 0, text: 'Hub' },
              { id: 1, text: 'Bridge' },
              { id: 2, text: 'Switch' },
              { id: 3, text: 'Routeur' }
            ],
            correctAnswerId: 3,
            explanation: 'Le routeur est l\'équipement spécialisé dans le routage du trafic entre différents réseaux, utilisant les adresses IP pour déterminer le meilleur chemin.'
          },
          {
            id: 28,
            text: 'Une passerelle (gateway) peut fonctionner à la couche :',
            options: [
              { id: 0, text: 'Physique' },
              { id: 1, text: 'Transport' },
              { id: 2, text: 'Session' },
              { id: 3, text: 'Toutes les couches du modèle OSI' }
            ],
            correctAnswerId: 3,
            explanation: 'Une passerelle peut fonctionner à toutes les couches du modèle OSI, permettant la conversion de protocoles entre des réseaux différents.'
          },
          {
            id: 29,
            text: 'Pour prolonger la portée d\'un réseau en cuivre, on utilise un :',
            options: [
              { id: 0, text: 'Bridge' },
              { id: 1, text: 'Switch' },
              { id: 2, text: 'Répéteur' },
              { id: 3, text: 'Routeur' }
            ],
            correctAnswerId: 2,
            explanation: 'Un répéteur est utilisé pour amplifier et régénérer les signaux électriques sur un réseau cuivre, permettant ainsi d\'étendre sa portée.'
          },
          {
            id: 30,
            text: 'Quel protocole résout dynamiquement les adresses IP en adresses MAC ?',
            options: [
              { id: 0, text: 'DNS' },
              { id: 1, text: 'DHCP' },
              { id: 2, text: 'ARP' },
              { id: 3, text: 'SNMP' }
            ],
            correctAnswerId: 2,
            explanation: 'ARP (Address Resolution Protocol) est le protocole qui résout dynamiquement les adresses IP en adresses MAC, nécessaires pour la communication au niveau de la couche liaison.'
          }
        ]
      },
      {
        id: 6,
        title: 'Groupe 6',
        difficulty: 'très-difficile',
        difficultyLevel: 6,
        questions: [
          {
            id: 31,
            text: 'Parmi ces technologies, laquelle est typiquement utilisée pour un WMAN (Wireless Metropolitan Area Network) ?',
            options: [
              { id: 0, text: 'Bluetooth (IEEE 802.15)' },
              { id: 1, text: 'WiMAX (IEEE 802.16)' },
              { id: 2, text: 'Wi-Fi (IEEE 802.11)' },
              { id: 3, text: 'Ethernet (IEEE 802.3)' }
            ],
            correctAnswerId: 1,
            explanation: 'WiMAX (IEEE 802.16) est spécifiquement conçu pour les réseaux métropolitains sans fil (WMAN), offrant une couverture de plusieurs kilomètres.'
          },
          {
            id: 32,
            text: 'Un routeur est considéré comme une passerelle de niveau :',
            options: [
              { id: 0, text: '1 (Physique)' },
              { id: 1, text: '2 (Liaison)' },
              { id: 2, text: '3 (Réseau)' },
              { id: 3, text: '4 (Transport)' }
            ],
            correctAnswerId: 2,
            explanation: 'Un routeur est considéré comme une passerelle de niveau 3 (couche Réseau) car il utilise les adresses IP pour acheminer les paquets entre différents réseaux.'
          },
          {
            id: 33,
            text: 'La segmentation des données en paquets dans le modèle OSI est une fonction de la couche :',
            options: [
              { id: 0, text: 'Liaison de données' },
              { id: 1, text: 'Transport' },
              { id: 2, text: 'Réseau' },
              { id: 3, text: 'Présentation' }
            ],
            correctAnswerId: 1,
            explanation: 'La segmentation des données en paquets (ou segments) est une fonction principale de la couche Transport (couche 4) dans le modèle OSI.'
          },
          {
            id: 34,
            text: 'Lors de l\'encapsulation, l\'ajout des adresses MAC source et destination est réalisé par la sous-couche :',
            options: [
              { id: 0, text: 'LLC (Logical Link Control)' },
              { id: 1, text: 'MAC (Medium Access Control)' },
              { id: 2, text: 'Réseau' },
              { id: 3, text: 'Transport' }
            ],
            correctAnswerId: 1,
            explanation: 'La sous-couche MAC (Medium Access Control) de la couche Liaison de données est responsable de l\'ajout des adresses MAC source et destination lors de l\'encapsulation.'
          },
          {
            id: 35,
            text: 'Dans un réseau WLAN 802.11, la méthode d\'accès au média employée est :',
            options: [
              { id: 0, text: 'CSMA/CD' },
              { id: 1, text: 'CSMA/CA' },
              { id: 2, text: 'Token Ring' },
              { id: 3, text: 'FIFO' }
            ],
            correctAnswerId: 1,
            explanation: 'Les réseaux WLAN 802.11 (Wi-Fi) utilisent CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) car la détection des collisions n\'est pas possible dans un environnement sans fil.'
          },
          {
            id: 36,
            text: 'Parmi ces protocoles, lequel n\'appartient pas à la couche application du modèle OSI ?',
            options: [
              { id: 0, text: 'DHCP' },
              { id: 1, text: 'HTTP' },
              { id: 2, text: 'SNMP' },
              { id: 3, text: 'ARP' }
            ],
            correctAnswerId: 3,
            explanation: 'ARP (Address Resolution Protocol) est un protocole de la couche Liaison de données (couche 2), tandis que DHCP, HTTP et SNMP sont des protocoles de la couche Application (couche 7).'
          }
        ]
      }
    ];
  }
}
