'use client';

import { useRender } from '@/hooks/useRender';

export default function Main() {
  const sectionContent = useRender();

  return (
      <div className="pb-24">
        {sectionContent}
      </div>
  );
}
