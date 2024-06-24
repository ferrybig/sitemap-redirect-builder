import { hydrateRoot } from 'react-dom/client';
import { createApp } from './main'


hydrateRoot(document.getElementById('root')!, createApp().jsx);
