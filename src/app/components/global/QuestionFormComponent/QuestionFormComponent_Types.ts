import {ReactNode} from "react";

export interface FieldType {
  id: string | number;
  type: string;
  options?: { id?: string | number; label: string; value:  string  }[];
}


 export interface QuestionFormComponentProps {
  index: number;
  title: string;
  fields: FieldType[];
  onSubmitNewType: (index: number, field: FieldType) => void;
  onRemoveField: (index: number, fieldId: string | number) => void;
  onRemoveQuestion?: () => void;
  onUpdateTitle: (index: number, newTitle: string) => void
}

export interface btnCardProps {
  title: string;
  icon: ReactNode;
  onRemove?: () => void;
  listLength?: number;
}