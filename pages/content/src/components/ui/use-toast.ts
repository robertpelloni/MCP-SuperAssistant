import { useToastStore } from '@src/stores/toast.store';

export const useToast = () => {
  const { addToast } = useToastStore();

  return {
    toast: (props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
      addToast({
        title: props.title || '',
        message: props.description || '',
        type: props.variant === 'destructive' ? 'error' : 'info',
        duration: 3000,
      });
    },
  };
};
