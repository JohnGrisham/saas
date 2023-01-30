export interface BodyProps {
  children: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({ children }) => {
  return (
    <main className="flex h-full min-h-[92vh] justify-center bg-white p-8 dark:bg-black">
      {children}
    </main>
  );
};
