import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

/**
 * Root application component.
 *
 * Auth state is automatically pre-hydrated from localStorage inside
 * authSlice's initialState — no manual restoreSession call is needed.
 *
 * react-hot-toast and AppRoutes will be installed as the feature
 * development progresses.
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
