import { Button } from "@/components/ui/button"
import { Plus, Save, PenTool } from 'lucide-react';

type ButtonType = 'AddPostit' | 'Save' | 'SketchMode';

interface BoardButtonProps {
  onClick?: () => void;
  type: ButtonType;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

const getButtonContent = (type: ButtonType) => {
  switch (type) {
    case 'AddPostit':
      return (
        <>
          <Plus size={16} className="mr-2" />
          Add Post-it
        </>
      );
    case 'Save':
      return (
        <>
          <Save size={16} className="mr-2" />
          Save
        </>
      );
    case 'SketchMode':
      return (
        <>
          <PenTool size={16} className="mr-2" />
          Sketch Mode
        </>
      );
  }
};

export function BoardButton({ onClick, type, variant = 'default', disabled = false }: BoardButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant={variant}
      disabled={disabled}

    >
      {getButtonContent(type)}
    </Button>
  )
}
