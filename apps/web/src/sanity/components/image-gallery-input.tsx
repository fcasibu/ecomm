import React, { useReducer, useTransition } from 'react';
import { set, type StringInputProps } from 'sanity';
import { uploadImage } from '@/features/image/services/mutations';
import { useGetImages } from '@/features/image/hooks/use-get-images';
import { Button } from '@ecomm/ui/button';
import { Input } from '@ecomm/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ecomm/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ecomm/ui/tabs';
import { Card } from '@ecomm/ui/card';
import { Skeleton } from '@ecomm/ui/skeleton';
import { Badge } from '@ecomm/ui/badge';
import { toast } from '@ecomm/ui/hooks/use-toast';

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      return reject(new Error('Invalid file provided'));
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };

    reader.onerror = () => reject(new Error('File reading error'));

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

type State = {
  isOpen: boolean;
  activeTab: 'browse' | 'upload';
  selectedImage: string | null;
  uploadedFile: File | null;
  currentPage: number;
};

type Action =
  | { type: 'OPEN_DIALOG' }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'SET_TAB'; payload: 'browse' | 'upload' }
  | { type: 'SELECT_IMAGE'; payload: string }
  | { type: 'CLEAR_SELECTED_IMAGE' }
  | { type: 'SET_UPLOADED_FILE'; payload: File | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'UPLOAD_SUCCESS'; payload: string };

function galleryReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, isOpen: true };
    case 'CLOSE_DIALOG':
      return { ...state, isOpen: false };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'SELECT_IMAGE':
      return { ...state, selectedImage: action.payload };
    case 'CLEAR_SELECTED_IMAGE':
      return { ...state, selectedImage: null };
    case 'SET_UPLOADED_FILE':
      return { ...state, uploadedFile: action.payload };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        selectedImage: action.payload,
        uploadedFile: null,
        activeTab: 'browse',
      };
    default:
      return state;
  }
}

export function ImageGalleryInput({ onChange, value }: StringInputProps) {
  const [state, dispatch] = useReducer(galleryReducer, {
    isOpen: false,
    activeTab: 'browse',
    selectedImage: value || null,
    uploadedFile: null,
    currentPage: 1,
  });

  const [isPending, startTransition] = useTransition();
  const imagesPerPage = 12;

  const { data: result, isLoading, error } = useGetImages();
  const images = result?.success ? result.data : [];

  const paginatedImages = images.slice(
    (state.currentPage - 1) * imagesPerPage,
    state.currentPage * imagesPerPage,
  );

  const handleUpload = async () => {
    if (!state.uploadedFile) return;

    startTransition(async () => {
      if (!state.uploadedFile) return;

      const dataURL = await readFileAsDataURL(state.uploadedFile);

      const identifier = state.uploadedFile.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase();

      const result = await uploadImage(dataURL, identifier);

      if (result.success) {
        toast({
          title: 'Image uploaded successfully',
          description: 'Your image has been added to the gallery',
        });
        dispatch({ type: 'UPLOAD_SUCCESS', payload: result.data });
        onChange(set(result.data));
      }
    });
  };

  const handleImageSelect = (imageUrl: string) => {
    dispatch({ type: 'SELECT_IMAGE', payload: imageUrl });
    onChange(set(imageUrl));
    dispatch({ type: 'CLOSE_DIALOG' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      dispatch({ type: 'SET_UPLOADED_FILE', payload: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {state.selectedImage && (
          <div className="group relative">
            <img
              src={state.selectedImage}
              alt="Selected image"
              className="h-16 w-16 rounded-md border border-gray-200 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20">
              <Button
                aria-label="Remove"
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100"
                onClick={() => dispatch({ type: 'CLEAR_SELECTED_IMAGE' })}
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <Dialog
          open={state.isOpen}
          onOpenChange={(open) =>
            dispatch({ type: open ? 'OPEN_DIALOG' : 'CLOSE_DIALOG' })
          }
        >
          <DialogTrigger asChild>
            <Button type="button">
              {state.selectedImage ? 'Change Image' : 'Select Image'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Image Gallery</DialogTitle>
            </DialogHeader>
            <Tabs
              defaultValue={state.activeTab}
              value={state.activeTab}
              onValueChange={(value) =>
                dispatch({
                  type: 'SET_TAB',
                  payload: value as 'browse' | 'upload',
                })
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="browse">Browse Gallery</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-4">
                <div className="flex justify-end">
                  <Badge variant="outline">{images.length} images</Badge>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-md" />
                      ))}
                  </div>
                ) : error ? (
                  <div className="py-8 text-center text-red-500">
                    Failed to load images. Please try again.
                  </div>
                ) : images.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No images available
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {paginatedImages.map((imageUrl, index) => (
                        <Card
                          key={index}
                          className={`hover:ring-primary cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-offset-2 ${
                            state.selectedImage === imageUrl
                              ? 'ring-primary ring-2 ring-offset-2'
                              : ''
                          }`}
                          onClick={() => handleImageSelect(imageUrl)}
                        >
                          <div className="relative aspect-square">
                            <img
                              src={imageUrl}
                              alt={`Gallery image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                      {state.uploadedFile ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(state.uploadedFile)}
                              alt="Preview"
                              className="max-h-64 max-w-full object-contain"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            {state.uploadedFile.name} (
                            {Math.round(state.uploadedFile.size / 1024)} KB)
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              dispatch({
                                type: 'SET_UPLOADED_FILE',
                                payload: null,
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="rounded-full bg-gray-100 p-4">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                              </svg>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-900">
                                Drop files here or click to upload
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileChange}
                          />
                          <label htmlFor="file-upload">
                            <Button variant="outline" className="mt-4" asChild>
                              <span>Select File</span>
                            </Button>
                          </label>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleUpload}
                        disabled={!state.uploadedFile || isPending}
                      >
                        {isPending ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
