import { create } from "zustand";

type DialogParams = Record<string, unknown> | undefined;

type DialogState = {
  isOpen: boolean;
  params?: DialogParams;
};

type DialogStore = {
  dialogs: Record<string, DialogState>;
  openDialog: (dialogName: string, params?: DialogParams) => void;
  closeDialog: (dialogName: string) => void;
  closeAllDialogs: () => void;
  getDialogState: (dialogName: string) => boolean;
  getDialogParams: (dialogName: string) => DialogParams | undefined;
};

export const useDialog = create<DialogStore>((set, get) => ({
  dialogs: {},

  openDialog: (dialogName, params) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [dialogName]: { isOpen: true, params },
      },
    })),

  closeDialog: (dialogName) =>
    set((state) => ({
      dialogs: {
        ...state.dialogs,
        [dialogName]: { isOpen: false },
      },
    })),

  closeAllDialogs: () =>
    set((state) => ({
      dialogs: Object.keys(state.dialogs).reduce((acc, dialogName) => {
        acc[dialogName] = { isOpen: false };
        return acc;
      }, {} as Record<string, DialogState>),
    })),

  getDialogState: (dialogName) => get().dialogs[dialogName]?.isOpen ?? false,

  getDialogParams: (dialogName) => get().dialogs[dialogName]?.params,
}));
