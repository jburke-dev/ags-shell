import { picker } from './picker';
import { AppProvider } from './providers/app-provider';

export * from './picker';
picker.addProvider(new AppProvider());
