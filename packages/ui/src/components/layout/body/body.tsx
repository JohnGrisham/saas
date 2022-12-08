export interface BodyProps {
  children: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({ children }) => {
  return <main className="flex justify-center p-8">{children}</main>;
};
