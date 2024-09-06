import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from './firebase';

const storage = getStorage(app);

export async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(storage, 'logos/' + file.name);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}