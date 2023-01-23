import { AxiosError } from 'axios';
import { useModal } from '../context';

export function useErrors() {
  const modals = useModal();
  return {
    onError: (error: AxiosError) => {
      modals.handleErrors(error);
    },
  };
}
