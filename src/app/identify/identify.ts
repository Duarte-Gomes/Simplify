import { Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
import { Camera, MediaResult, MediaTypeSelection } from '@capacitor/camera';
import type { MobileNet } from '@tensorflow-models/mobilenet';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, imagesOutline } from 'ionicons/icons';

interface Prediction {
  className: string;
  probability: number;
}

@Component({
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonText,
  ],
  selector: 'app-identify',
  styleUrl: './identify.scss',
  templateUrl: './identify.html',
})
export class Identify implements OnDestroy {
  private readonly image = viewChild.required<ElementRef<HTMLImageElement>>('photo');

  private model?: Promise<MobileNet>;

  protected readonly photoUrl = signal<string | null>(null);
  protected readonly predictions = signal<Prediction[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    addIcons({ cameraOutline, imagesOutline });
  }

  protected async takePhoto(): Promise<void> {
    await this.pick(() => Camera.takePhoto({ quality: 80, webUseInput: true }));
  }

  protected async chooseFromGallery(): Promise<void> {
    await this.pick(async () => {
      const { results } = await Camera.chooseFromGallery({
        mediaType: MediaTypeSelection.Photo,
        limit: 1,
        quality: 80,
        webUseInput: true,
      });
      return results[0];
    });
  }

  protected async onPhotoLoaded(): Promise<void> {
    try {
      const model = await this.loadModel();
      this.predictions.set(await model.classify(this.image().nativeElement, 3));
    } catch (err) {
      console.error(err);
      this.error.set('Não foi possível identificar a imagem. Tenta novamente.');
    } finally {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.revokePhoto();
  }

  private async pick(source: () => Promise<MediaResult | undefined>): Promise<void> {
    let photo: MediaResult | undefined;
    try {
      photo = await source();
    } catch {
      // O utilizador cancelou ou recusou a permissão.
      return;
    }
    if (!photo?.webPath) {
      return;
    }
    this.revokePhoto();
    this.predictions.set([]);
    this.error.set(null);
    this.loading.set(true);
    this.photoUrl.set(photo.webPath);
  }

  // O TensorFlow.js só é descarregado quando é tirada a primeira foto.
  private loadModel(): Promise<MobileNet> {
    this.model ??= (async () => {
      await import('@tensorflow/tfjs-backend-webgl');
      const mobilenet = await import('@tensorflow-models/mobilenet');
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })();
    this.model.catch(() => (this.model = undefined));
    return this.model;
  }

  private revokePhoto(): void {
    const url = this.photoUrl();
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}
