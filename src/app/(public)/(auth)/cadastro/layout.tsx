export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#18027c',
      }}
    >
      {children}
    </div>
  );
}
