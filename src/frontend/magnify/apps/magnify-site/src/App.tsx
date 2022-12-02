import './App.css';
import { MagnifyProvider } from '@openfun/magnify-components';
import { AppRouter } from './components/AppRouter';

export default function App() {
  return (
    <MagnifyProvider>
      <AppRouter />
    </MagnifyProvider>
  );
}
