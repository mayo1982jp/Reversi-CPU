import * as React from "react";

type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

type ToastActionElement = React.ReactElement;

type ToastProps = Omit<ToasterToast, "id">;

type ToastState = ToasterToast[];

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
  | { type: typeof actionTypes.UPDATE_TOAST; toast: Partial<ToasterToast> & { id: string } }
  | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string };

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}

const reducers = (state: ToastState, action: Action): ToastState => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return [action.toast, ...state].slice(0, TOAST_LIMIT);
    case actionTypes.UPDATE_TOAST:
      return state.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t));
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) addToRemoveQueue(toastId);
      else state.forEach((t) => addToRemoveQueue(t.id));
      return state.map((t) => (t.id === toastId || toastId === undefined ? { ...t, open: false } : t));
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) return [];
      return state.filter((t) => t.id !== action.toastId);
    default:
      return state;
  }
};

const listeners: Array<(state: ToastState) => void> = [];

let memoryState: ToastState = [];

function dispatch(action: Action) {
  memoryState = reducers(memoryState, action);
  listeners.forEach((l) => l(memoryState));
}

export function toast({ ...props }: ToastProps) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [state]);

  return {
    toasts: state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export type { ToastActionElement, ToastProps, ToasterToast };