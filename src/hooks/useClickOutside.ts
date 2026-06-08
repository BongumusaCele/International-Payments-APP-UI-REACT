import React from 'react';

export const useClickOutside = <TElement extends HTMLElement>(
  onClickOutside: () => void
) => {
  const elementRef = React.useRef<TElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (target instanceof Node && !elementRef.current?.contains(target)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClickOutside]);

  return elementRef;
};
