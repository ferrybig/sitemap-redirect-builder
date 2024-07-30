import { hydrateRoot } from 'react-dom/client';
import jsx from './main'
import { runTasks } from './hooks/useRunAfterInitialRender';

hydrateRoot(document.getElementById('root')!, jsx);
requestAnimationFrame(runTasks);