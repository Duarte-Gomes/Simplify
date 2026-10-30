import { Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
import type { MobileNet } from '@tensorflow-models/mobilenet';

interface Prediction {
  className: string;
  probability: number;
}

@Component({
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

  protected onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.revokePhoto();
    this.predictions.set([]);
    this.error.set(null);
    this.loading.set(true);
    this.photoUrl.set(URL.createObjectURL(file));
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
    if (url) {
      URL.revokeObjectURL(url);
    }
  }
}
