export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        backgroundColor: '#18027c',
      }}
    >
      {children}
    </div>
  );
}
