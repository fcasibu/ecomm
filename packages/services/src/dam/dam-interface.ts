export interface DAM {
  upload(file: string, identifier: string): Promise<string>;
}
