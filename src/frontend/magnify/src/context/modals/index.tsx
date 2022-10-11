import React, { useCallback, useState } from 'react';
import { MagnifyModal, MagnifyModalProps } from '../../components/design-system/Modal';
import { Maybe } from '../../types/misc';

export interface ModalContextInterface {
  showModal: (modalProps: MagnifyModalProps) => void;
}

const ModalContext = React.createContext<Maybe<ModalContextInterface>>(undefined);

type ModalsContextProviderProps = {
  children: React.ReactNode;
};

export const ModalContextProvider = ({ ...props }: ModalsContextProviderProps) => {
  const [allModals, setAllModals] = useState<MagnifyModalProps[]>([]);

  const getModalIndex = useCallback(
    (modalId: string): number => {
      return allModals.findIndex((modalItem) => {
        return modalItem.modalUniqueId === modalId;
      });
    },
    [allModals],
  );

  const hideModal = (modalId: string) => {
    const newModals = [...allModals];
    const index = getModalIndex(modalId);
    if (index >= 0) {
      newModals.splice(index, 1);
    }
    setAllModals(newModals);
  };

  const modalContext: ModalContextInterface = React.useMemo(
    () => ({
      showModal: (modalProps: MagnifyModalProps) => {
        if (getModalIndex(modalProps.modalUniqueId) >= 0) {
          return;
        }
        setAllModals((prevState) => {
          return [...prevState, modalProps];
        });
      },
    }),
    [allModals],
  );
  return (
    <ModalContext.Provider value={modalContext}>
      {allModals.map((modal) => {
        return (
          <MagnifyModal
            key={modal.modalUniqueId}
            {...modal}
            isOpen={true}
            onClickOutside={() => hideModal(modal.modalUniqueId)}
            onClose={() => hideModal(modal.modalUniqueId)}
          />
        );
      })}
      {props.children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const modalContext = React.useContext(ModalContext);

  if (modalContext) {
    return modalContext;
  }

  throw new Error(`useModal must be used within a ModalContext`);
};
