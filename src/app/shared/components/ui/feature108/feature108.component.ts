import { AfterViewInit, Component, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: string;
  label: string;
  content: TabContent;
}

@Component({
  selector: 'app-feature108',
  templateUrl: './feature108.component.html',
  styleUrls: ['./feature108.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class Feature108Component implements AfterViewInit {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas  = this.canvasRef.nativeElement;
    const ctx     = canvas.getContext('2d') as CanvasRenderingContext2D;

    const dpr  = window.devicePixelRatio || 1;
    const size = 480;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const baseR    = 160;
    const edgeAmp  = 25;
    const isoFreq  = 0.08;
    const noiseAmp = 0.25;
    const cx = size / 2;
    const cy = size / 2;

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const theta = Math.atan2(dy, dx);
        const dist  = Math.hypot(dx, dy);

        const rEdge = baseR + edgeAmp * Math.sin(theta * 6);
        if (dist <= rEdge) {
          const h = Math.sin(dist * isoFreq * 2 * Math.PI) +
                    Math.sin((theta + dist * 0.03) * 10) * 0.4;

          const n = Math.sin((x * 12.9898 + y * 78.233) * 0.0005) * noiseAmp;
          const v = h + n;

          const stripe = Math.abs(v % 1);
          const alpha  = stripe < 0.08 ? 1 - stripe * 12.5 : 0;

          const idx = (y * size + x) * 4;
          data[idx] = data[idx + 1] = data[idx + 2] = 0;
          data[idx + 3] = alpha * 255;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    ctx.beginPath();
    ctx.lineWidth = 1;
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.02) {
      const r = baseR + edgeAmp * Math.sin(a * 6);
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }

  activeTabIndex = 0;
  
  setActiveTab(index: number): void {
    this.activeTabIndex = index;
  }
  @Input() badge = 'AYJI';
  @Input() heading = 'Pourquoi Choisir Notre Plateforme ?';
  @Input() description = 'Une expérience d\'apprentissage adaptée à vos besoins en Systèmes et Réseaux Informatiques';
  @Input() tabs: Tab[] = [
    {
      value: 'tab-1',
      icon: 'i-zap',  // Classe CSS pour l'icône
      label: 'Apprentissage Simplifié',
      content: {
        badge: 'Pédagogie Accessible',
        title: 'AYJI vous offre des ressources pédagogiques claires et accessibles',
        description: 'Conçues pour simplifier les concepts complexes des Systèmes et Réseaux Informatiques, nos ressources vous permettent d\'apprendre à votre rythme et de maîtriser facilement les notions essentielles.',
        buttonText: 'Découvrir nos cours',
        imageSrc: 'assets/images/apprentissage-simplifie.jpg',
        imageAlt: 'Apprentissage simplifié des SRI'
      }
    },
    {
      value: 'tab-2',
      icon: 'i-shield',  // Classe CSS pour l'icône
      label: 'Accessibilité et Sécurité',
      content: {
        badge: 'Flexibilité Maximale',
        title: 'Étudiez à votre rythme, où que vous soyez',
        description: 'Grâce à une plateforme accessible sur tous vos appareils, poursuivez votre apprentissage où que vous soyez. Vos données sont protégées par des technologies de pointe pour une expérience d\'apprentissage sécurisée.',
        buttonText: 'En savoir plus',
        imageSrc: 'assets/images/accessibilite-securite.jpg',
        imageAlt: 'Accessibilité et sécurité sur AYJI'
      }
    },
    {
      value: 'tab-3',
      icon: 'i-book',  // Classe CSS pour l'icône
      label: 'Contenus Riches',
      content: {
        badge: 'Ressources Évolutives',
        title: 'Profitez d\'une variété de ressources adaptées à votre niveau',
        description: 'Nos contenus sont enrichis par des mises à jour régulières pour rester à la pointe des connaissances en SRI. Des supports variés et interactifs vous permettent d\'approfondir vos connaissances efficacement.',
        buttonText: 'Explorer les ressources',
        imageSrc: 'assets/images/contenus-riches.jpg',
        imageAlt: 'Contenus riches et évolutifs'
      }
    },
    {
      value: 'tab-4',
      icon: 'i-users',  // Classe CSS pour l'icône
      label: 'Accompagnement Personnalisé',
      content: {
        badge: 'Support Sur Mesure',
        title: 'Bénéficiez d\'un support personnalisé et d\'outils interactifs',
        description: 'Notre équipe vous accompagne dans votre parcours d\'apprentissage avec un suivi adapté à vos besoins. Les outils interactifs vous aident à progresser efficacement dans vos études de Systèmes et Réseaux Informatiques.',
        buttonText: 'Contacter l\'équipe',
        imageSrc: 'assets/images/accompagnement-personnalise.jpg',
        imageAlt: 'Accompagnement personnalisé'
      }
    }
  ];
}
