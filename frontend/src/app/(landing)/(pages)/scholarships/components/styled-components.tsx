

export const TitleStyledComponent = ({children}: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="bg-primary py-2 text-center px-2">
        <h1 className="text-3xl font-bold text-primary-foreground">
          {children}
        </h1>
      </div>
    </div>
  );
};
