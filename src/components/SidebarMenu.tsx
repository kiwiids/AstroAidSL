import { ReactNode } from 'react';

interface SidebarMenuProps {
  children?: ReactNode;
}

export function SidebarMenu({ children }: SidebarMenuProps) {
  return (
    <aside className="hidden xl:block">
      <div className="fixed right-0 top-0 h-screen w-[380px] bg-[#0A0A0A] border-l border-white/10 p-4 overflow-y-auto">
        <div className="text-[#E0E0E0] font-medium mb-4">Menu</div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </aside>
  );
}

export default SidebarMenu;



