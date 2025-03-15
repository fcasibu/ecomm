import { BaseController } from '../base-controller';
import type { ImageService } from './image-service';

export class ImageController extends BaseController {
  constructor(private readonly imageService: ImageService) {
    super();
  }

  public async upload(file: string, identifier: string) {
    try {
      return await this.imageService.upload(file, identifier);
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Image upload failed',
      });
    }
  }
}
