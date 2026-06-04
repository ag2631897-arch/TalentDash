import { cn } from "@/lib/utils";

export const RaycastAnimatedBackground = () => {
  return (
    <div className={cn("fixed inset-0 z-0 pointer-events-none")}>
      <iframe
        src="https://unicorn.studio/embed/cbmTT38A0CcuYxeiyj5H?transparent=true"
        width="100%"
        height="100%"
        style={{ border: 'none', background: 'transparent', pointerEvents: 'none' }}
      />
    </div>
  );
};
