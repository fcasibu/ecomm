import { Tag } from 'lucide-react';

export function Suggestion({ children }: React.PropsWithChildren) {
  return (
    <li className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:!size-4">
      <Tag />
      {children}
    </li>
  );
}
