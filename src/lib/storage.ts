import { STORAGE_BUCKET } from './constants';

export function documentStoragePath(userId: string, documentId: string) {
  return `${STORAGE_BUCKET}/${userId}/${documentId}/original.pdf`;
}

export function documentExportPath(userId: string, documentId: string, version: number) {
  return `${STORAGE_BUCKET}/${userId}/${documentId}/exports/${version}.pdf`;
}
